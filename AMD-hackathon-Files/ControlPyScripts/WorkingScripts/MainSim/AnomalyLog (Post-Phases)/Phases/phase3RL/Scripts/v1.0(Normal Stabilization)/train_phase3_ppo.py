from stable_baselines3 import PPO
from airsim_ppo_env import AirSimDronePPOEnv

# -------------------------------
# Create Environment
# -------------------------------
env = AirSimDronePPOEnv()

# -------------------------------
# PPO Model (SAFE FOR AIRSIM)
# -------------------------------
model = PPO(
    policy="MlpPolicy",
    env=env,
    learning_rate=3e-4,
    n_steps=128,          # 🔴 VERY IMPORTANT
    batch_size=32,
    gamma=0.99,
    gae_lambda=0.95,
    clip_range=0.2,
    verbose=1
)

# -------------------------------
# Train
# -------------------------------
model.learn(total_timesteps=50_000)

# -------------------------------
# Save Model
# -------------------------------
model.save("phase3_ppo_drone")

print("Phase-3 PPO training complete.")
