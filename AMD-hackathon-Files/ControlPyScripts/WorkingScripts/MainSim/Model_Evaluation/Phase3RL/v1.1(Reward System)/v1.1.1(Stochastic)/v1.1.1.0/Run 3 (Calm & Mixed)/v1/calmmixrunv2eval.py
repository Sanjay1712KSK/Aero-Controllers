import os
import cv2
import gym
import csv
import time
import math
import numpy as np
import matplotlib.pyplot as plt
import cosysairsim as airsim
from stable_baselines3 import PPO

# ==============================
# CONFIGURATION
# ==============================

MODEL_PATH = "phase3_stochastic_calm_mixed_600k_complete.zip"
DEVICE = "cuda"
MAX_STEPS = 200
VIDEO_RES = (1280, 720)
FPS = 20
HIGHLIGHT_DURATION_FRAMES = 100  # 5 seconds

# Thresholds
BAD_ROLL = 0.45
BAD_PITCH = 0.45
GOOD_ROLL = 0.05
GOOD_PITCH = 0.05
WIND_ANOMALY = 0.4
GOOD_STREAK_REQUIRED = 25

BASE_DIR = "evaluation_phase3"
LOG_DIR = os.path.join(BASE_DIR, "logs")
VIDEO_DIR = os.path.join(BASE_DIR, "videos")
SNAP_BAD_DIR = os.path.join(BASE_DIR, "snapshots", "bad")
SNAP_GOOD_DIR = os.path.join(BASE_DIR, "snapshots", "good")
HIGHLIGHT_BAD_DIR = os.path.join(BASE_DIR, "highlight_videos", "bad")
HIGHLIGHT_GOOD_DIR = os.path.join(BASE_DIR, "highlight_videos", "good")
PLOT_DIR = os.path.join(BASE_DIR, "plots")

for d in [LOG_DIR, VIDEO_DIR, SNAP_BAD_DIR, SNAP_GOOD_DIR,
          HIGHLIGHT_BAD_DIR, HIGHLIGHT_GOOD_DIR, PLOT_DIR]:
    os.makedirs(d, exist_ok=True)

# ==============================
# UTILS
# ==============================

def quat_to_euler(q):
    x, y, z, w = q.x_val, q.y_val, q.z_val, q.w_val
    roll = math.atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y))
    pitch = math.asin(max(-1.0, min(1.0, 2*(w*y - z*x))))
    yaw = math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z))
    return roll, pitch, yaw

# ==============================
# ENVIRONMENT
# ==============================

class EvalEnv(gym.Env):
    def __init__(self, regime="calm", stochastic=True):
        super().__init__()

        self.regime = regime
        self.stochastic = stochastic

        self.client = airsim.MultirotorClient()
        self.client.confirmConnection()
        self.client.enableApiControl(True)
        self.client.armDisarm(True)

        self.action_space = gym.spaces.Box(low=-1, high=1, shape=(3,))
        self.observation_space = gym.spaces.Box(low=-np.inf, high=np.inf, shape=(15,))
        self.wind = np.zeros(3)

    def reset(self):
        self.step_count = 0
        self.client.reset()
        time.sleep(1)
        self.client.enableApiControl(True)
        self.client.armDisarm(True)
        self.client.takeoffAsync().join()
        return self._get_obs()

    def _apply_wind(self):
        if self.regime == "calm":
            mag = 0.1
        elif self.regime == "strong":
            mag = 0.5
        else:
            mag = 0.3

        if self.stochastic:
            disturbance = np.random.uniform(-mag, mag, 3)
        else:
            disturbance = np.array([mag, 0, 0])

        self.wind = disturbance

    def step(self, action):
        self.step_count += 1
        self._apply_wind()

        vx = action[0] + self.wind[0]
        vy = action[1] + self.wind[1]
        vz = action[2] + self.wind[2]

        self.client.moveByVelocityAsync(vx, vy, vz, 0.15).join()

        obs = self._get_obs()
        done = self.step_count >= MAX_STEPS
        return obs, 0.0, done, {}

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
        ])

# ==============================
# SCORING
# ==============================

def compute_score(angle_errors, ang_vel, drift):
    angle_score = max(0, 25 - np.mean(angle_errors)*50)
    ang_vel_score = max(0, 25 - np.mean(ang_vel)*20)
    drift_score = max(0, 25 - np.mean(drift)*10)
    survival_score = 25
    return angle_score + ang_vel_score + drift_score + survival_score

# ==============================
# EVALUATION LOOP
# ==============================

model = PPO.load(MODEL_PATH, device=DEVICE)

regimes = [
    ("calm", True, 10),
    ("strong", True, 10),
    ("mixed", True, 15)
]

summary_rows = []

