import cosysairsim as airsim
import numpy as np
import time
import random
import csv
from datetime import datetime

# =====================================================
# LOG FILE SETUP
# =====================================================
log_file = open("flight_log_with_weather_anomaly(2).csv", "w", newline="")
logger = csv.writer(log_file)

logger.writerow([
    "timestamp",
    "x", "y", "z",
    "vx", "vy", "vz",
    "imu_ax", "imu_ay", "imu_az",
    "baro_alt",
    "lidar_front_min",
    "weather_anomaly"
])
# =====================================================
# WEATHER ANOMALY STATE
# =====================================================
current_anomaly = {
    "active": False,
    "ax": 0.0,
    "ay": 0.0,
    "az": 0.0,
    "end_time": 0.0
}

# =====================================================
# HELPER FUNCTIONS
# =====================================================
def min_lidar_distance(lidar_data):
    if len(lidar_data.point_cloud) < 3:
        return float("inf")
    pts = np.array(lidar_data.point_cloud).reshape(-1, 3)
    return np.min(np.linalg.norm(pts, axis=1))


def weather_anomaly():
    """
    Stateful weather anomaly with duration and terminal notification.
    Returns:
        ax, ay, az : velocity disturbance
        event      : True only when anomaly STARTS
    """
    now = time.time()

    # If anomaly is currently active
    if current_anomaly["active"]:
        if now < current_anomaly["end_time"]:
            return (
                current_anomaly["ax"],
                current_anomaly["ay"],
                current_anomaly["az"],
                False
            )
        else:
            # Anomaly ends
            print("Weather anomaly ended!! Drone will fly freely")
            current_anomaly["active"] = False
            return 0.0, 0.0, 0.0, False

    # Possibly start a new anomaly
    if random.random() < 0.03:
        duration = random.uniform(1.0, 3.0)  # seconds

        ax = random.uniform(-2.5, 2.5)
        ay = random.uniform(-2.5, 2.5)
        az = random.uniform(-1.0, 1.0)

        direction = []
        if ax > 0: direction.append("Forward")
        if ax < 0: direction.append("Backward")
        if ay > 0: direction.append("Right")
        if ay < 0: direction.append("Left")
        if az > 0: direction.append("Updraft")
        if az < 0: direction.append("Downdraft")

        print(
            f"⚠ WEATHER ANOMALY STARTED | "
            f"Direction: {', '.join(direction)} | "
            f"Duration: {duration:.2f}s"
        )

        current_anomaly.update({
            "active": True,
            "ax": ax,
            "ay": ay,
            "az": az,
            "end_time": now + duration
        })

        return ax, ay, az, True

    return 0.0, 0.0, 0.0, False



# =====================================================
# AIRSIM CONNECTION
# =====================================================
client = airsim.MultirotorClient()
client.confirmConnection()

client.enableApiControl(True)
client.armDisarm(True)

print("Takeoff")
client.takeoffAsync().join()
time.sleep(2)

# =====================================================
# CHECKPOINTS (AirSim coordinates, meters, NED)
# =====================================================
checkpoints = [
    (  0.00,   0.00,  -15.00),
    ( -0.80,   9.80,  -15.80),
    ( -22.60, -22.00, -15.80),
    ( -28.80, -38.70,  -3.80),
    ( -46.40, -63.20,  -3.80),
    ( -99.60, -75.30,  -3.80),
    ( -108.50, -148.60, -5.00),
    ( -162.70, -107.90, -5.40),
    ( -222.33,   4.37,  -2.50),
    ( -241.71,  31.73,  -1.00),
    ( -274.75,  56.49,  -6.25)
]

# =====================================================
# CONTROL PARAMETERS
# =====================================================
SPEED = 2.5          # m/s
DT = 0.2             # control timestep
ARRIVAL_RADIUS = 2.0 # meters

# =====================================================
# CHECKPOINT NAVIGATION LOOP
# =====================================================
for i, (cx, cy, cz) in enumerate(checkpoints):
    print(f"Checkpoint {i+1}/{len(checkpoints)}")

    while True:
        state = client.getMultirotorState()
        pos = state.kinematics_estimated.position

        dx = cx - pos.x_val
        dy = cy - pos.y_val
        dz = cz - pos.z_val

        dist = np.sqrt(dx*dx + dy*dy + dz*dz)

        if dist < ARRIVAL_RADIUS:
            client.moveByVelocityAsync(0, 0, 0, 1).join()
            break

        # Base navigation velocity
        vx = (dx / dist) * SPEED
        vy = (dy / dist) * SPEED
        vz = (dz / dist) * SPEED

        # ---------------- WEATHER ANOMALY ----------------
        ax_w, ay_w, az_w, anomaly_event = (0.0, 0.0, 0.0, False)

        # Disable anomalies near checkpoints / landing
        if dist > 5.0:
            ax_w, ay_w, az_w, anomaly_event = weather_anomaly()

        vx += ax_w
        vy += ay_w
        vz += az_w
        # -------------------------------------------------

        # ---------------- SENSOR READS -------------------
        imu = client.getImuData()
        baro = client.getBarometerData()
        lidar = client.getLidarData(lidar_name="LidarFront")

        lidar_min = min_lidar_distance(lidar)
        # -------------------------------------------------

        client.moveByVelocityAsync(vx, vy, vz, DT)
        time.sleep(DT)

        # ---------------- LOGGING ------------------------
        logger.writerow([
            datetime.utcnow().isoformat(),
            pos.x_val, pos.y_val, pos.z_val,
            vx, vy, vz,
            imu.linear_acceleration.x_val,
            imu.linear_acceleration.y_val,
            imu.linear_acceleration.z_val,
            baro.altitude,
            lidar_min,
            int(anomaly_event)
        ])
        # -------------------------------------------------

# =====================================================
# FINAL LANDING
# =====================================================
print("Reached final navigation point")
time.sleep(2)

print("Initiating Landing...")
print("~~~~ Better than Ryanair 👏👏👏👏👏👏👏 ~~~~")

client.moveToPositionAsync(
    -274.75, 56.49, -6.25,
    velocity=0.8
).join()

client.hoverAsync().join()
time.sleep(1)

client.landAsync().join()
client.armDisarm(False)
client.enableApiControl(False)

log_file.close()

print("Mission complete. Log saved to flight_log_with_weather_anomaly.csv")
