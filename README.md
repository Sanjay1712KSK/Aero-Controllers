# GPS-Denied Autonomous Drone Stabilization  
## Learning-Based Rotational & Translational Stability Under Stochastic Wind

A reinforcement-learning-based stabilization framework for autonomous multirotor drones operating in GPS-denied environments (indoor, underground, urban canyons, disaster zones).

> The **600k-timestep model** is available under **GitHub Pre-releases**, along with performance metric graphs and logs.

---

## Project Components

This repository consists of three integrated systems:

1. **Reinforcement Learning Stabilization Framework**
2. **High-Fidelity Simulation Environment (UE5 + AirSim)**
3. **Interactive Technical Documentation Platform (Next.js + Three.js)**

---

## Overview

In GPS-denied flight, drones rely on INS/IMU integration, which accumulates drift over time due to sensor bias and integration error.

This project introduces a learning-based controller that:

- Suppresses rotational instability
- Maintains bounded angular velocity under disturbance
- Reduces trajectory divergence
- Generalizes across calm, mixed, and strong stochastic wind regimes

The system is trained and evaluated in a high-fidelity simulation stack using PPO.

---

## Problem Statement

Pure INS navigation causes long-horizon instability:

- Rotational divergence
- Position drift
- Angular velocity growth
- Increased failure risk under external disturbances

This repository implements a real-time RL stabilizer to maintain bounded state behavior without GPS correction.

---

## System Architecture

- **Simulation Engine:** Unreal Engine 5.5 + Cosys-AirSim
- **Physics Layer:** Multirotor rigid-body dynamics
- **Control Algorithm:** PPO (Stable-Baselines3)
- **Disturbance Model:** Stochastic wind injection
- **Evaluation Metrics:** RMSE, variance, angular energy, stability score

---

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

---

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

### Phase 4: INS Drift Suppression (In Progress)

- Ongoing training focused on long-horizon drift correction
- Extended temporal consistency evaluation

---

## Stability Score Results

| Regime | Stability Score |
|---|---:|
| Calm | 91+ |
| Mixed | 89+ |
| Strong | 86+ |

All regimes remain above **85/100**, indicating robust generalization.

---

## Key Technical Results

- Bounded angular velocity behavior
- Reduced rotational variance
- Controlled wind-response coupling
- No policy collapse under strong disturbances
- Stable performance across training checkpoints

---

## Mathematical Stability View
$$
\[
\sup_t \|\omega(t)\| < \omega_{\max}
\]
$$

$$
\[
\int \|\omega(t)\|^2 \, dt < \infty
\]
$$

$$
\[
\|\Delta p(t)\| < \varepsilon
\]
$$

---

## Training Details

- **Algorithm:** PPO
- **Framework:** Stable-Baselines3
- **Reward Shaping Penalties:**
  - Angular velocity magnitude
  - Rotational variance
  - Position drift
- **Policy Strategy:** Trained under stochastic wind randomization

---

## Machine Learning & Control Stack

- **Python 3.10**
- **Stable-Baselines3 (PPO)**
- **PyTorch (CUDA-enabled)**
- **OpenAI Gym-compatible custom environment design**
- **NumPy**
- **Matplotlib**

The training loop integrates stochastic wind injection, state logging, and reward shaping within a Gym-compatible environment wrapper connected to Unreal Engine.

---

## Simulation & Engine Stack

- **Unreal Engine 5.5.4**
- **Cosys-AirSim (April 2025 release)**
- **RPC-based client–server communication layer**

The simulation runs a multirotor rigid-body dynamics model inside Unreal Engine, interfaced through Cosys-AirSim using a Python RPC client.

---

## Development Environment

- **Operating System:** Windows 11  
- **IDE / Toolchain:** Visual Studio 2022 (v17.13.6)  
- **Compiler:** MSVC 14.43.34808  
- **Windows SDK:** 10.0.22621.0  

---

## Hardware Configuration

- **CPU:** AMD Ryzen 5 7600X  
- **GPU:** NVIDIA RTX 4070 Super (12GB GDDR6X, CUDA-enabled)  
- **Memory:** 32GB DDR5 RAM  

Training utilized CPU acceleration for PPO optimization and GPU Accelerated physics-intensive multi-wind simulation rollouts.

## Interactive Documentation

The project includes a fully interactive macOS-style technical documentation platform.

### Frontend Architecture

- **Framework:** Next.js 16.1.6 (App Router, `app/` directory)
- **UI Library:** React 19.2.3 + React DOM 19.2.3
- **Language:** JavaScript (JSX-based, no TypeScript)

### 3D & Visualization Layer

- **Three.js:** 0.183.1
- **@react-three/fiber**
- **@react-three/drei**

Used for:

- 3D hero rendering
- Interactive simulation visuals
- Environment-based UI transitions

### Animation System

- **GSAP:** 3.14.2
- **ScrollTrigger integration**

Used for:

- Cinematic page transitions
- Phase reveal animations
- Scroll-triggered graph entrances
- Window-style motion effects

### Styling System

- Global CSS
- Tailwind CSS v4
- `@tailwindcss/postcss`

Used for:

- macOS-style UI layout
- Glass morphism elements
- Controlled responsive spacing

### Icons

- `lucide-react`

### Linting & Code Quality

- ESLint 9
- `eslint-config-next`

### Build & Deployment

- `output: 'export'` (static export mode)
- `basePath: '/Aero-Controllers'`
- Unoptimized Next.js images
- Deployed via GitHub Pages

---

## Live Interactive Documentation

[https://sanjay1712ksk.github.io/Aero-Controllers/](https://sanjay1712ksk.github.io/Aero-Controllers/)

---

## Demonstration Media

- Early crash behavior under strong wind
- Training progression snapshots
- Phase-3 robust flight recordings
- Multi-regime evaluation videos

### YouTube Links

- **Demo Overview**  
  https://www.youtube.com/watch?v=I__WB5NJ0XI

- **Calm & Mixed Training (UE 5.5.4)**  
  https://www.youtube.com/watch?v=5MEbBffcv7E

- **Phase 1 Breakdown**  
  https://www.youtube.com/watch?v=MDs1X7NSu_I

- **Weather Anomaly Run**  
  https://www.youtube.com/watch?v=Vugx3RBhP7Q

---

## Notes

This project is simulation-first and designed as a robust foundation for transferring stabilization policies toward real-world GPS-denied autonomy workflows.

The documentation platform is built to make system architecture, training progression, and performance metrics interactively explorable.
