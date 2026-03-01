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
# ALIGN LENGTHS (SAFETY)
# ===============================
min_len = min(len(run1), len(run2))
r1 = run1.iloc[:min_len]
r2 = run2.iloc[:min_len]

# ===============================
# DIFFERENCE SIGNALS (Run2 - Run1)
# ===============================
diff_pos_x = r2["pos_x"] - r1["pos_x"]
diff_pos_y = r2["pos_y"] - r1["pos_y"]
diff_pos_z = r2["pos_z"] - r1["pos_z"]

diff_omega_x = r2["omega_x"] - r1["omega_x"]
diff_omega_y = r2["omega_y"] - r1["omega_y"]
diff_omega_z = r2["omega_z"] - r1["omega_z"]

diff_omega_mag = np.sqrt(
    diff_omega_x**2 + diff_omega_y**2 + diff_omega_z**2
)

# ===============================
# 1. POSITION DIFFERENCE PLOT
# ===============================
plt.figure(figsize=(10,4))
plt.plot(diff_pos_x, label="ΔX")
plt.plot(diff_pos_y, label="ΔY")
plt.plot(diff_pos_z, label="ΔZ")
plt.xlabel("Time Step")
plt.ylabel("Position Difference (m)")
plt.title("Position Difference (Run2 − Run1)")
plt.legend()
plt.grid()
plt.show()

# ===============================
# 2. ANGULAR VELOCITY DIFFERENCE
# ===============================
plt.figure(figsize=(10,4))
plt.plot(diff_omega_mag, color="red")
plt.xlabel("Time Step")
plt.ylabel("Δ|ω| (rad/s)")
plt.title("Angular Velocity Difference Magnitude (Run2 − Run1)")
plt.grid()
plt.show()

# ===============================
# QUANTITATIVE METRICS
# ===============================
def rmse(x):
    return np.sqrt(np.mean(x**2))

metrics = {
    "RMSE_Pos_X": rmse(diff_pos_x),
    "RMSE_Pos_Y": rmse(diff_pos_y),
    "RMSE_Pos_Z": rmse(diff_pos_z),
    "RMSE_Omega_X": rmse(diff_omega_x),
    "RMSE_Omega_Y": rmse(diff_omega_y),
    "RMSE_Omega_Z": rmse(diff_omega_z),
    "RMSE_Omega_Magnitude": rmse(diff_omega_mag),
    "Var_Omega_X": np.var(diff_omega_x),
    "Var_Omega_Y": np.var(diff_omega_y),
    "Var_Omega_Z": np.var(diff_omega_z),
}

# ===============================
# PRINT METRICS (TERMINAL)
# ===============================
print("\n📊 PHASE-2 QUANTITATIVE COMPARISON METRICS")
print("-" * 45)
for k, v in metrics.items():
    print(f"{k:25s}: {v:.6f}")
print("✅ Phase-2 visualization complete.")
