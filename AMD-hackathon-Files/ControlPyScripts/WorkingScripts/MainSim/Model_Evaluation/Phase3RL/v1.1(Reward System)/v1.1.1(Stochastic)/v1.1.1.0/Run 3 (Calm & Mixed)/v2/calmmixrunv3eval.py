import os
import cv2
import csv
import time
import math
import numpy as np
import matplotlib.pyplot as plt
import cosysairsim as airsim
from stable_baselines3 import PPO

# ============================================================
# CONFIGURATION
# ============================================================

MODEL_PATH = "phase3_stochastic_calm_mixed_600k_complete.zip"
DEVICE = "cuda"

CRUISE_SPEED = 4.0
CHECKPOINT_RADIUS = 1.5
MAX_STEPS_PER_MISSION = 3000

VIDEO_RES = (1280, 720)
FPS = 20

MISSIONS_PER_REGIME = 3

BASE_DIR = "phase3_checkpoint_evaluation"
LOG_DIR = os.path.join(BASE_DIR, "logs")
VIDEO_DIR = os.path.join(BASE_DIR, "videos")
SNAP_DIR = os.path.join(BASE_DIR, "snapshots")
PLOT_DIR = os.path.join(BASE_DIR, "plots")

for d in [LOG_DIR, VIDEO_DIR, SNAP_DIR, PLOT_DIR]:
    os.makedirs(d, exist_ok=True)

# ============================================================
# CHECKPOINTS
# ============================================================

checkpoints = [
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

# ============================================================
# UTILITIES
# ============================================================

def quat_to_euler(q):
    x, y, z, w = q.x_val, q.y_val, q.z_val, q.w_val
    roll = math.atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y))
    pitch = math.asin(max(-1.0, min(1.0, 2*(w*y - z*x))))
    yaw = math.atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z))
    return roll, pitch, yaw

def compute_score(angle_errors, ang_vels, recovery_times, consistency, completed):
    attitude = max(0, 30 - np.mean(angle_errors)*60)
    smoothness = max(0, 20 - np.mean(ang_vels)*25)
    recovery = max(0, 20 - np.mean(recovery_times)*2)
    variance = max(0, 20 - consistency*100)
    survival = 10 if completed else 0
    return attitude + smoothness + recovery + variance + survival

# ============================================================
# WIND
# ============================================================

def get_wind(regime, stochastic):
    if regime == "calm":
        mag = 0.1
    elif regime == "mixed":
        mag = 0.3
    else:
        mag = 0.6

    if stochastic:
        return np.random.uniform(-mag, mag, 3)
    else:
        return np.array([mag, 0, 0])

# ============================================================
# LOAD MODEL
# ============================================================

model = PPO.load(MODEL_PATH, device=DEVICE)

# ============================================================
# EVALUATION MATRIX
# ============================================================

regimes = [
    ("calm", False),
    ("calm", True),
    ("mixed", False),
    ("mixed", True),
    ("strong", False),
    ("strong", True),
]

summary = []

# ============================================================
# MAIN LOOP
# ============================================================

