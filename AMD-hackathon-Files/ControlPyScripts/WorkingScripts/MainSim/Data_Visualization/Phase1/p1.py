import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# ===============================
# Load Phase-1 CSV
# ===============================
CSV_PATH = "S:\MyProject\ControlPyScripts\WorkingScripts\MainSim\AnomalyLog (Post-Phases)\Phases\Phase_1\Datasets\phase1_acknowledged_wind.csv"  # change if needed
df = pd.read_csv(CSV_PATH)

# Convert timestamp to seconds (relative)
df["timestamp"] = pd.to_datetime(df["timestamp"])
t0 = df["timestamp"].iloc[0]
df["time_sec"] = (df["timestamp"] - t0).dt.total_seconds()

# ===============================
# Extract angular velocity
# ===============================
omega_x = df["omega_x"]
omega_y = df["omega_y"]
omega_z = df["omega_z"]

omega_mag = np.sqrt(
    omega_x**2 + omega_y**2 + omega_z**2
)

# ===============================
# Plot 1: Angular velocity per axis
# ===============================
plt.figure(figsize=(12, 6))
plt.plot(df["time_sec"], omega_x, label="ωx (Roll rate)", alpha=0.8)
plt.plot(df["time_sec"], omega_y, label="ωy (Pitch rate)", alpha=0.8)
plt.plot(df["time_sec"], omega_z, label="ωz (Yaw rate)", alpha=0.8)

plt.xlabel("Time (seconds)")
plt.ylabel("Angular Velocity (rad/s)")
plt.title("Phase-1 Angular Velocity per Axis")
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()

# ===============================
# Plot 2: Angular velocity magnitude
# ===============================
plt.figure(figsize=(12, 5))
plt.plot(df["time_sec"], omega_mag, color="black")

plt.xlabel("Time (seconds)")
plt.ylabel("||ω|| (rad/s)")
plt.title("Phase-1 Angular Velocity Magnitude (Overall Instability)")
plt.grid(True)

plt.tight_layout()
plt.show()

# ===============================
# Plot 3: Highlight spikes (optional)
# ===============================
SPIKE_THRESHOLD = omega_mag.mean() + 2 * omega_mag.std()

plt.figure(figsize=(12, 5))
plt.plot(df["time_sec"], omega_mag, label="||ω||", color="black")
plt.axhline(SPIKE_THRESHOLD, color="red", linestyle="--", label="Spike threshold")

plt.xlabel("Time (seconds)")
plt.ylabel("||ω|| (rad/s)")
plt.title("Phase-1 Angular Velocity Spikes")
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()

