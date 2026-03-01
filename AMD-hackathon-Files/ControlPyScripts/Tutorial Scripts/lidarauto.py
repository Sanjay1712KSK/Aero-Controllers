import cosysairsim as airsim
import numpy as np
import time

# =====================================================
# CONFIGURATION
# =====================================================

DT = 0.2                     # control timestep (s)
SAFE_SPEED = 2.0             # forward speed (m/s)
TURN_SPEED = 1.5             # lateral speed (m/s)
FREE_SPACE_DIST = 6.0        # meters
STOP_DIST = 3.5              # emergency stop distance

# Altitude limit
# Unreal: 200 cm → AirSim NED = -2.0 m
Z_MAX = -2.0                 # DO NOT go above this (hard ceiling)

# =====================================================
# CONNECT TO AIRSIM
# =====================================================

client = airsim.MultirotorClient()
client.confirmConnection()

client.enableApiControl(True)
client.armDisarm(True)

print("🚁 Takeoff")
client.takeoffAsync().join()
time.sleep(2)

# =====================================================
# HELPER FUNCTIONS
# =====================================================

def min_lidar_distance(lidar_data):
    if len(lidar_data.point_cloud) < 3:
        return float("inf")
    pts = np.array(lidar_data.point_cloud).reshape(-1, 3)
    return np.min(np.linalg.norm(pts, axis=1))


def choose_direction(front, left, right):
    """
    Greedy free-space selection
    """
    if front > FREE_SPACE_DIST:
        return "FORWARD"
    if left > FREE_SPACE_DIST:
        return "LEFT"
    if right > FREE_SPACE_DIST:
        return "RIGHT"
    return "STOP"


def enforce_altitude(vz, current_z):
    """
    Prevent drone from going above altitude limit
    """
    if current_z < Z_MAX and vz < 0:
        return 0.0
    return vz

# =====================================================
# MAIN CONTROL LOOP
# =====================================================

print("🧠 LiDAR-based autonomous navigation started")

try:
    while True:

        # Get state
        state = client.getMultirotorState()
        pos = state.kinematics_estimated.position

        # Read LiDARs
        lidar_front = client.getLidarData(lidar_name="LidarFront")
        lidar_left  = client.getLidarData(lidar_name="LidarLeft")
        lidar_right = client.getLidarData(lidar_name="LidarRight")

        front_dist = min_lidar_distance(lidar_front)
        left_dist  = min_lidar_distance(lidar_left)
        right_dist = min_lidar_distance(lidar_right)

        decision = choose_direction(front_dist, left_dist, right_dist)

        # Default velocities
        vx, vy, vz = 0.0, 0.0, 0.0

        # Emergency stop
        if front_dist < STOP_DIST:
            vx, vy = 0.0, 0.0
            print(f"🟥 EMERGENCY STOP | Front: {front_dist:.2f} m")

        else:
            if decision == "FORWARD":
                vx = SAFE_SPEED
            elif decision == "LEFT":
                vy = -TURN_SPEED
            elif decision == "RIGHT":
                vy = TURN_SPEED

        # Enforce altitude ceiling
        vz = enforce_altitude(vz, pos.z_val)

        print(
            f"Decision: {decision} | "
            f"Front: {front_dist:.1f} m | "
            f"Left: {left_dist:.1f} m | "
            f"Right: {right_dist:.1f} m | "
            f"Z: {pos.z_val:.2f}"
        )

        client.moveByVelocityAsync(vx, vy, vz, DT)
        time.sleep(DT)

except KeyboardInterrupt:
    print("🛑 Stopping navigation")

# =====================================================
# SAFE SHUTDOWN
# =====================================================

client.moveByVelocityAsync(0, 0, 0, 1).join()
client.hoverAsync().join()
time.sleep(1)
client.landAsync().join()

client.armDisarm(False)
client.enableApiControl(False)

print("✅ Mission ended safely")
