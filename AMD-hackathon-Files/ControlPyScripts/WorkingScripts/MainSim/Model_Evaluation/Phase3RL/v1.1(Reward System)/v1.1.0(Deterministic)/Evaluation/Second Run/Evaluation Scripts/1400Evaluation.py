import numpy as np
import cosysairsim as airsim
import time
import math
import csv
from datetime import datetime
from stable_baselines3 import PPO
DT = 0.1
BASE_SPEED = 2.5
MAX_STEPS_PER_CHECKPOINT = 300
MODEL_PATH = "phase3_ppo1.1_deterministic_resume_140048_steps.zip"
CSV_LOG = "phase3_ppo1.1_deterministic_resume_140048_steps_evaluation_log_.csv"
CHECKPOINTS = [
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
def quat_to_euler(q):
    x, y, z, w = q.x_val, q.y_val, q.z_val, q.w_val
    roll = math.atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y))
    pitch = math.asin(max(-1.0, min(1.0, 2*(w*y - z*x))))
    yaw = math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z))
    return roll, pitch, yaw
def apply_wind():
    return np.array([
        np.random.uniform(-1.5, 1.5),
        np.random.uniform(-1.5, 1.5),
        0.0
    ])
client = airsim.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)
client.armDisarm(True)
print("Dum dum la illla Dandanakkka thaaaan")
print("vartaaa maamey...Durrrrrrrrrrr Byeeeeeeeeeeeee...")
client.takeoffAsync().join()
time.sleep(2)
model = PPO.load(MODEL_PATH, device="cuda")
print("PPO model loaded (evaluation mode)")
with open(CSV_LOG, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow([
        "timestamp",
        "checkpoint_id",
        "step",
        "roll", "pitch", "yaw",
        "vel_x", "vel_y", "vel_z",
        "ang_vel_x", "ang_vel_y", "ang_vel_z",
        "acc_x", "acc_y", "acc_z",
        "wind_x", "wind_y", "wind_z",
        "wind_speed"
    ])
    for idx, (cx, cy, cz) in enumerate(CHECKPOINTS):
        print(f"\n Checkpoint {idx+1}/{len(CHECKPOINTS)}")
        for step in range(MAX_STEPS_PER_CHECKPOINT):
            state = client.getMultirotorState()
            kin = state.kinematics_estimated
            imu = client.getImuData()
            pos = np.array([
                kin.position.x_val,
                kin.position.y_val,
                kin.position.z_val
            ])
            target = np.array([cx, cy, cz])
            direction = target - pos
            dist = np.linalg.norm(direction)
            if dist < 2.0:
                print("Checkpoint reached")
                break
            direction /= (dist + 1e-6)
            base_vel = BASE_SPEED * direction
            roll, pitch, yaw = quat_to_euler(kin.orientation)
            obs = np.array([
                roll, pitch, yaw,
                kin.linear_velocity.x_val,
                kin.linear_velocity.y_val,
                kin.linear_velocity.z_val,
                kin.angular_velocity.x_val,
                kin.angular_velocity.y_val,
                kin.angular_velocity.z_val,
                imu.linear_acceleration.x_val,
                imu.linear_acceleration.y_val,
                imu.linear_acceleration.z_val,
                imu.angular_velocity.x_val,
                imu.angular_velocity.y_val,
                imu.angular_velocity.z_val
            ], dtype=np.float32)
            action, _ = model.predict(obs, deterministic=True)
            wind = apply_wind()
            vx = base_vel[0] + action[0] + wind[0]
            vy = base_vel[1] + action[1] + wind[1]
            vz = base_vel[2] + action[2] + wind[2]
            client.moveByVelocityAsync(vx, vy, vz, DT).join()
            writer.writerow([
                datetime.utcnow().isoformat(),
                idx + 1,
                step,
                roll, pitch, yaw,
                kin.linear_velocity.x_val,
                kin.linear_velocity.y_val,
                kin.linear_velocity.z_val,
                kin.angular_velocity.x_val,
                kin.angular_velocity.y_val,
                kin.angular_velocity.z_val,
                imu.linear_acceleration.x_val,
                imu.linear_acceleration.y_val,
                imu.linear_acceleration.z_val,
                wind[0], wind[1], wind[2],
                np.linalg.norm(wind)
            ])
            time.sleep(DT)
print("\n Retard Retard... 50 40 30 TouchDownnnnn...")
client.landAsync().join()
client.armDisarm(False)
client.enableApiControl(False)
print(f"\n Bimbilikaaa pilaaapiiiiiiii. Log saved as {CSV_LOG}")