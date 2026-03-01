# GPS-Denied Autonomous Drone Stabilization
Learning-Based Rotational & Translational Stability Under Stochastic Wind
600K model file available under Pre-releases along with performance Metrics Graphs and logs
## Overview

Autonomous drones operating in GPS-denied environments (indoor, underground, urban canyon, disaster zones) rely on Inertial Navigation Systems (INS), which suffer cumulative drift due to IMU bias and integration error.

This project presents a learning-based stabilization framework that:

Suppresses rotational instability

Maintains bounded angular velocity under disturbance

Reduces trajectory divergence

Generalizes across calm, mixed, and strong stochastic wind regimes

The system is trained and evaluated entirely in a high-fidelity simulation environment using PPO reinforcement learning.

## Problem Statement

Pure INS navigation accumulates drift over time, leading to:

Rotational instability

Position divergence

Unbounded angular velocity growth

Failure under external disturbance

This repository implements a real-time learning-based stabilizer that maintains bounded state behavior without GPS correction.

## System Architecture

### Components

Simulation Engine: Unreal Engine 5 + AirSim

Physics Layer: Multirotor rigid-body dynamics

Control Framework: PPO (Stable-Baselines3)

Disturbance Model: Stochastic wind injection

Evaluation Metrics: RMSE, variance, angular energy, stability score

### Repository Structure

# Repository Folder Structure

## Top-Level
S:\GPSDeniedDroneDocumentation
- .github/
- aero-controllers-3d/
- AMD-hackathon-Files/
- GPSDeniedDroneInteractiveDocumentation/
- Simulation Media/

## AMD Slingshot Hackathon (Detailed Folder Structure)
S:\GPSDeniedDroneDocumentation\AMD-hackathon-Files
- ControlPyScripts/
- ControlPyScripts/Important Pre-Log files/
- ControlPyScripts/Tutorial Scripts/
- ControlPyScripts/WorkingScripts/
- ControlPyScripts/Tutorial Scripts/Logged Datasets/
- ControlPyScripts/Tutorial Scripts/Videos/
- ControlPyScripts/WorkingScripts/MainSim/
- ControlPyScripts/WorkingScripts/Pre-Final Scripts/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/
- ControlPyScripts/WorkingScripts/MainSim/ClearLog (Pre-Phase)/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/Phase2/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/Phase_1/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/Phase2/Datasets/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/Phase2/Scripts/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Datasets/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/PPO_Model/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Datasets/v1.0(Normal Stabilization)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Datasets/v1.1(Reward System)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Datasets/v1.1(Reward System)/v1.1.0(Deterministic)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Datasets/v1.1(Reward System)/v1.1.1(Stochastic)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Datasets/v1.1(Reward System)/v1.1.2(Clear)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Datasets/v1.1(Reward System)/v1.1.0(Deterministic)/First Run/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Datasets/v1.1(Reward System)/v1.1.0(Deterministic)/Second Run/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Datasets/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.1/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Datasets/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.1/Run 1 (Smooth)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Datasets/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.1/Run 2 (Strong)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Datasets/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.1/Run 3 (Calm & Mixed)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/PPO_Model/v1.0(Normal Stabilization)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/PPO_Model/v1.1(Reward System)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/PPO_Model/v1.1(Reward System)/v1.1.0(Deterministic)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/PPO_Model/v1.1(Reward System)/v1.1.1(Stochastic)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/PPO_Model/v1.1(Reward System)/v1.1.2(Clear)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/PPO_Model/v1.1(Reward System)/v1.1.0(Deterministic)/First Run/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/PPO_Model/v1.1(Reward System)/v1.1.0(Deterministic)/Second Run/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/PPO_Model/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.1/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/PPO_Model/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.1/Run 1 (Smooth)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/PPO_Model/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.1/Run 2 (Strong)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/PPO_Model/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.1/Run 3 (Calm & Mixed)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.0(Normal Stabilization)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.0(Deterministic)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.2(Clear)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/__pycache__/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.0(Deterministic)/v1.1.0.1/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.0(Deterministic)/v1.1.0.1/First Run/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.0(Deterministic)/v1.1.0.1/Second Run/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.0(Deterministic)/v1.1.0.1/First Run/autosaves/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.0(Deterministic)/v1.1.0.1/Second Run/autosaves/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.0(Deterministic)/v1.1.0.1/Second Run/__pycache__/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 2 (Strong)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/First 50k Steps/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Second 50k Steps/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Verdict/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/First 50k Steps/autosaves/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Second 50k Steps/autosaves/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 2 (Strong)/Run 1 (100k)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 2 (Strong)/Run 2 (50k)/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 2 (Strong)/Run 1 (100k)/autosaves_strong/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 2 (Strong)/Run 1 (100k)/Stochastic Strong Post crash/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 2 (Strong)/Run 1 (100k)/Stochastic Strong Pre Crash/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/phase3RL/Scripts/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 2 (Strong)/Run 2 (50k)/autosaves_strong_continue/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/Phase_1/Datasets/
- ControlPyScripts/WorkingScripts/MainSim/AnomalyLog (Post-Phases)/Phases/Phase_1/Scripts/
- ControlPyScripts/WorkingScripts/MainSim/ClearLog (Pre-Phase)/Logged Datasets/
- ControlPyScripts/WorkingScripts/MainSim/ClearLog (Pre-Phase)/Scripts/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase1/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase2/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase4/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase1/visualized_outputs/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase2/visualized_outputs/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/Deterministic/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/v1.1.1.0/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/v1.1.1.0/Run 2 (Strong)/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Evaluations/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/First 50k Steps/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Second 50k Steps/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Verdict/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/First 50k Steps/autosaves/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Second 50k Steps/autosaves/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/Evaluation/
- ControlPyScripts/WorkingScripts/MainSim/Data_Visualization/Phase3/Reward System/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/Training/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.0(Normal Stabilization)/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.0(Normal Stabilization)/Evaluation/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.0(Deterministic)/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.2(Clear)/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.0(Deterministic)/Evaluation/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.0(Deterministic)/Evaluation/First Run/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.0(Deterministic)/Evaluation/Second Run/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.0(Deterministic)/Evaluation/Second Run/Evaluation Scripts/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 2 (Strong)/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Evaluation Scripts/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Model Files/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Evaluation Scripts/Evaluation 1/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Evaluation Scripts/Evaluation 2/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Evaluation Scripts/Evaluation 2/Checkpoint 5 Crash Log/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Model Files/First 50k/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Model Files/Second 50k/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 1 (Smooth)/Model Files/Verdict/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/v1/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/v2/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/v1/evaluation_phase3/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/v1/evaluation_phase3/highlight_videos/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/v1/evaluation_phase3/logs/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/v1/evaluation_phase3/plots/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/v1/evaluation_phase3/snapshots/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/v1/evaluation_phase3/highlight_videos/bad/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/v1/evaluation_phase3/highlight_videos/good/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/v1/evaluation_phase3/snapshots/bad/
- ControlPyScripts/WorkingScripts/MainSim/Model_Evaluation/Phase3RL/v1.1(Reward System)/v1.1.1(Stochastic)/v1.1.1.0/Run 3 (Calm & Mixed)/v1/evaluation_phase3/snapshots/good/

