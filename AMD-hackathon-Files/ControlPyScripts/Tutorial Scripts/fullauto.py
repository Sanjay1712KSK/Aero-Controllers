import cosysairsim as airsim
import numpy as np
import csv
import time
import matplotlib.pyplot as plt
import cv2
VEHICLE = "Drone1"

LIDARS = [
    "LidarFront",
    "LidarBack",
    "LidarLeft",
    "LidarRight",
    "LidarDown"
]

CRUISE_ALT = -50.0           # NED (negative = up)
FORWARD_SPEED = 5.0          # m/s
YAW_GAIN = 0.8
MAX_YAW_RATE = 40.0          # deg/s
DT = 0.1                     # control loop

DEPTH_CAMERA = "DepthDown"
MAX_DEPTH_METERS = 50.0
DEPTH_PERIOD = 0.2           # seconds (throttle FPV)

CSV_FILE = "multilidar_flight_log.csv"
client = airsim.MultirotorClient()
client.confirmConnection()

client.enableApiControl(True)
client.armDisarm(True)
client.takeoffAsync().join()

print("[INFO] Drone airborne")

# ===========================
# CSV SETUP
# ===========================
with open(CSV_FILE, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow([
        "time",
        "x", "y", "z",
        "front_pts", "back_pts", "left_pts", "right_pts", "down_pts",
        "yaw_rate_cmd",
        "min_depth_down"
    ])

# ===========================
# LIVE LIDAR GRAPH
# ===========================
plt.ion()
fig, ax = plt.subplots()
bars = ax.bar(LIDARS, [0] * len(LIDARS))
ax.set_ylim(0, 2000)
ax.set_title("LiDAR Point Density (Live)")
ax.set_ylabel("Points")

# ===========================
# HELPERS
# ===========================
def lidar_count(name):
    try:
        data = client.getLidarData(name, VEHICLE)
        return len(data.point_cloud) // 3
    except:
        return 0

def get_depth_fpv():
    responses = client.simGetImages([
        airsim.ImageRequest(
            DEPTH_CAMERA,
            airsim.ImageType.DepthPerspective,
            pixels_as_float=True
        )
    ], vehicle_name=VEHICLE)

    if not responses or responses[0].height == 0:
        return None, None

    img = np.array(responses[0].image_data_float, dtype=np.float32)
    img = img.reshape(responses[0].height, responses[0].width)

    img = np.clip(img, 0.1, MAX_DEPTH_METERS)
    min_depth = float(np.min(img))

    img_norm = cv2.normalize(img, None, 0, 255, cv2.NORM_MINMAX)
    img_norm = img_norm.astype(np.uint8)
    img_color = cv2.applyColorMap(img_norm, cv2.COLORMAP_TURBO)

    return img_color, min_depth

# ===========================
# MAIN CONTROL LOOP
# ===========================
last_depth_time = 0

try:
    while True:
        state = client.getMultirotorState(VEHICLE)
        pos = state.kinematics_estimated.position

        # ---------------------------
        # ALTITUDE HOLD
        # ---------------------------
        z_error = CRUISE_ALT - pos.z_val
        vz = np.clip(0.6 * z_error, -2.0, 2.0)

        # ---------------------------
        # LIDAR READINGS
        # ---------------------------
        counts = {lid: lidar_count(lid) for lid in LIDARS}

        # ---------------------------
        # DEPTH FPV (THROTTLED)
        # ---------------------------
        min_depth = None
        if time.time() - last_depth_time > DEPTH_PERIOD:
            depth_frame, min_depth = get_depth_fpv()
            last_depth_time = time.time()

            if depth_frame is not None:
                cv2.imshow("Depth FPV (Downward)", depth_frame)
                cv2.waitKey(1)

        # ---------------------------
        # REACTIVE YAW CONTROL
        # ---------------------------
        yaw_rate = 0.0
        if counts["LidarFront"] > 300:
            diff = counts["LidarLeft"] - counts["LidarRight"]
            if abs(diff) > 50:  # deadband
                yaw_rate = YAW_GAIN * diff

        yaw_rate = np.clip(yaw_rate, -MAX_YAW_RATE, MAX_YAW_RATE)

        # ---------------------------
        # MOTION COMMAND
        # ---------------------------
        client.moveByVelocityAsync(
            vx=FORWARD_SPEED,
            vy=0.0,
            vz=vz,
            duration=DT,
            yaw_mode=airsim.YawMode(True, yaw_rate),
            vehicle_name=VEHICLE
        )

        # ---------------------------
        # CSV LOGGING
        # ---------------------------
        with open(CSV_FILE, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([
                time.time(),
                pos.x_val, pos.y_val, pos.z_val,
                counts["LidarFront"],
                counts["LidarBack"],
                counts["LidarLeft"],
                counts["LidarRight"],
                counts["LidarDown"],
                yaw_rate,
                min_depth
            ])

        # ---------------------------
        # UPDATE GRAPH
        # ---------------------------
        for bar, lid in zip(bars, LIDARS):
            bar.set_height(counts[lid])
        fig.canvas.draw_idle()
        fig.canvas.flush_events()

        time.sleep(DT)

except KeyboardInterrupt:
    print("[INFO] Interrupted by user")

finally:
    cv2.destroyAllWindows()
    client.landAsync().join()
    client.armDisarm(False)
    client.enableApiControl(False)
    print("[INFO] Flight complete, CSV saved:", CSV_FILE)