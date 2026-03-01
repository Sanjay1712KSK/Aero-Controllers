import numpy as np
import cosysairsim as airsim
import time
import math
import csv
import os
from datetime import datetime
from stable_baselines3 import PPO

# =========================
# CONFIG
# =========================
DT = 0.15
BASE_SPEED = 2.5
ARRIVAL_RADIUS = 2.0
MAX_STEPS_PER_CHECKPOINT = 300

MODEL_PATH = "phase3_stochastic_run1_240224_steps.zip"
CSV_LOG = "phase3_stochastic_run1_240224_steps_Evaluation_Log.csv"

ACTION_LIMIT = 3.0
SATURATION_THRESH = 0.9

# =========================
# CHECKPOINTS (DO NOT TOUCH)
# =========================
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

# =========================
# UTILS
# =========================
def quat_to_euler(q):
    x, y, z, w = q.x_val, q.y_val, q.z_val, q.w_val
    roll = math.atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y))
    pitch = math.asin(max(-1.0, min(1.0, 2*(w*y - z*x))))
    yaw = math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z))
    return roll, pitch, yaw

# =========================
# INIT
# =========================
client = airsim.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)
client.armDisarm(True)

# CPU is correct for PPO MLP evaluation
model = PPO.load(MODEL_PATH, device="cpu")

wind = np.zeros(3)

file_exists = os.path.isfile(CSV_LOG)
log_file = open(CSV_LOG, "a", newline="")
logger = csv.writer(log_file)

if not file_exists:
    logger.writerow([
        "timestamp",
        "checkpoint_id",
        "step",
        "pos_x", "pos_y", "pos_z",
        "roll", "pitch", "yaw",
        "vel_x", "vel_y", "vel_z",
        "vel_norm",
        "acc_x", "acc_y", "acc_z",
        "gyro_x", "gyro_y", "gyro_z",
        "wind_x", "wind_y", "wind_z",
        "wind_speed",
        "ppo_dx", "ppo_dy", "ppo_dz",
        "ppo_action_norm",
        "action_saturated"
    ])

# =========================
# TAKEOFF
# =========================
print("\n🚀 Evaluation started (Phase-3 Stochastic-Smooth PPO)")
client.takeoffAsync().join()
time.sleep(2)

# =========================
# MAIN LOOP
# =========================
for cid, target in enumerate(checkpoints):
    print(f"\n🎯 CHECKPOINT {cid+1}/{len(checkpoints)}")

    for step in range(MAX_STEPS_PER_CHECKPOINT):

        # --- Smooth stochastic wind (time-correlated)
        wind += np.random.uniform(-0.15, 0.15, size=3)
        wind = np.clip(wind, -1.2, 1.2)

        state = client.getMultirotorState()

        # Evaluation-only early exit on collision
        if state.collision.has_collided:
            print(f"❌ Collision at checkpoint {cid+1}, step {step}")
            break

        kin = state.kinematics_estimated
        imu = client.getImuData()

        pos = np.array([
            kin.position.x_val,
            kin.position.y_val,
            kin.position.z_val
        ])

        dist = np.linalg.norm(np.array(target) - pos)
        if dist < ARRIVAL_RADIUS:
            print(f"✅ Checkpoint {cid+1} reached")
            break

        # =========================
        # NOMINAL GUIDANCE (FULL XYZ — TRAINING-CONSISTENT)
        # =========================
        direction = (np.array(target) - pos) / (dist + 1e-6)
        base_v = BASE_SPEED * direction

        # =========================
        # OBSERVATION
        # =========================
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

        # =========================
        # PPO RESIDUAL ACTION
        # =========================
        action, _ = model.predict(obs, deterministic=True)

        action_norm = np.linalg.norm(action)
        action_saturated = int(action_norm > SATURATION_THRESH * ACTION_LIMIT)

        # =========================
        # VELOCITY COMPOSITION
        # =========================
        vx = base_v[0] + action[0] + wind[0]
        vy = base_v[1] + action[1] + wind[1]
        vz = base_v[2] + action[2] + wind[2]

        # Evaluation-only vertical safety envelope
        vz = np.clip(vz, -2.5, 2.5)

        vel_norm = np.linalg.norm([vx, vy, vz])

        client.moveByVelocityAsync(vx, vy, vz, DT).join()

        # =========================
        # LOGGING
        # =========================
        logger.writerow([
            datetime.utcnow().isoformat(),
            cid + 1,
            step,
            pos[0], pos[1], pos[2],
            roll, pitch, yaw,
            kin.linear_velocity.x_val,
            kin.linear_velocity.y_val,
            kin.linear_velocity.z_val,
            vel_norm,
            imu.linear_acceleration.x_val,
            imu.linear_acceleration.y_val,
            imu.linear_acceleration.z_val,
            imu.angular_velocity.x_val,
            imu.angular_velocity.y_val,
            imu.angular_velocity.z_val,
            wind[0], wind[1], wind[2],
            np.linalg.norm(wind),
            float(action[0]),
            float(action[1]),
            float(action[2]),
            action_norm,
            action_saturated
        ])

        time.sleep(DT)

# =========================
# SHUTDOWN
# =========================
print("\n🛬 Evaluation complete — landing")
client.hoverAsync().join()
time.sleep(1)
client.landAsync().join()
client.armDisarm(False)
client.enableApiControl(False)
log_file.close()

print("\n✅ Phase-3 stochastic-smooth evaluation finished")
