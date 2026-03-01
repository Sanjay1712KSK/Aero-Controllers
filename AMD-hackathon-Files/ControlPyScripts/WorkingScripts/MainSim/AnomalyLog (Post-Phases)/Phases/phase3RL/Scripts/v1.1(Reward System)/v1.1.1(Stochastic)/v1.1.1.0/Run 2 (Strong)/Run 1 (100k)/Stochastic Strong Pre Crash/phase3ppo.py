import gym
import numpy as np
import cosysairsim as airsim
import time
import math
import csv
import os
from datetime import datetime

from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import CheckpointCallback

print("\n Phase-3 RL | STOCHASTIC STRONG (XY-ONLY CURRICULUM) ")

# =====================================================
# CONFIG
# =====================================================
DT = 0.15
BASE_SPEED = 2.5
MAX_STEPS = 200

TOTAL_TIMESTEPS = 100_000
CHUNK_SIZE = 25_000
COOLDOWN_SECONDS = 300

MODEL_START = "phase3_stochastic_run1_240224_steps.zip"
AUTOSAVE_DIR = "./autosaves_strong"
CSV_LOG = "phase3_stochastic_strong_xy_training_log.csv"

TARGET = np.array([0.0, 0.0, -15.0])

# =====================================================
# CSV HELPERS
# =====================================================
def get_last_episode(csv_path):
    if not os.path.isfile(csv_path):
        return 0
    try:
        with open(csv_path, "r") as f:
            rows = list(csv.reader(f))
            return int(rows[-1][1]) if len(rows) > 1 else 0
    except:
        return 0

def get_last_global_step(csv_path):
    if not os.path.isfile(csv_path):
        return 0
    try:
        with open(csv_path, "r") as f:
            rows = list(csv.reader(f))
            return int(rows[-1][2]) if len(rows) > 1 else 0
    except:
        return 0

# =====================================================
# MATH
# =====================================================
def quat_to_euler(q):
    x, y, z, w = q.x_val, q.y_val, q.z_val, q.w_val
    roll = math.atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y))
    pitch = math.asin(max(-1.0, min(1.0, 2*(w*y - z*x))))
    yaw = math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z))
    return roll, pitch, yaw

