from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import CheckpointCallback
from phase3ppo import AirSimDronePPOEnv

# =========================
# Deterministic resume config
# =========================
TOTAL_DETERMINISTIC_TIMESTEPS = 150_000
COMPLETED_TIMESTEPS = 91_201
REMAINING_TIMESTEPS = TOTAL_DETERMINISTIC_TIMESTEPS - COMPLETED_TIMESTEPS

# =========================
# Autosave configuration
# =========================
AUTOSAVE_STEPS = 20_000   # smaller autosave for safety

# =========================
# Path to pretrained model
# =========================
PRETRAINED_MODEL = "phase3_ppo1.1_first_run.zip"

print(
    f"\n=== RESUMING DETERMINISTIC WIND ===\n"
    f"Completed timesteps : {COMPLETED_TIMESTEPS}\n"
    f"Remaining timesteps : {REMAINING_TIMESTEPS}\n"
)

# =========================
# Environment
# =========================
env = AirSimDronePPOEnv(wind_mode="deterministic")

# =========================
# Load PPO model
# =========================
model = PPO.load(
    PRETRAINED_MODEL,
    env=env,
    device="cuda"
)

# =========================
# Autosave callback
# =========================
checkpoint_callback = CheckpointCallback(
    save_freq=AUTOSAVE_STEPS,
    save_path="./autosaves",
    name_prefix="phase3_ppo1.1_deterministic_resume"
)

# =========================
# Continue training
# =========================
model.learn(
    total_timesteps=REMAINING_TIMESTEPS,
    callback=checkpoint_callback,
    reset_num_timesteps=False  # 🔑 CRITICAL LINE
)

# =========================
# Final deterministic save
# =========================
model.save("phase3_ppo1.1_deterministic_final")

env.close()

print("\n✅ Deterministic wind training fully completed.")
