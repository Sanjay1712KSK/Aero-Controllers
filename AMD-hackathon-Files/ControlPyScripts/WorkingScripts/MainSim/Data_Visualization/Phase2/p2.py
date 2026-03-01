import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# ===============================
# LOAD DATA
# ===============================
run1 = pd.read_csv("S:\MyProject\ControlPyScripts\WorkingScripts\MainSim\AnomalyLog (Post-Phases)\Phases\Phase2\Datasets\phase2_timevarying_wind.csv")
run2 = pd.read_csv("S:\MyProject\ControlPyScripts\WorkingScripts\MainSim\AnomalyLog (Post-Phases)\Phases\Phase2\Datasets\phase2_timevarying_wind_repeat.csv")

run1["t"] = np.arange(len(run1))
run2["t"] = np.arange(len(run2))

# ===============================
# 1. TRAJECTORY COMPARISON (XY)
# ===============================
plt.figure(figsize=(7,7))
plt.plot(run1["pos_x"], run1["pos_y"], label="Run 1", linewidth=2)
plt.plot(run2["pos_x"], run2["pos_y"], label="Run 2", linewidth=2, alpha=0.8)
plt.xlabel("X (m)")
plt.ylabel("Y (m)")
plt.title("Phase-2 Trajectory Comparison (XY Plane)")
plt.legend()
plt.grid()
plt.show()

# ===============================
# 2. ANGULAR VELOCITY MAGNITUDE
# ===============================
omega_mag_1 = np.sqrt(run1["omega_x"]**2 + run1["omega_y"]**2 + run1["omega_z"]**2)
omega_mag_2 = np.sqrt(run2["omega_x"]**2 + run2["omega_y"]**2 + run2["omega_z"]**2)

plt.figure(figsize=(10,4))
plt.plot(run1["t"], omega_mag_1, label="Run 1 |ω|", linewidth=1.8)
plt.plot(run2["t"], omega_mag_2, label="Run 2 |ω|", linewidth=1.8, alpha=0.8)
plt.xlabel("Time Step")
plt.ylabel("Angular Velocity Magnitude (rad/s)")
plt.title("Angular Velocity Magnitude Comparison")
plt.legend()
plt.grid()
plt.show()

# ===============================
# 3. ANGULAR VELOCITY PER AXIS
# ===============================
fig, axs = plt.subplots(3, 1, figsize=(10,8), sharex=True)

axs[0].plot(run1["t"], run1["omega_x"], label="Run1 ωx")
axs[0].plot(run2["t"], run2["omega_x"], label="Run2 ωx", alpha=0.7)
axs[0].set_ylabel("ωx")

axs[1].plot(run1["t"], run1["omega_y"], label="Run1 ωy")
axs[1].plot(run2["t"], run2["omega_y"], label="Run2 ωy", alpha=0.7)
axs[1].set_ylabel("ωy")

axs[2].plot(run1["t"], run1["omega_z"], label="Run1 ωz")
axs[2].plot(run2["t"], run2["omega_z"], label="Run2 ωz", alpha=0.7)
axs[2].set_ylabel("ωz")
axs[2].set_xlabel("Time Step")

for ax in axs:
    ax.legend()
    ax.grid()

plt.suptitle("Angular Velocity Per Axis Comparison")
plt.show()

# ===============================
# 4. IMU ACCELERATION (X AXIS)
# ===============================
plt.figure(figsize=(10,4))
plt.plot(run1["t"], run1["acc_x"], label="Run 1 ax")
plt.plot(run2["t"], run2["acc_x"], label="Run 2 ax", alpha=0.7)
plt.xlabel("Time Step")
plt.ylabel("Acceleration (m/s²)")
plt.title("IMU Linear Acceleration X Comparison")
plt.legend()
plt.grid()
plt.show()

# ===============================
# 5. BAROMETER ALTITUDE
# ===============================
plt.figure(figsize=(10,4))
plt.plot(run1["t"], run1["baro_altitude"], label="Run 1")
plt.plot(run2["t"], run2["baro_altitude"], label="Run 2", alpha=0.7)
plt.xlabel("Time Step")
plt.ylabel("Altitude (m)")
plt.title("Barometer Altitude Comparison")
plt.legend()
plt.grid()
plt.show()

print("✅ Phase-2 visualization complete.")
