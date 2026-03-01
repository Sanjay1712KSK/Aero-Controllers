## GPS-Denied Autonomous Drone Stabilization
Learning-Based Rotational & Translational Stability Under Stochastic Wind

# Overview

Autonomous drones operating in GPS-denied environments (indoor, underground, urban canyon, disaster zones) rely on Inertial Navigation Systems (INS), which suffer cumulative drift due to IMU bias and integration error.

This project presents a learning-based stabilization framework that:

Suppresses rotational instability

Maintains bounded angular velocity under disturbance

Reduces trajectory divergence

Generalizes across calm, mixed, and strong stochastic wind regimes

The system is trained and evaluated entirely in a high-fidelity simulation environment using PPO reinforcement learning.

🧠 Problem Statement

Pure INS navigation accumulates drift over time, leading to:

Rotational instability

Position divergence

Unbounded angular velocity growth

Failure under external disturbance

This repository implements a real-time learning-based stabilizer that maintains bounded state behavior without GPS correction.

🏗 System Architecture
Components

Simulation Engine: Unreal Engine 5 + AirSim

Physics Layer: Multirotor rigid-body dynamics

Control Framework: PPO (Stable-Baselines3)

Disturbance Model: Stochastic wind injection

Evaluation Metrics: RMSE, variance, angular energy, stability score

📂 Repository Structure
GPSDeniedDrone/
│
├── ControlPyScripts/          # Training + Evaluation scripts
│   ├── Phase1/                # Baseline instability
│   ├── Phase2/                # Quantitative comparison
│   ├── Phase3RL/              # Stochastic PPO training
│
├── InteractiveDocumentation/  # Next.js interactive frontend
│
├── Simulation Media/          # Evaluation videos & demo outputs
│
└── README.md
🔬 Phase Breakdown
🚨 Phase-1 — Baseline Instability

High angular velocity variance

Frequent spike events

Underdamped rotational dynamics

No disturbance rejection

This phase establishes uncontrolled system behavior.

📊 Phase-2 — Quantified Stability Improvement

Introduces:

RMSE (Position & Angular)

Variance reduction

Spike suppression analysis

Trajectory consistency metrics

Demonstrates measurable stabilization improvement.

🔥 Phase-3 — Stochastic Multi-Wind Robustness

600k timestep PPO training

Randomized wind injection

Aggressive disturbance curriculum

Cross-regime evaluation

Stability Score Results:
Regime	Stability Score
Calm	91+
Mixed	89+
Strong	86+

All regimes remain >85/100, indicating robust generalization.

📈 Key Technical Results

Bounded angular velocity behavior

Reduced rotational variance

Controlled wind-response coupling

No policy collapse under strong disturbance

Stable performance across checkpoints

Mathematically:

sup ||ω(t)|| < ω_max

∫ ||ω(t)||² dt remains finite

||Δp(t)|| < ε

🎮 Simulation Environment

Unreal Engine 5.5

Cosys-AirSim

Custom wind disturbance injection

Deterministic and stochastic evaluation pipelines

🧪 Training Details

Algorithm: PPO

Framework: Stable-Baselines3

Reward shaping penalizes:

Angular velocity magnitude

Variance

Position drift

Policy trained under stochastic wind randomization

🌐 Interactive Documentation

The project includes a fully interactive technical documentation frontend built with:

Next.js

GSAP animations

Interactive phase visualizations

Graph-based analysis panels

Embedded simulation videos

📎 Live Demo here:

[https://your-username.github.io/repo-name](https://sanjay1712ksk.github.io/Aero-Controllers/)

🎥 Demonstration Media

Includes:

Early crash under strong wind

Training progression

Phase-3 robust flight

Multi-regime evaluation recordings
