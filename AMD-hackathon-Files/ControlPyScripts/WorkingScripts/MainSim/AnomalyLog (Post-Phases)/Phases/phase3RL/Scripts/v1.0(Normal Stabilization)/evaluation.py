import cosysairsim as airsim
import numpy as np
import time
import csv
import math
import random
from datetime import datetime

# ============================
# CONFIGURATION
# ============================

DT = 0.1
BASE_SPEED = 2.5
ARRIVAL_RADIUS = 2.0

LOG_FILE = "phase3_evaluation_log.csv"

# ---- TEST MODES ----
TEST_BASELINE = 0
TEST_WIND_IMPULSE = 1
TEST_CONTINUOUS_TURBULENCE = 2
TEST_EXTREME_EDGE = 3

TEST_MODE = TEST_WIND_IMPULSE   # <-- CHANGE HERE

# ============================
# CHECKPOINTS (USER PROVIDED)
# ============================

checkpoints = [
    (0.00, 0.00, -15.00),
    (-0.80, 9.80, -15.80),
    (-22.60, -22.00, -15.80),
    (-28.80, -38.70, -3.80),
    (-46.40, -63.20, -3.80),
    (-99.60, -75.30, -3.80),
    (-108.50, -148.60, -5.00),
    (-162.70, -107.90, -5.40),
    (-222.33, 4.37, -2.50),
    (-241.71, 31.73, -1.00),
    (-274.75, 56.49, -6.25)
]

# ============================
# UTILS
# ============================

def quat_to_euler(q):
    x, y, z, w = q.x_val, q.y_val, q.z_val, q.w_val
    roll = math.atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y))
    pitch = math.asin(max(-1.0, min(1.0, 2*(w*y - z*x))))
    yaw = math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z))
    return roll, pitch, yaw

def lidar_min_range(lidar):
    if len(lidar.point_cloud) < 3:
        return float("inf")
    pts = np.array(lidar.point_cloud).reshape(-1, 3)
    return np.min(np.linalg.norm(pts, axis=1))

# ============================
# WEATHER MODEL
# ============================

def weather_anomaly(step):
    if TEST_MODE == TEST_BASELINE:
        return np.zeros(3), "clear"

    if TEST_MODE == TEST_WIND_IMPULSE:
        if 50 < step < 80:
            print("⚠️ WIND IMPULSE ACTIVE")
            return np.array([2.0, -1.5, 0.5]), "impulse"
        return np.zeros(3), "clear"

    if TEST_MODE == TEST_CONTINUOUS_TURBULENCE:
        wind = np.random.uniform(-1.5, 1.5, size=3)
        return wind, "turbulence"

    if TEST_MODE == TEST_EXTREME_EDGE:
        wind = np.random.uniform(-3.5, 3.5, size=3)
        return wind, "extreme"

    return np.zeros(3), "clear"

# ============================
# LOGGER SETUP
# ============================

log_file = open(LOG_FILE, "w", newline="")
logger = csv.writer(log_file)

logger.writerow([
    "timestamp",
    "checkpoint_id",
    "pos_x","pos_y","pos_z",
    "roll","pitch","yaw",
    "vel_x","vel_y","vel_z",
    "ang_x","ang_y","ang_z",
    "acc_x","acc_y","acc_z",
    "gyro_x","gyro_y","gyro_z",
    "baro_alt",
    "mag_x","mag_y","mag_z",
    "lidar_min",
    "cmd_vx","cmd_vy","cmd_vz",
    "wind_x","wind_y","wind_z",
    "weather_type"
])

# ============================
# AIRSIM SETUP
# ============================

client = airsim.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)
client.armDisarm(True)

print("🚀 Taking off")
client.takeoffAsync().join()
time.sleep(2)

# ============================
# FLIGHT LOOP
# ============================

global_step = 0

for cp_id, (cx, cy, cz) in enumerate(checkpoints):
    print(f"\n📍 CHECKPOINT {cp_id+1}/{len(checkpoints)}")

    while True:
        global_step += 1
        state = client.getMultirotorState()
        kin = state.kinematics_estimated

        pos = np.array([kin.position.x_val, kin.position.y_val, kin.position.z_val])
        vel = kin.linear_velocity
        ang = kin.angular_velocity

        roll, pitch, yaw = quat_to_euler(kin.orientation)

        dist = np.linalg.norm(np.array([cx,cy,cz]) - pos)
        if dist < ARRIVAL_RADIUS:
            print("✅ Checkpoint reached")
            client.moveByVelocityAsync(0,0,0,1).join()
            break

        direction = (np.array([cx,cy,cz]) - pos) / (dist + 1e-6)
        base_v = BASE_SPEED * direction

        wind, weather_type = weather_anomaly(global_step)
        cmd_v = base_v + wind

        client.moveByVelocityAsync(cmd_v[0], cmd_v[1], cmd_v[2], DT)

        imu = client.getImuData()
        baro = client.getBarometerData()
        mag = client.getMagnetometerData()
        lidar = client.getLidarData(lidar_name="LidarFront")

        logger.writerow([
            datetime.utcnow().isoformat(),
            cp_id,
            pos[0], pos[1], pos[2],
            roll, pitch, yaw,
            vel.x_val, vel.y_val, vel.z_val,
            ang.x_val, ang.y_val, ang.z_val,
            imu.linear_acceleration.x_val,
            imu.linear_acceleration.y_val,
            imu.linear_acceleration.z_val,
            imu.angular_velocity.x_val,
            imu.angular_velocity.y_val,
            imu.angular_velocity.z_val,
            baro.altitude,
            mag.magnetic_field_body.x_val,
            mag.magnetic_field_body.y_val,
            mag.magnetic_field_body.z_val,
            lidar_min_range(lidar),
            cmd_v[0], cmd_v[1], cmd_v[2],
            wind[0], wind[1], wind[2],
            weather_type
        ])

        if global_step % 20 == 0:
            print(f"Step {global_step} | Dist {dist:.2f} | Weather: {weather_type}")

        time.sleep(DT)

# ============================
# LANDING
# ============================

print("\n🛬 Landing")
client.hoverAsync().join()
time.sleep(1)
client.landAsync().join()

client.armDisarm(False)
client.enableApiControl(False)
log_file.close()

print(f"\n✅ Phase-3 evaluation complete. Log saved to {LOG_FILE}")
