import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# =========================
# LOAD DATA
# =========================
CSV_PATH = "phase3_stochastic_smoothrun_eval_stochastic_smooth.csv"
df = pd.read_csv(CSV_PATH)

print("Columns detected:")
print(df.columns.tolist())

# =========================
# DERIVED METRICS
# =========================
df["angular_velocity_mag"] = np.sqrt(
    df["gyro_x"]**2 + df["gyro_y"]**2 + df["gyro_z"]**2
)

df["velocity_mag"] = np.sqrt(
    df["vel_x"]**2 + df["vel_y"]**2 + df["vel_z"]**2
)

df["ppo_action_mag"] = np.sqrt(
    df["ppo_dx"]**2 + df["ppo_dy"]**2 + df["ppo_dz"]**2
)

# =========================
# 1. Angular Velocity (Rotational Stability)
# =========================
plt.figure(figsize=(10,4))
plt.plot(df["step"], df["angular_velocity_mag"])
plt.title("Angular Velocity Magnitude (Stochastic Smooth PPO)")
plt.xlabel("Step")
plt.ylabel("rad/s")
plt.grid()
plt.show()

# =========================
# 2. Roll & Pitch Stability
# =========================
plt.figure(figsize=(10,4))
plt.plot(df["step"], df["roll"], label="Roll")
plt.plot(df["step"], df["pitch"], label="Pitch")
plt.title("Attitude Stability (Roll & Pitch)")
plt.xlabel("Step")
plt.ylabel("Radians")
plt.legend()
plt.grid()
plt.show()

# =========================
# 3. Wind vs Rotational Response
# =========================
plt.figure(figsize=(10,4))
plt.plot(df["step"], df["wind_speed"], label="Wind Magnitude")
plt.plot(df["step"], df["angular_velocity_mag"], label="Angular Velocity")
plt.title("Wind Disturbance vs PPO Stabilization Response")
plt.xlabel("Step")
plt.ylabel("Magnitude")
plt.legend()
plt.grid()
plt.show()

# =========================
# 4. PPO Action Magnitude
# =========================
plt.figure(figsize=(10,4))
plt.plot(df["step"], df["ppo_action_mag"])
plt.title("PPO Corrective Action Magnitude")
plt.xlabel("Step")
plt.ylabel("Velocity Correction")
plt.grid()
plt.show()

# =========================
# 5. Mean Angular Velocity per Checkpoint
# =========================
cp_ang = df.groupby("checkpoint_id")["angular_velocity_mag"].mean()

plt.figure(figsize=(8,4))
cp_ang.plot(kind="bar")
plt.title("Mean Angular Velocity per Checkpoint")
plt.xlabel("Checkpoint ID")
plt.ylabel("Angular Velocity")
plt.grid(axis="y")
plt.show()

# =========================
# 6. Mean PPO Effort per Checkpoint
# =========================
cp_ppo = df.groupby("checkpoint_id")["ppo_action_mag"].mean()

plt.figure(figsize=(8,4))
cp_ppo.plot(kind="bar", color="orange")
plt.title("Mean PPO Correction Effort per Checkpoint")
plt.xlabel("Checkpoint ID")
plt.ylabel("PPO Action Magnitude")
plt.grid(axis="y")
plt.show()
