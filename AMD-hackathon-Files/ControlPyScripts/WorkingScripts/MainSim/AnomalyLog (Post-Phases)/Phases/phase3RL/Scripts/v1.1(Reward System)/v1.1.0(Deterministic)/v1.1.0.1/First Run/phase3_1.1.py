from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import CheckpointCallback
from phase3ppo import AirSimDronePPOEnv

# =========================
# Training stages
# =========================
stages = [
    ("deterministic", 150_000),
    ("random",        300_000),
    ("clear",          90_000)
]

# =========================
# Autosave configuration
# =========================
AUTOSAVE_STEPS = 50_000

# =========================
# Path to pretrained model
# =========================
PRETRAINED_MODEL = "phase3_ppo_drone.zip"

for wind_mode, timesteps in stages:
    print(f"\n=== TRAINING STAGE: {wind_mode.upper()} ===")

    env = AirSimDronePPOEnv(wind_mode=wind_mode)

    # -------------------------
    # LOAD EXISTING PPO MODEL
    # -------------------------
    model = PPO.load(
        PRETRAINED_MODEL,
        env=env,
        device="cuda"
    )

    # -------------------------
    # Autosave callback
    # -------------------------
    checkpoint_callback = CheckpointCallback(
        save_freq=AUTOSAVE_STEPS,
        save_path="./autosaves",
        name_prefix=f"phase3_ppo1.1_{wind_mode}"
    )

    # -------------------------
    # Continue training
    # -------------------------
    model.learn(
        total_timesteps=timesteps,
        callback=checkpoint_callback,
        reset_num_timesteps=False  # IMPORTANT
    )

    # -------------------------
    # Final save after stage
    # -------------------------
    model.save(f"phase3_ppo1.1_{wind_mode}")

    env.close()

print("\n✅ Phase-3 v1.1 resumed training complete.")