# =====================================================
# ENVIRONMENT
# =====================================================
class AirSimDronePPOEnv(gym.Env):
    def __init__(self):
        super().__init__()

        self.client = airsim.MultirotorClient()
        self.client.confirmConnection()
        self.client.enableApiControl(True)
        self.client.armDisarm(True)

        # ⚠ MUST MATCH PRETRAINED MODEL
        self.action_space = gym.spaces.Box(
            low=np.array([-0.5, -0.5, -0.3], dtype=np.float32),
            high=np.array([0.5, 0.5, 0.3], dtype=np.float32)
        )

        self.observation_space = gym.spaces.Box(
            low=-np.inf, high=np.inf, shape=(15,), dtype=np.float32
        )

        self.target = TARGET.copy()
        self.wind_vector = np.zeros(3)

        self.step_count = 0
        self.episode_count = 0

        self.global_episode_offset = get_last_episode(CSV_LOG)
        self.global_step = get_last_global_step(CSV_LOG)

        file_exists = os.path.isfile(CSV_LOG)
        self.log_file = open(CSV_LOG, "a", newline="")
        self.logger = csv.writer(self.log_file)

        if not file_exists:
            self.logger.writerow([
                "timestamp",
                "episode",
                "global_step",
                "step_in_episode",
                "roll", "pitch", "yaw",
                "vel_x", "vel_y", "vel_z",
                "acc_x", "acc_y", "acc_z",
                "gyro_x", "gyro_y", "gyro_z",
                "wind_x", "wind_y", "wind_z",
                "wind_speed",
                "action_dx", "action_dy", "action_dz"
            ])

    # =================================================
    def reset(self):
        self.step_count = 0
        self.episode_count += 1
        self.wind_vector[:] = 0.0

        global_ep = self.global_episode_offset + self.episode_count
        print(f"\n EPISODE {global_ep} | STOCHASTIC STRONG (XY-ONLY)")

        self.client.reset()
        time.sleep(1)
        self.client.enableApiControl(True)
        self.client.armDisarm(True)
        self.client.takeoffAsync().join()
        time.sleep(1)

        return self._get_obs()

    # =================================================
    def _apply_wind(self):
        """
        STRONG STOCHASTIC WIND — XY ONLY (CRITICAL FIX)
        """
        max_wind = min(2.0, 0.5 + 0.002 * self.global_step)

        self.wind_vector[0] += np.random.uniform(-0.25, 0.25)
        self.wind_vector[1] += np.random.uniform(-0.25, 0.25)
        self.wind_vector[2] = 0.0  # ❗ NO Z WIND (KEY FIX)

        self.wind_vector = np.clip(self.wind_vector, -max_wind, max_wind)

    # =================================================
    def step(self, action):
        self.step_count += 1
        self.global_step += 1

        self._apply_wind()

        state = self.client.getMultirotorState()
        kin = state.kinematics_estimated

        pos = np.array([
            kin.position.x_val,
            kin.position.y_val,
            kin.position.z_val
        ])

        direction = self.target - pos
        dist = np.linalg.norm(direction) + 1e-6
        direction /= dist

        base_v = BASE_SPEED * direction

        vx = base_v[0] + action[0] + self.wind_vector[0]
        vy = base_v[1] + action[1] + self.wind_vector[1]
        vz = base_v[2] + action[2]               # ❗ no Z wind

        self.client.moveByVelocityAsync(vx, vy, vz, DT).join()

        obs = self._get_obs()
        reward, done, reason = self._compute_reward(state)

        if self.step_count % 2 == 0:
            self._log_step(action)

        if done:
            print(f"TERMINATED: {reason}")

        return obs, reward, done, {}

    # =================================================
    def _get_obs(self):
        state = self.client.getMultirotorState()
        kin = state.kinematics_estimated
        imu = self.client.getImuData()

        roll, pitch, yaw = quat_to_euler(kin.orientation)

        return np.array([
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

    # =================================================
    def _compute_reward(self, state):
        kin = state.kinematics_estimated
        roll, pitch, _ = quat_to_euler(kin.orientation)

        angular_penalty = (
            abs(kin.angular_velocity.x_val) +
            abs(kin.angular_velocity.y_val)
        )

        pos_error = np.linalg.norm(
            np.array([kin.position.x_val, kin.position.y_val]) -
            self.target[:2]
        )

        altitude_error = kin.position.z_val - self.target[2]

        reward = (
            -1.0 * (abs(roll) + abs(pitch))
            -0.1 * angular_penalty
            -0.05 * pos_error
        )

        # SOFT altitude penalty
        if altitude_error > 5.0:
            reward -= 5.0 * altitude_error

        # HARD crash only if catastrophic
        if altitude_error > 15.0:
            return reward - 200.0, True, "CRITICAL_ALTITUDE_LOSS"

        if self.step_count >= MAX_STEPS:
            return reward, True, "MAX_STEPS_REACHED"

        return reward, False, "RUNNING"

    # =================================================
    def _log_step(self, action):
        state = self.client.getMultirotorState()
        kin = state.kinematics_estimated
        imu = self.client.getImuData()
        roll, pitch, yaw = quat_to_euler(kin.orientation)

        self.logger.writerow([
            datetime.utcnow().isoformat(),
            self.global_episode_offset + self.episode_count,
            self.global_step,
            self.step_count,
            roll, pitch, yaw,
            kin.linear_velocity.x_val,
            kin.linear_velocity.y_val,
            kin.linear_velocity.z_val,
            imu.linear_acceleration.x_val,
            imu.linear_acceleration.y_val,
            imu.linear_acceleration.z_val,
            imu.angular_velocity.x_val,
            imu.angular_velocity.y_val,
            imu.angular_velocity.z_val,
            self.wind_vector[0],
            self.wind_vector[1],
            self.wind_vector[2],
            np.linalg.norm(self.wind_vector),
            float(action[0]), float(action[1]), float(action[2])
        ])
        self.log_file.flush()

    def close(self):
        self.log_file.close()
        self.client.enableApiControl(False)

# =====================================================
# TRAINING LOOP
# =====================================================
env = AirSimDronePPOEnv()

model = PPO.load(
    MODEL_START,
    env=env,
    device="cuda"
)

checkpoint = CheckpointCallback(
    save_freq=CHUNK_SIZE,
    save_path=AUTOSAVE_DIR,
    name_prefix="phase3_stochastic_strong_xy"
)

trained = 0

while trained < TOTAL_TIMESTEPS:
    remaining = TOTAL_TIMESTEPS - trained
    chunk = min(CHUNK_SIZE, remaining)

    print(f"\n Training {chunk} steps (completed {trained}/{TOTAL_TIMESTEPS})")

    model.learn(
        total_timesteps=chunk,
        callback=checkpoint,
        reset_num_timesteps=False
    )

    trained += chunk
    model.save(f"phase3_stochastic_strong_xy_step{trained}")

    if trained < TOTAL_TIMESTEPS:
        print("\n Cooling down for 5 minutes...")
        time.sleep(COOLDOWN_SECONDS)

env.close()
print("\n✅ Phase-3 STOCHASTIC STRONG (XY-ONLY) COMPLETE")
print("Jeyam Ravi Undagattum!!!! ")
