```markdown
# GPS-Denied Autonomous Drone Stabilization
Learning-Based Rotational & Translational Stability Under Stochastic Wind

A reinforcement-learning-based stabilization framework for autonomous multirotor drones operating in GPS-denied environments (indoor, underground, urban canyons, disaster zones).

> The 600k-timestep model is available under GitHub Pre-releases, along with performance metric graphs and logs.

## Overview

In GPS-denied flight, drones rely on INS/IMU integration, which accumulates drift over time due to sensor bias and integration error.  
This project introduces a learning-based controller that:

- Suppresses rotational instability
- Maintains bounded angular velocity under disturbance
- Reduces trajectory divergence
- Generalizes across calm, mixed, and strong stochastic wind regimes

The system is trained and evaluated in a high-fidelity simulation stack using PPO.

## Problem Statement

Pure INS navigation causes long-horizon instability:

- Rotational divergence
- Position drift
- Angular velocity growth
- Higher failure risk under external disturbances

This repository implements a real-time RL stabilizer to maintain bounded state behavior without GPS correction.

## System Architecture

- Simulation Engine: Unreal Engine 5.5 + Cosys-AirSim
- Physics Layer: Multirotor rigid-body dynamics
- Control Algorithm: PPO (Stable-Baselines3)
- Disturbance Model: Stochastic wind injection
- Evaluation Metrics: RMSE, variance, angular energy, stability score

## Repository Structure

### Top-Level

```text
S:\GPSDeniedDroneDocumentation
├── .github/
├── aero-controllers-3d/
├── AMD-hackathon-Files/
├── GPSDeniedDroneInteractiveDocumentation/
└── Simulation Media/
```

### Main Experimental Workspace

```text
S:\GPSDeniedDroneDocumentation\AMD-hackathon-Files\ControlPyScripts\WorkingScripts\MainSim
├── AnomalyLog (Post-Phases)/
│   └── Phases/
│       ├── Phase_1/
│       ├── Phase2/
│       └── phase3RL/
│           ├── Datasets/
│           ├── PPO_Model/
│           └── Scripts/
├── ClearLog (Pre-Phase)/
├── Data_Visualization/
└── Model_Evaluation/
```

### Interactive Documentation Modules

```text
GPSDeniedDroneInteractiveDocumentation/
├── Frontend/
├── Frontend3D/
└── aero-controllers-3d/
```

## Phase Breakdown

### Phase 1: Baseline Instability

- High angular velocity variance
- Frequent spike events
- Underdamped rotational dynamics
- No disturbance rejection

### Phase 2: Quantified Stability Improvement

- RMSE tracking (position and angular)
- Variance reduction
- Spike suppression analysis
- Trajectory consistency metrics

### Phase 3: Stochastic Multi-Wind Robustness

- PPO training up to 600k timesteps
- Randomized stochastic wind injection
- Aggressive disturbance curriculum
- Cross-regime evaluation

**Stability Score Results**

| Regime | Stability Score |
|---|---:|
| Calm | 91+ |
| Mixed | 89+ |
| Strong | 86+ |

All regimes remain above **85/100**, indicating robust generalization.

### Phase 4: INS Drift Suppression (In Progress)

- Ongoing training and evaluation focused on long-horizon drift correction

## Key Technical Results

- Bounded angular velocity behavior
- Reduced rotational variance
- Controlled wind-response coupling
- No policy collapse under strong disturbances
- Stable performance across training checkpoints

## Mathematical Stability View

\[
\sup_t \|\omega(t)\| < \omega_{\max}
\]

\[
\int \|\omega(t)\|^2 dt < \infty
\]

\[
\|\Delta p(t)\| < \varepsilon
\]

## Training Details

- **Algorithm:** PPO
- **Framework:** Stable-Baselines3
- **Reward Shaping Penalties:**
  - Angular velocity magnitude
  - Rotational variance
  - Position drift
- **Policy Strategy:** Trained under stochastic wind randomization

## Interactive Documentation

Technical documentation includes:

- Next.js frontend
- GSAP animations
- Interactive phase visualizations
- Graph-based analysis panels
- Embedded simulation videos

## Live Demo

https://sanjay1712ksk.github.io/Aero-Controllers/

## Demonstration Media

- Early crash behavior under strong wind
- Training progression snapshots
- Phase-3 robust flight recordings
- Multi-regime evaluation videos

## Notes

This project is simulation-first and designed as a robust foundation for transferring stabilization policies toward real-world GPS-denied autonomy workflows.
```