for regime, stochastic in regimes:

    for mission in range(MISSIONS_PER_REGIME):

        print(f"\nRunning {regime} | stochastic={stochastic} | mission={mission}")

        client = airsim.MultirotorClient()
        client.confirmConnection()
        client.enableApiControl(True)
        client.armDisarm(True)

        client.reset()
        time.sleep(1)
        client.enableApiControl(True)
        client.armDisarm(True)
        client.takeoffAsync().join()

        log_path = os.path.join(LOG_DIR, f"{regime}_{stochastic}_mission{mission}.csv")
        video_all_path = os.path.join(VIDEO_DIR, f"{regime}_{stochastic}_mission{mission}_full.mp4")
        video_good_path = os.path.join(VIDEO_DIR, f"{regime}_{stochastic}_mission{mission}_good.mp4")
        video_bad_path = os.path.join(VIDEO_DIR, f"{regime}_{stochastic}_mission{mission}_bad.mp4")

        writer = csv.writer(open(log_path, "w", newline=""))
        writer.writerow([
            "step","checkpoint","x","y","z",
            "roll","pitch","yaw",
            "vel_x","vel_y","vel_z",
            "ang_vel","wind_mag"
        ])

        vid_all = cv2.VideoWriter(video_all_path, cv2.VideoWriter_fourcc(*"mp4v"), FPS, VIDEO_RES)
        vid_good = cv2.VideoWriter(video_good_path, cv2.VideoWriter_fourcc(*"mp4v"), FPS, VIDEO_RES)
        vid_bad = cv2.VideoWriter(video_bad_path, cv2.VideoWriter_fourcc(*"mp4v"), FPS, VIDEO_RES)

        angle_errors = []
        ang_vels = []
        recovery_times = []
        recovery_counter = 0
        stable_zone = True

        completed = True
        step_global = 0

        for idx, target in enumerate(checkpoints):

            reached = False

            while not reached and step_global < MAX_STEPS_PER_MISSION:

                state = client.getMultirotorState()
                pos = state.kinematics_estimated.position
                ori = state.kinematics_estimated.orientation
                vel = state.kinematics_estimated.linear_velocity
                ang = state.kinematics_estimated.angular_velocity

                roll, pitch, yaw = quat_to_euler(ori)

                current = np.array([pos.x_val, pos.y_val, pos.z_val])
                target_np = np.array(target)

                dist = np.linalg.norm(target_np - current)

                if dist < CHECKPOINT_RADIUS:
                    reached = True
                    break

                direction = (target_np - current)
                direction = direction / (np.linalg.norm(direction) + 1e-6)
                base_velocity = direction * CRUISE_SPEED

                wind = get_wind(regime, stochastic)

                obs = np.array([
                    roll, pitch, yaw,
                    vel.x_val, vel.y_val, vel.z_val,
                    ang.x_val, ang.y_val, ang.z_val,
                    0,0,0,0,0,0
                ])

                action, _ = model.predict(obs, deterministic=True)

                vx = base_velocity[0] + action[0] + wind[0]
                vy = base_velocity[1] + action[1] + wind[1]
                vz = base_velocity[2] + action[2] + wind[2]

                client.moveByVelocityAsync(vx, vy, vz, 0.15).join()

                ang_mag = np.linalg.norm([ang.x_val, ang.y_val, ang.z_val])
                wind_mag = np.linalg.norm(wind)

                writer.writerow([
                    step_global, idx,
                    pos.x_val, pos.y_val, pos.z_val,
                    roll, pitch, yaw,
                    vel.x_val, vel.y_val, vel.z_val,
                    ang_mag, wind_mag
                ])

                angle_error = abs(roll) + abs(pitch)
                angle_errors.append(angle_error)
                ang_vels.append(ang_mag)

                if angle_error > 0.5:
                    stable_zone = False
                    recovery_counter = 0
                else:
                    if not stable_zone:
                        recovery_counter += 1
                        if recovery_counter > 5:
                            recovery_times.append(recovery_counter)
                            stable_zone = True

                responses = client.simGetImages([
                    airsim.ImageRequest("0", airsim.ImageType.Scene, False, False)
                ])

                img = np.frombuffer(responses[0].image_data_uint8, dtype=np.uint8)
                img = img.reshape(responses[0].height, responses[0].width, 3)
                img = cv2.resize(img, VIDEO_RES)

                vid_all.write(img)

                if angle_error < 0.1:
                    vid_good.write(img)
                if angle_error > 0.6:
                    vid_bad.write(img)
                    snap_bad = os.path.join(SNAP_DIR, f"bad_{regime}_{mission}_{step_global}.png")
                    cv2.imwrite(snap_bad, img)

                if angle_error < 0.05:
                    snap_good = os.path.join(SNAP_DIR, f"good_{regime}_{mission}_{step_global}.png")
                    cv2.imwrite(snap_good, img)

                step_global += 1

            if not reached:
                completed = False
                break

        consistency = np.std(angle_errors)
        score = compute_score(angle_errors, ang_vels,
                              recovery_times if recovery_times else [0],
                              consistency, completed)

        summary.append([regime, stochastic, mission, score, completed])

        vid_all.release()
        vid_good.release()
        vid_bad.release()

        client.enableApiControl(False)

# ============================================================
# SAVE SUMMARY
# ============================================================

summary_path = os.path.join(BASE_DIR, "phase3_final_summary.csv")
with open(summary_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["regime","stochastic","mission","score","completed"])
    writer.writerows(summary)

# ============================================================
# PLOTS
# ============================================================

scores = {}
for regime, stochastic, mission, score, comp in summary:
    key = f"{regime}_{stochastic}"
    scores.setdefault(key, []).append(score)

plt.figure(figsize=(8,5))
for k, v in scores.items():
    plt.plot(v, label=k)
plt.legend()
plt.title("Phase-3 Final Credibility Score")
plt.xlabel("Mission")
plt.ylabel("Score (/100)")
plt.savefig(os.path.join(PLOT_DIR, "credibility_scores.png"))
plt.close()

print("\nPHASE-3 CHECKPOINT STABILIZATION EVALUATION COMPLETED.\n")