import cosysairsim as airsim
import numpy as np
import time
import csv
from datetime import datetime
import math

def quaternion_to_euler(q):
    """
    Convert quaternion to roll, pitch, yaw (radians)
    Compatible with Cosys-AirSim
    """
    x, y, z, w = q.x_val, q.y_val, q.z_val, q.w_val

    # Roll (x-axis rotation)
    sinr_cosp = 2 * (w * x + y * z)
    cosr_cosp = 1 - 2 * (x * x + y * y)
    roll = math.atan2(sinr_cosp, cosr_cosp)

    # Pitch (y-axis rotation)
    sinp = 2 * (w * y - z * x)
    if abs(sinp) >= 1:
        pitch = math.copysign(math.pi / 2, sinp)
    else:
        pitch = math.asin(sinp)

    # Yaw (z-axis rotation)
    siny_cosp = 2 * (w * z + x * y)
    cosy_cosp = 1 - 2 * (y * y + z * z)
    yaw = math.atan2(siny_cosp, cosy_cosp)

    return roll, pitch, yaw


LOG_FILE = "baseline_flight_log_clear1.csv"
DT = 0.1                 
SPEED = 2.5                
ARRIVAL_RADIUS = 2.0      

WEATHER_TYPE = "clear"
WIND_VECTOR = (0.0, 0.0, 0.0)
WIND_SPEED = 0.0
AIR_DENSITY = 1.225         # kg/m^3 (standard)
SENSOR_NOISE_LEVEL = 0.0    # baseline


log_file = open(LOG_FILE, "w", newline="")
logger = csv.writer(log_file)

logger.writerow([
    "timestamp",

    "pos_x", "pos_y", "pos_z",

    "roll", "pitch", "yaw",

    "vel_x", "vel_y", "vel_z",

    "omega_x", "omega_y", "omega_z",

    "acc_x", "acc_y", "acc_z",

    "gyro_x", "gyro_y", "gyro_z",

    "baro_altitude",

    "mag_x", "mag_y", "mag_z",

    "lidar_point_count",
    "lidar_min_range",

    "cmd_roll", "cmd_pitch", "cmd_yaw",
    "cmd_vx", "cmd_vy", "cmd_vz",
    "throttle",

    "wind_x", "wind_y", "wind_z",
    "wind_speed",
    "weather",
    "air_density",
    "sensor_noise"
])

client = airsim.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)
client.armDisarm(True)

print("Taking off...")
client.takeoffAsync().join()
time.sleep(2)

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

def lidar_min_distance(lidar):
    if len(lidar.point_cloud) < 3:
        return float("inf")
    pts = np.array(lidar.point_cloud).reshape(-1, 3)
    return np.min(np.linalg.norm(pts, axis=1))

for idx, (cx, cy, cz) in enumerate(checkpoints):
    print(f"Checkpoint {idx+1}/{len(checkpoints)}")

    while True:
        state = client.getMultirotorState()
        kin = state.kinematics_estimated

        pos = kin.position
        vel = kin.linear_velocity
        ang_vel = kin.angular_velocity

        roll, pitch, yaw = quaternion_to_euler(kin.orientation)


        dx = cx - pos.x_val
        dy = cy - pos.y_val
        dz = cz - pos.z_val
        dist = np.sqrt(dx*dx + dy*dy + dz*dz)

        if dist < ARRIVAL_RADIUS:
            client.moveByVelocityAsync(0, 0, 0, 1).join()
            break

        cmd_vx = (dx / dist) * SPEED
        cmd_vy = (dy / dist) * SPEED
        cmd_vz = (dz / dist) * SPEED

        client.moveByVelocityAsync(cmd_vx, cmd_vy, cmd_vz, DT)

        imu = client.getImuData()
        baro = client.getBarometerData()
        mag = client.getMagnetometerData()
        lidar = client.getLidarData(lidar_name="LidarFront")

        throttle = min(1.0, np.linalg.norm([cmd_vx, cmd_vy, cmd_vz]) / SPEED)

        logger.writerow([
            datetime.utcnow().isoformat(),

            pos.x_val, pos.y_val, pos.z_val,
            roll, pitch, yaw,
            vel.x_val, vel.y_val, vel.z_val,
            ang_vel.x_val, ang_vel.y_val, ang_vel.z_val,

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

            len(lidar.point_cloud) // 3,
            lidar_min_distance(lidar),

            roll, pitch, yaw,
            cmd_vx, cmd_vy, cmd_vz,
            throttle,

            WIND_VECTOR[0], WIND_VECTOR[1], WIND_VECTOR[2],
            WIND_SPEED,
            WEATHER_TYPE,
            AIR_DENSITY,
            SENSOR_NOISE_LEVEL
        ])

        time.sleep(DT)

print("Landing...")
client.hoverAsync().join()
time.sleep(1)
client.landAsync().join()

client.armDisarm(False)
client.enableApiControl(False)
log_file.close()

print("Baseline mission complete. Log saved.")