for regime, stochastic, episodes in regimes:

    for ep in range(episodes):

        print(f"Running {regime} Episode {ep}")

        env = EvalEnv(regime, stochastic)
        obs = env.reset()

        csv_path = os.path.join(LOG_DIR, f"{regime}_ep{ep}.csv")
        video_path = os.path.join(VIDEO_DIR, f"{regime}_ep{ep}.mp4")

        csv_file = open(csv_path, "w", newline="")
        writer = csv.writer(csv_file)

        writer.writerow([
            "step","roll","pitch","yaw",
            "vel_x","vel_y","vel_z",
            "ang_vel_x","ang_vel_y","ang_vel_z",
            "wind_x","wind_y","wind_z"
        ])

        main_video = cv2.VideoWriter(video_path,
                                     cv2.VideoWriter_fourcc(*"mp4v"),
                                     FPS,
                                     VIDEO_RES)

        highlight_bad = None
        highlight_good = None
        bad_recording = False
        good_recording = False
        bad_frames_left = 0
        good_frames_left = 0
        good_streak = 0

        angle_errors = []
        ang_vels = []
        drifts = []

        for step in range(MAX_STEPS):

            action, _ = model.predict(obs, deterministic=True)
            obs, _, done, _ = env.step(action)

            roll, pitch = obs[0], obs[1]
            vel = obs[3:6]
            ang_vel = obs[6:9]
            wind_mag = np.linalg.norm(env.wind)

            angle_errors.append(abs(roll)+abs(pitch))
            ang_vels.append(np.linalg.norm(ang_vel))
            drifts.append(np.linalg.norm(vel))

            writer.writerow([
                step, roll, pitch, obs[2],
                vel[0], vel[1], vel[2],
                ang_vel[0], ang_vel[1], ang_vel[2],
                env.wind[0], env.wind[1], env.wind[2]
            ])

            # Capture frame
            responses = env.client.simGetImages([
                airsim.ImageRequest("0", airsim.ImageType.Scene, False, False)
            ])

            img = np.frombuffer(responses[0].image_data_uint8, dtype=np.uint8)
            img = img.reshape(responses[0].height, responses[0].width, 3)
            img = cv2.resize(img, VIDEO_RES)

            main_video.write(img)

            # ---------------- BAD DETECTION ----------------
            if (abs(roll) > BAD_ROLL or abs(pitch) > BAD_PITCH) and not bad_recording:
                cv2.imwrite(os.path.join(SNAP_BAD_DIR,
                            f"{regime}_ep{ep}_bad.png"), img)

                highlight_bad = cv2.VideoWriter(
                    os.path.join(HIGHLIGHT_BAD_DIR,
                    f"{regime}_ep{ep}_bad.mp4"),
                    cv2.VideoWriter_fourcc(*"mp4v"),
                    FPS,
                    VIDEO_RES
                )

                bad_recording = True
                bad_frames_left = HIGHLIGHT_DURATION_FRAMES

            if bad_recording:
                highlight_bad.write(img)
                bad_frames_left -= 1
                if bad_frames_left <= 0:
                    highlight_bad.release()
                    bad_recording = False

            # ---------------- GOOD DETECTION ----------------
            if wind_mag > WIND_ANOMALY and abs(roll) < GOOD_ROLL and abs(pitch) < GOOD_PITCH:
                good_streak += 1
            else:
                good_streak = 0

            if good_streak >= GOOD_STREAK_REQUIRED and not good_recording:
                cv2.imwrite(os.path.join(SNAP_GOOD_DIR,
                            f"{regime}_ep{ep}_good.png"), img)

                highlight_good = cv2.VideoWriter(
                    os.path.join(HIGHLIGHT_GOOD_DIR,
                    f"{regime}_ep{ep}_good.mp4"),
                    cv2.VideoWriter_fourcc(*"mp4v"),
                    FPS,
                    VIDEO_RES
                )

                good_recording = True
                good_frames_left = HIGHLIGHT_DURATION_FRAMES

            if good_recording:
                highlight_good.write(img)
                good_frames_left -= 1
                if good_frames_left <= 0:
                    highlight_good.release()
                    good_recording = False

        score = compute_score(angle_errors, ang_vels, drifts)
        summary_rows.append([regime, ep, score])

        main_video.release()
        csv_file.close()
        env.client.enableApiControl(False)

# ==============================
# SUMMARY & PLOTS
# ==============================

summary_path = os.path.join(BASE_DIR, "performance_summary.csv")
with open(summary_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["regime","episode","score"])
    writer.writerows(summary_rows)

scores = {}
for regime, ep, score in summary_rows:
    scores.setdefault(regime, []).append(score)

plt.figure()
for regime, vals in scores.items():
    plt.plot(vals, label=regime)
plt.legend()
plt.title("Stability Score per Episode")
plt.xlabel("Episode")
plt.ylabel("Score (/100)")
plt.savefig(os.path.join(PLOT_DIR, "score_plot.png"))
plt.close()

print("\nEvaluation Completed Successfully.\n")