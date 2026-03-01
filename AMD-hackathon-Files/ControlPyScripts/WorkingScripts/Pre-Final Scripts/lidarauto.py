import cosysairsim as airsim
import numpy as np
import time

# =====================================================
# CONFIGURATION
# =====================================================

DT = 0.2

FORWARD_SPEED = 2.0
CREEP_SPEED = 0.6

CONTACT_DIST = 1.2        # meters (touch zone)
FREE_SPACE_DIST = 2.5     # meters

YAW_RATE = 45.0           # deg/sec
ROTATE_TIME = 2.0         # seconds (~90 deg)

ROTATION_COOLDOWN = 2.5   # seconds
POST_ROTATE_DURATION = 1.0  # seconds of forced forward motion

# Altitude limit: 200 cm → AirSim NED
Z_MAX = -2.0

last_rotation_time = 0.0
post_rotate_until = 0.0

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
    """No data = free space"""
    if len(lidar_data.point_cloud) < 3:
        return float("inf")
    pts = np.array(lidar_data.point_cloud).reshape(-1, 3)
    return np.min(np.linalg.norm(pts, axis=1))


def enforce_altitude(vz, current_z):
    """Hard altitude ceiling"""
    if current_z < Z_MAX and vz < 0:
        return 0.0
    return vz

# =====================================================
# MAIN LOOP
# =====================================================

print("🧠 Touch → Rotate → Forward navigation started")

try:
    while True:

        state = client.getMultirotorState()
        pos = state.kinematics_estimated.position

        # Read ALL LiDAR directions
        lidar_front = client.getLidarData(lidar_name="LidarFront")
        lidar_left  = client.getLidarData(lidar_name="LidarLeft")
        lidar_right = client.getLidarData(lidar_name="LidarRight")

        front_dist = min_lidar_distance(lidar_front)
        left_dist  = min_lidar_distance(lidar_left)
        right_dist = min_lidar_distance(lidar_right)

        now = time.time()

        # ---------------- TOUCH → ROTATE ----------------
        if (
            front_dist <= CONTACT_DIST
            and (now - last_rotation_time) > ROTATION_COOLDOWN
        ):

            print(
                f"🔁 CONTACT | "
                f"Front={front_dist:.2f} "
                f"Left={left_dist:.2f} "
                f"Right={right_dist:.2f}"
            )

            # Decide turn direction (more free space)
            if left_dist > right_dist:
                yaw_rate = -YAW_RATE
                turn_dir = "LEFT"
            else:
                yaw_rate = YAW_RATE
                turn_dir = "RIGHT"

            print(f"↪ ROTATING {turn_dir}")

            # Stop briefly
            client.moveByVelocityAsync(0, 0, 0, 0.3).join()

            # Rotate in place
            client.rotateByYawRateAsync(
                yaw_rate=yaw_rate,
                duration=ROTATE_TIME
            ).join()

            last_rotation_time = now
            post_rotate_until = now + POST_ROTATE_DURATION

        # ---------------- FORWARD MOTION ----------------
        if now < post_rotate_until:
            # FORCE forward motion after rotation
            vx = FORWARD_SPEED
            print("➡ POST-ROTATE FORWARD BURST")
        else:
            if front_dist > FREE_SPACE_DIST:
                vx = FORWARD_SPEED
            else:
                vx = CREEP_SPEED

        vy = 0.0
        vz = enforce_altitude(0.0, pos.z_val)

        print(
            f"FORWARD | "
            f"Front={front_dist:.2f} "
            f"Left={left_dist:.2f} "
            f"Right={right_dist:.2f} "
            f"Z={pos.z_val:.2f}"
        )

        client.moveByVelocityAsync(vx, vy, vz, DT)
        time.sleep(DT)

except KeyboardInterrupt:
    print("🛑 Manual stop")

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
