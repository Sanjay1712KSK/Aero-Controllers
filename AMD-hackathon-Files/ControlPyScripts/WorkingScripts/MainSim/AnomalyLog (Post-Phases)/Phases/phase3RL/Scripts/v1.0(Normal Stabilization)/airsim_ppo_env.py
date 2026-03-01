import gym
import numpy as np
import cosysairsim as airsim
import time
import math
import csv
import os

DT = 0.1
BASE_SPEED = 2.5
MAX_STEPS = 300
LOG_EVERY_N_STEPS = 10   # terminal update frequency

CSV_LOG_FILE = "phase3_training_log.csv"


# ===============================
# Quaternion → Euler
# ===============================
def quat_to_euler(q):
    x, y, z, w = q.x_val, q.y_val, q.z_val, q.w_val
    roll = math.atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y))
    pitch = math.asin(max(-1.0, min(1.0, 2*(w*y - z*x))))
    yaw = math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z))
    return roll, pitch, yaw


class AirSimDronePPOEnv(gym.Env):

    def __init__(self):
        super().__init__()

        self.client = airsim.MultirotorClient()
        self.client.confirmConnection()
        self.client.enableApiControl(True)
        self.client.armDisarm(True)

        self.observation_space = gym.spaces.Box(
            low=-np.inf,
            high=np.inf,
            shape=(15,),
            dtype=np.float32
        )

        self.action_space = gym.spaces.Box(
            low=np.array([-0.5, -0.5, -0.3], dtype=np.float32),
            high=np.array([0.5, 0.5, 0.3], dtype=np.float32)
        )

        self.target = np.array([0.0, 0.0, -15.0])

        # ---- Runtime tracking ----
        self.step_count = 0
        self.episode_count = 0
        self.episode_reward = 0.0
        self.episode_start_time = None
        self.collision_happened = 0

        # ---- CSV setup ----
        self._setup_csv()

    # ===============================
    def _setup_csv(self):
        file_exists = os.path.isfile(CSV_LOG_FILE)
        self.csv_file = open(CSV_LOG_FILE, "a", newline="")
        self.csv_writer = csv.writer(self.csv_file)

        if not file_exists:
            self.csv_writer.writerow([
                "episode",
                "total_reward",
                "mean_reward",
                "steps",
                "duration_sec",
                "collision"
            ])
            self.csv_file.flush()

    # ===============================
    def reset(self):
        # ---- Log previous episode ----
        if self.episode_start_time is not None:
            duration = time.time() - self.episode_start_time
            mean_reward = self.episode_reward / max(1, self.step_count)

            self.csv_writer.writerow([
                self.episode_count,
                round(self.episode_reward, 3),
                round(mean_reward, 3),
                self.step_count,
                round(duration, 2),
                self.collision_happened
            ])
            self.csv_file.flush()

        # ---- Reset episode stats ----
        self.step_count = 0
        self.episode_reward = 0.0
        self.collision_happened = 0
        self.episode_count += 1
        self.episode_start_time = time.time()

        print(f"\n🚀 EPISODE {self.episode_count} STARTED")

        self.client.reset()
        time.sleep(1)

        self.client.enableApiControl(True)
        self.client.armDisarm(True)
        self.client.takeoffAsync().join()
        time.sleep(1)

        state = self.client.getMultirotorState()
        return self._get_obs_from_state(state)

    # ===============================
    def step(self, action):
        self.step_count += 1

        try:
            state = self.client.getMultirotorState()
        except Exception:
            print("❌ RPC ERROR — terminating episode")
            return np.zeros(15, dtype=np.float32), -100.0, True, {}

        kin = state.kinematics_estimated

        # ---- Waypoint controller ----
        pos = np.array([
            kin.position.x_val,
            kin.position.y_val,
            kin.position.z_val
        ])

        direction = self.target - pos
        dist = np.linalg.norm(direction) + 1e-6
        direction /= dist
        base_v = BASE_SPEED * direction

        # ---- PPO correction ----
        vx = base_v[0] + float(action[0])
        vy = base_v[1] + float(action[1])
        vz = base_v[2] + float(action[2])

        self.client.moveByVelocityAsync(vx, vy, vz, DT).join()

        next_state = self.client.getMultirotorState()
        obs = self._get_obs_from_state(next_state)

        reward = self._compute_reward(next_state)
        self.episode_reward += reward

        done = False
        collision = next_state.collision.has_collided

        if collision:
            reward = -100.0
            self.collision_happened = 1
            done = True
            print("💥 COLLISION — episode terminated")

        if self.step_count >= MAX_STEPS:
            done = True
            print("🏁 EPISODE TIME LIMIT REACHED")

        # ---- TERMINAL LOGGING ----
        if self.step_count % LOG_EVERY_N_STEPS == 0 or done:
            elapsed = time.time() - self.episode_start_time
            remaining_steps = MAX_STEPS - self.step_count
            est_remaining = remaining_steps * DT

            print(
                f"[Episode {self.episode_count}] "
                f"Step {self.step_count}/{MAX_STEPS} | "
                f"Elapsed: {elapsed:5.1f}s | "
                f"ETA: {est_remaining:5.1f}s | "
                f"Reward: {self.episode_reward:7.2f}"
            )

        return obs, reward, done, {}

    # ===============================
    def _get_obs_from_state(self, state):
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
    def _compute_reward(self, state):
        kin = state.kinematics_estimated
        roll, pitch, _ = quat_to_euler(kin.orientation)

        stability_penalty = abs(roll) + abs(pitch)
        angular_penalty = abs(kin.angular_velocity.x_val) + abs(kin.angular_velocity.y_val)

        return -stability_penalty - 0.1 * angular_penalty
