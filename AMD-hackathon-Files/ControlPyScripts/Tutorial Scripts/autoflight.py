import cosysairsim as airsim
import numpy as np
import time
import matplotlib.pyplot as plt

# -----------------------------
# USER PARAMETERS
# -----------------------------
FORWARD_SPEED = 3.0          # m/s
SAFE_FORWARD_DIST = 6.0      # meters
SAFE_UP_DIST = 2.5           # meters
ASCEND_GAIN = 0.6
MAX_ASCEND = 2.0
CONTROL_DT = 0.1             # seconds

LIDAR_NAME = "Lidar1"
VEHICLE_NAME = "Drone1"

# -----------------------------
# CONNECT TO AIRSIM
# -----------------------------
client = airsim.MultirotorClient()
client.confirmConnection()

client.enableApiControl(True)
client.armDisarm(True)
client.takeoffAsync().join()

print("[INFO] Drone airborne")

# -----------------------------
# LIDAR PROCESSING
# -----------------------------
def get_lidar_points():
    data = client.getLidarData(
        lidar_name=LIDAR_NAME,
        vehicle_name=VEHICLE_NAME
    )

    if len(data.point_cloud) < 3:
        return None

    pts = np.array(data.point_cloud, dtype=np.float32)
    return pts.reshape(-1, 3)

# -----------------------------
# LIVE LIDAR VISUALIZATION
# -----------------------------
plt.ion()
fig, ax = plt.subplots(figsize=(6, 6))
scat = ax.scatter([], [], s=2)

ax.set_xlim(0, 15)
ax.set_ylim(-10, 10)
ax.set_xlabel("Forward X (m)")
ax.set_ylabel("Right Y (m)")
ax.set_title("LiDAR Top View (Live)")

# -----------------------------
# MAIN CONTROL LOOP
# -----------------------------
try:
    while True:
        points = get_lidar_points()

        vz = 0.0  # vertical velocity (down positive)

        if points is not None:
            # -----------------------------
            # OBSTACLE CHECK (FORWARD)
            # -----------------------------
            forward_pts = points[
                (points[:, 0] > 0) &
                (points[:, 0] < SAFE_FORWARD_DIST) &
                (np.abs(points[:, 1]) < 2)
            ]

            # -----------------------------
            # OBSTACLE CHECK (ABOVE)
            # -----------------------------
            above_pts = points[
                points[:, 2] < -SAFE_UP_DIST
            ]

            if len(forward_pts) > 0 or len(above_pts) > 0:
                min_dist = np.min(forward_pts[:, 0]) if len(forward_pts) > 0 else SAFE_FORWARD_DIST
                error = SAFE_FORWARD_DIST - min_dist
                vz = -np.clip(ASCEND_GAIN * error, 0, MAX_ASCEND)

            # -----------------------------
            # UPDATE LIDAR PLOT (TOP VIEW)
            # -----------------------------
            scat.set_offsets(points[:, :2])
            fig.canvas.draw_idle()
            fig.canvas.flush_events()

        # -----------------------------
        # SEND VELOCITY COMMAND
        # -----------------------------
        client.moveByVelocityAsync(
            vx=FORWARD_SPEED,
            vy=0,
            vz=vz,
            duration=CONTROL_DT,
            vehicle_name=VEHICLE_NAME
        )

        time.sleep(CONTROL_DT)

except KeyboardInterrupt:
    print("\n[INFO] Stopping drone...")

finally:
    client.hoverAsync().join()
    client.landAsync().join()
    client.armDisarm(False)
    client.enableApiControl(False)
    print("[INFO] Shutdown complete")
