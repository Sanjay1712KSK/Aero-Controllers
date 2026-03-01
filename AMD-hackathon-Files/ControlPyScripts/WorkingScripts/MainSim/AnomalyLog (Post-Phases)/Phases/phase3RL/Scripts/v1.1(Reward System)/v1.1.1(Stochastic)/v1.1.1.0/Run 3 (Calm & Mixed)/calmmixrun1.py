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

print("\n Phase-3 RL | STOCHASTIC CALM + MIXED ")

# =========================
# CONFIG
# =========================
DT = 0.15
BASE_SPEED = 2.5
MAX_STEPS = 200

TOTAL_TIMESTEPS = 200_000
AUTOSAVE_EVERY = 10_000

MODEL_START = "phase3_stochastic_strong_phase3_run2.zip"
AUTOSAVE_DIR = "./autosaves_calm_mixed"
CSV_LOG = "phase3_training_sensor_log_calm_mixed.csv"

os.makedirs(AUTOSAVE_DIR, exist_ok=True)

# =========================
# UTIL
# =========================
def quat_to_euler(q):
    x, y, z, w = q.x_val, q.y_val, q.z_val, q.w_val
    roll = math.atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y))
    pitch = math.asin(max(-1.0, min(1.0, 2*(w*y - z*x))))
    yaw = math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z))
    return roll, pitch, yaw


# =========================
# ENV
# =========================
class AirSimDroneEnv(gym.Env):
    def __init__(self):
        super().__init__()

        self.client = airsim.MultirotorClient()
        self.client.confirmConnection()
        self.client.enableApiControl(True)
        self.client.armDisarm(True)

        # MUST MATCH TRAINED MODEL
        self.action_space = gym.spaces.Box(
            low=np.array([-0.5, -0.5, -0.3], dtype=np.float32),
            high=np.array([0.5, 0.5, 0.3], dtype=np.float32)
        )

        self.observation_space = gym.spaces.Box(
            low=-np.inf, high=np.inf, shape=(15,), dtype=np.float32
        )

        self.target = np.array([0.0, 0.0, -15.0])

        self.step_count = 0
        self.wind_vector = np.zeros(3)

        self.regime = "CALM"

        file_exists = os.path.isfile(CSV_LOG)
        self.log_file = open(CSV_LOG, "a", newline="")
        self.logger = csv.writer(self.log_file)

        if not file_exists:
            self.logger.writerow([
                "timestamp",
                "regime",
                "roll", "pitch", "yaw",
                "wind_x", "wind_y", "wind_z"
            ])

    # =========================
    def reset(self):
        self.step_count = 0

        # 50% Calm / 50% Mixed
        self.regime = np.random.choice(["CALM", "MIXED"])

        print(f"\n🚀 NEW EPISODE | REGIME: {self.regime}")

        self.wind_vector = np.zeros(3)

        self.client.reset()
        time.sleep(1)
        self.client.enableApiControl(True)
        self.client.armDisarm(True)
        self.client.takeoffAsync().join()
        time.sleep(1)

        return self._get_obs()

    # =========================
    def _apply_wind(self):

        if self.regime == "CALM":
            # tiny noise
            self.wind_vector += np.random.uniform(-0.05, 0.05, size=3)

        elif self.regime == "MIXED":

            mode = np.random.choice(["calm", "gust", "shift"])

            if mode == "calm":
                self.wind_vector += np.random.uniform(-0.1, 0.1, size=3)

            elif mode == "gust":
                self.wind_vector += np.random.uniform(-0.6, 0.6, size=3)

            elif mode == "shift":
                self.wind_vector = np.random.uniform(-1.0, 1.0, size=3)

        self.wind_vector = np.clip(self.wind_vector, -2.0, 2.0)

    # =========================
    def step(self, action):
        self.step_count += 1

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

        if self.step_count % 5 == 0:
            self._log_step()

        return obs, reward, done, {}

    # =========================
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

    # =========================
    def _compute_reward(self):
        state = self.client.getMultirotorState()
        kin = state.kinematics_estimated
        roll, pitch, _ = quat_to_euler(kin.orientation)

        return -(abs(roll) + abs(pitch)) - 0.1 * (
            abs(kin.angular_velocity.x_val) +
            abs(kin.angular_velocity.y_val)
        )

    # =========================
    def _log_step(self):
        state = self.client.getMultirotorState()
        kin = state.kinematics_estimated
        roll, pitch, yaw = quat_to_euler(kin.orientation)

        self.logger.writerow([
            datetime.utcnow().isoformat(),
            self.regime,
            roll, pitch, yaw,
            self.wind_vector[0],
            self.wind_vector[1],
            self.wind_vector[2]
        ])
        self.log_file.flush()

    def close(self):
        self.log_file.close()
        self.client.enableApiControl(False)


# =========================
# TRAIN
# =========================
env = AirSimDroneEnv()

model = PPO.load(
    MODEL_START,
    env=env,
    device="cuda"
)

checkpoint = CheckpointCallback(
    save_freq=AUTOSAVE_EVERY,
    save_path=AUTOSAVE_DIR,
    name_prefix="phase3_stochastic_calm_mixed"
)

model.learn(
    total_timesteps=TOTAL_TIMESTEPS,
    callback=checkpoint,
    reset_num_timesteps=False
)

model.save("phase3_stochastic_calm_mixed_complete")

env.close()

print("\n Phase-3 STOCHASTIC CALM + MIXED COMPLETE")
