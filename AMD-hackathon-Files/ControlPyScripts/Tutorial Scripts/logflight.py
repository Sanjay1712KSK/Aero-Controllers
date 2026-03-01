import cosysairsim as airsim
import numpy as np
import csv
import time
import os

# ======================================================
# USER PARAMETERS
# ======================================================
VEHICLE_NAME = "Drone1"
LIDAR_NAME = "Lidar1"

FORWARD_SPEED = 6.0        # m/s
TARGET_ALTITUDE = -60.0    # NED (negative = up)
ALT_GAIN = 0.6
MAX_VZ = 3.0
CONTROL_DT = 0.1           # seconds

# Landing target (NED)
TARGET_X = -27060.0
TARGET_Y = -16090.0
TARGET_Z = -50.0           # NED equivalent of z=50

POSITION_TOLERANCE = 5.0   # meters

CSV_FILE = "flight_sensor_log.csv"

# ======================================================
# CONNECT
# ======================================================
client = airsim.MultirotorClient()
client.confirmConnection()

client.enableApiControl(True)
client.armDisarm(True)
client.takeoffAsync().join()

print("[INFO] Drone airborne")

# ======================================================
# CSV SETUP
# ======================================================
with open(CSV_FILE, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow([
        "time",
        "pos_x", "pos_y", "pos_z",
        "vel_x", "vel_y", "vel_z",
        "imu_ax", "imu_ay", "imu_az",
        "imu_gx", "imu_gy", "imu_gz",
        "baro_altitude",
        "lidar_points",
        "lidar_min_forward",
        "lidar_min_down"
    ])

# ======================================================
# HELPER FUNCTIONS
# ======================================================
def get_lidar_stats():
    data = client.getLidarData(LIDAR_NAME, VEHICLE_NAME)
    if len(data.point_cloud) < 3:
        return 0, None, None

    pts = np.array(data.point_cloud, dtype=np.float32).reshape(-1, 3)

    forward_pts = pts[pts[:, 0] > 0]
    down_pts = pts[pts[:, 2] > 0]

    min_forward = np.min(forward_pts[:, 0]) if len(forward_pts) > 0 else None
    min_down = np.min(down_pts[:, 2]) if len(down_pts) > 0 else None

    return len(pts), min_forward, min_down

# ======================================================
# MAIN CONTROL LOOP
# ======================================================
try:
    while True:
        state = client.getMultirotorState(VEHICLE_NAME)
        imu = client.getImuData(vehicle_name=VEHICLE_NAME)
        baro = client.getBarometerData(vehicle_name=VEHICLE_NAME)

        pos = state.kinematics_estimated.position
        vel = state.kinematics_estimated.linear_velocity

        # Altitude control
        alt_error = TARGET_ALTITUDE - pos.z_val
        vz = np.clip(ALT_GAIN * alt_error, -MAX_VZ, MAX_VZ)

        # Move forward
        client.moveByVelocityAsync(
            vx=FORWARD_SPEED,
            vy=0,
            vz=vz,
            duration=CONTROL_DT,
            vehicle_name=VEHICLE_NAME
        )

        # LiDAR stats
        lidar_count, lidar_min_fwd, lidar_min_down = get_lidar_stats()

        # Log data
        with open(CSV_FILE, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([
                time.time(),
                pos.x_val, pos.y_val, pos.z_val,
                vel.x_val, vel.y_val, vel.z_val,
                imu.linear_acceleration.x_val,
                imu.linear_acceleration.y_val,
                imu.linear_acceleration.z_val,
                imu.angular_velocity.x_val,
                imu.angular_velocity.y_val,
                imu.angular_velocity.z_val,
                baro.altitude,
                lidar_count,
                lidar_min_fwd,
                lidar_min_down
            ])

        # ==================================================
        # LANDING CONDITION
        # ==================================================
        if (
            abs(pos.x_val - TARGET_X) < POSITION_TOLERANCE and
            abs(pos.y_val - TARGET_Y) < POSITION_TOLERANCE and
            abs(pos.z_val - TARGET_Z) < POSITION_TOLERANCE
        ):
            print("[INFO] Target reached — landing initiated")
            break

        time.sleep(CONTROL_DT)

except KeyboardInterrupt:
    print("[INFO] Interrupted by user")

finally:
    client.hoverAsync().join()
    client.landAsync().join()
    client.armDisarm(False)
    client.enableApiControl(False)
    print("[INFO] Shutdown complete")
    print(f"[INFO] Sensor log saved to: {os.path.abspath(CSV_FILE)}")