## Other Frontend Modules (Top Directories Only)
S:\GPSDeniedDroneDocumentation\GPSDeniedDroneInteractiveDocumentation\Frontend
- Logo/
- node_modules/

S:\GPSDeniedDroneDocumentation\GPSDeniedDroneInteractiveDocumentation\Frontend3D
- dist/
- node_modules/
- src/

S:\GPSDeniedDroneDocumentation\GPSDeniedDroneInteractiveDocumentation\aero-controllers-3d
- .next/
- app/
- node_modules/
- out/
- public/


## Phase Breakdown
### Phase-1 — Baseline Instability

High angular velocity variance

Frequent spike events

Underdamped rotational dynamics

No disturbance rejection

This phase establishes uncontrolled system behavior.

### Phase-2 — Quantified Stability Improvement

Introduces:

RMSE (Position & Angular)

Variance reduction

Spike suppression analysis

Trajectory consistency metrics

Demonstrates measurable stabilization improvement.

### Phase-3 — Stochastic Multi-Wind Robustness

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

### Phase 4 ( Currently In Progress ) - INS drfit Supression Training and evaluation

### Key Technical Results

Bounded angular velocity behavior

Reduced rotational variance

Controlled wind-response coupling

No policy collapse under strong disturbance

Stable performance across checkpoints

### Mathematically:

sup ||ω(t)|| < ω_max

∫ ||ω(t)||² dt remains finite

||Δp(t)|| < ε

## Simulation Environment

Unreal Engine 5.5

Cosys-AirSim

Custom wind disturbance injection

Deterministic and stochastic evaluation pipelines

## Training Details

Algorithm: PPO

Framework: Stable-Baselines3

Reward shaping penalizes:

Angular velocity magnitude

Variance

Position drift

Policy trained under stochastic wind randomization

## Interactive Documentation

The project includes a fully interactive technical documentation frontend built with:

Next.js

GSAP animations

Interactive phase visualizations

Graph-based analysis panels

Embedded simulation videos

## Live Demo here:

[https://your-username.github.io/repo-name](https://sanjay1712ksk.github.io/Aero-Controllers/)

## Demonstration Media

Includes:

Early crash under strong wind

Training progression

Phase-3 robust flight

Multi-regime evaluation recordings
