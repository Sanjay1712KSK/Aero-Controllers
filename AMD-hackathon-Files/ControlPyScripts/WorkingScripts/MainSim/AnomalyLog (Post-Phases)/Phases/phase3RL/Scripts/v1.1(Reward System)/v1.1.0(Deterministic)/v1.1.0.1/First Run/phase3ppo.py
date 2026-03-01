import gym
import numpy as np
import cosysairsim as airsim
import time
import math
import csv
from datetime import datetime
DT = 0.1
BASE_SPEED = 2.5
MAX_STEPS = 300

def quat_to_euler(q):
    x, y, z, w = q.x_val, q.y_val, q.z_val, q.w_val
    roll = math.atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y))
    pitch = math.asin(max(-1.0, min(1.0, 2*(w*y - z*x))))
    yaw = math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z))
    return roll, pitch, yaw
class AirSimDronePPOEnv(gym.Env):
    def __init__(self, wind_mode="deterministic"):
        super().__init__()

        self.client = airsim.MultirotorClient()
        self.client.confirmConnection()
        self.client.enableApiControl(True)
        self.client.armDisarm(True)
        self.observation_space = gym.spaces.Box(
            low=-np.inf, high=np.inf, shape=(15,), dtype=np.float32
        )
        self.action_space = gym.spaces.Box(
            low=np.array([-0.5, -0.5, -0.3], dtype=np.float32),
            high=np.array([0.5, 0.5, 0.3], dtype=np.float32)
        )
        self.target = np.array([0.0, 0.0, -15.0])
        self.wind_mode = wind_mode
        self.wind_vector = np.zeros(3)

        self.step_count = 0
        self.episode_count = 0
        self.episode_reward = 0.0
        self.start_time = None

        # ================= CSV LOG =================
        self.log_file = open("phase3_sensor_wind_log.csv", "w", newline="")
        self.logger = csv.writer(self.log_file)
        self.logger.writerow([
            "timestamp", "episode", "step",
            "roll", "pitch", "yaw",
            "vel_x", "vel_y", "vel_z",
            "acc_x", "acc_y", "acc_z",
            "gyro_x", "gyro_y", "gyro_z",
            "wind_x", "wind_y", "wind_z",
            "wind_speed", "wind_mode"
        ])

    # ===============================
    def reset(self):
        self.step_count = 0
        self.episode_reward = 0.0
        self.episode_count += 1
        self.start_time = time.time()

        print(f"\n🚀 EPISODE {self.episode_count} | Wind: {self.wind_mode}")

        self.client.reset()
        time.sleep(1)

        self.client.enableApiControl(True)
        self.client.armDisarm(True)
        self.client.takeoffAsync().join()
        time.sleep(1)

        return self._get_obs()

    # ===============================
    def _apply_wind(self):
        if self.wind_mode == "deterministic":
            self.wind_vector = np.array([1.0, 0.5, 0.0])
        elif self.wind_mode == "random":
            self.wind_vector = np.random.uniform(-2.0, 2.0, size=3)
        else:
            self.wind_vector = np.zeros(3)

    # ===============================
    def step(self, action):
        self.step_count += 1
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
        vz = base_v[2] + action[2] + self.wind_vector[2]

        self.client.moveByVelocityAsync(vx, vy, vz, DT).join()

        obs = self._get_obs()
        reward = self._compute_reward()
        self.episode_reward += reward

        done = False
        if self.step_count >= MAX_STEPS:
            done = True

        self._log_step()

        return obs, reward, done, {}

    # ===============================
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

    # ===============================
    def _compute_reward(self):
        state = self.client.getMultirotorState()
        kin = state.kinematics_estimated
        roll, pitch, _ = quat_to_euler(kin.orientation)

        stability_penalty = abs(roll) + abs(pitch)
        angular_penalty = (
            abs(kin.angular_velocity.x_val) +
            abs(kin.angular_velocity.y_val)
        )

        return -stability_penalty - 0.1 * angular_penalty

    # ===============================
    def _log_step(self):
        state = self.client.getMultirotorState()
        kin = state.kinematics_estimated
        imu = self.client.getImuData()
        roll, pitch, yaw = quat_to_euler(kin.orientation)

        wind_speed = np.linalg.norm(self.wind_vector)

        self.logger.writerow([
            datetime.utcnow().isoformat(),
            self.episode_count,
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
            wind_speed,
            self.wind_mode
        ])

    def close(self):
        self.log_file.close()
        self.client.enableApiControl(False)
