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

print("\nPhase-3 RL | STOCHASTIC CALM + MIXED | CONTINUE\n")

# =========================
# CONFIG
# =========================

DT = 0.15
BASE_SPEED = 2.5
MAX_STEPS = 200

TARGET_TOTAL_STEPS = 600000
CURRENT_STEPS = 485272
REMAINING_TIMESTEPS = TARGET_TOTAL_STEPS - CURRENT_STEPS

MODEL_START = "phase3_stochastic_calm_mixed_485272_steps.zip"
AUTOSAVE_DIR = "./autosaves_calm_mixed_continue"
CSV_LOG = "phase3_stochastic_calm_mixed_log.csv"

os.makedirs(AUTOSAVE_DIR, exist_ok=True)

# =========================
# SAFE CSV HELPERS
# =========================

def get_last_episode(csv_path):
    if not os.path.isfile(csv_path):
        return 0

    last_episode = 0
    with open(csv_path, "r") as f:
        reader = csv.reader(f)
        for row in reader:
            try:
                ep = int(row[1])
                last_episode = ep
            except:
                continue
    return last_episode


def get_last_global_step(csv_path):
    if not os.path.isfile(csv_path):
        return 0

    last_step = 0
    with open(csv_path, "r") as f:
        reader = csv.reader(f)
        for row in reader:
            try:
                step = int(row[2])
                last_step = step
            except:
                continue
    return last_step

# =========================
# MATH
# =========================

def quat_to_euler(q):
    x, y, z, w = q.x_val, q.y_val, q.z_val, q.w_val
    roll = math.atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y))
    pitch = math.asin(max(-1.0, min(1.0, 2*(w*y - z*x))))
    yaw = math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z))
    return roll, pitch, yaw

# =========================
# ENVIRONMENT
# =========================

class AirSimDroneEnv(gym.Env):
    def __init__(self):
        super().__init__()

        self.client = airsim.MultirotorClient()
        self.client.confirmConnection()
        self.client.enableApiControl(True)
        self.client.armDisarm(True)

        self.action_space = gym.spaces.Box(
            low=np.array([-0.5, -0.5, -0.3], dtype=np.float32),
            high=np.array([0.5, 0.5, 0.3], dtype=np.float32)
        )

        self.observation_space = gym.spaces.Box(
            low=-np.inf, high=np.inf, shape=(15,), dtype=np.float32
        )

        self.target = np.array([0.0, 0.0, -15.0])

        self.step_count = 0
        self.episode_count = 0
        self.wind_vector = np.zeros(3)

        self.episode_offset = get_last_episode(CSV_LOG)
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
                "gyro_x", "gyro_y", "gyro_z",
                "wind_speed"
            ])

    def reset(self):
        self.step_count = 0
        self.episode_count += 1
        self.global_episode = self.episode_offset + self.episode_count
        self.wind_vector = np.zeros(3)

        print(f"\nEPISODE {self.global_episode} | CONTINUING")

        self.client.reset()
        time.sleep(1)
        self.client.enableApiControl(True)
        self.client.armDisarm(True)
        self.client.takeoffAsync().join()
        time.sleep(1)

        return self._get_obs()

    def _apply_wind(self):
        # Mixed regime: randomly calm or strong
        if np.random.rand() < 0.5:
            disturbance = np.random.uniform(-0.1, 0.1, size=3)
        else:
            disturbance = np.random.uniform(-0.4, 0.4, size=3)

        self.wind_vector += disturbance
        self.wind_vector = np.clip(self.wind_vector, -2.0, 2.0)

    def step(self, action):
        self.step_count += 1
        self.global_step += 1

        self._apply_wind()

        state = self.client.getMultirotorState()
        kin = state.kinematics_estimated

        pos = np.array([kin.position.x_val,
                        kin.position.y_val,
                        kin.position.z_val])

        direction = self.target - pos
        direction /= np.linalg.norm(direction) + 1e-6
        base_v = BASE_SPEED * direction

        vx = base_v[0] + action[0] + self.wind_vector[0]
        vy = base_v[1] + action[1] + self.wind_vector[1]
        vz = base_v[2] + action[2] + self.wind_vector[2]

        self.client.moveByVelocityAsync(vx, vy, vz, DT).join()

        obs = self._get_obs()
        reward = self._compute_reward()

        done = self.step_count >= MAX_STEPS

        if self.step_count % 2 == 0:
            self._log_step()

        return obs, reward, done, {}

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

    def _compute_reward(self):
        state = self.client.getMultirotorState()
        kin = state.kinematics_estimated
        roll, pitch, _ = quat_to_euler(kin.orientation)

        return -(abs(roll) + abs(pitch)) - 0.1 * (
            abs(kin.angular_velocity.x_val) +
            abs(kin.angular_velocity.y_val)
        )

    def _log_step(self):
        state = self.client.getMultirotorState()
        kin = state.kinematics_estimated
        roll, pitch, yaw = quat_to_euler(kin.orientation)

        self.logger.writerow([
            datetime.utcnow().isoformat(),
            self.global_episode,
            self.global_step,
            self.step_count,
            roll, pitch, yaw,
            kin.linear_velocity.x_val,
            kin.linear_velocity.y_val,
            kin.linear_velocity.z_val,
            kin.angular_velocity.x_val,
            kin.angular_velocity.y_val,
            kin.angular_velocity.z_val,
            np.linalg.norm(self.wind_vector)
        ])

        self.log_file.flush()

    def close(self):
        self.log_file.close()
        self.client.enableApiControl(False)

# =========================
# TRAINING CONTINUATION
# =========================

env = AirSimDroneEnv()

model = PPO.load(
    MODEL_START,
    env=env,
    device="cuda"
)

checkpoint = CheckpointCallback(
    save_freq=10000,
    save_path=AUTOSAVE_DIR,
    name_prefix="phase3_calm_mixed_continue"
)

print(f"\nContinuing for {REMAINING_TIMESTEPS} steps...\n")

model.learn(
    total_timesteps=REMAINING_TIMESTEPS,
    callback=checkpoint,
    reset_num_timesteps=False
)

model.save("phase3_stochastic_calm_mixed_600k_complete")

env.close()

print("\nPhase 3 STOCHASTIC CALM + MIXED — FULLY COMPLETE\n")