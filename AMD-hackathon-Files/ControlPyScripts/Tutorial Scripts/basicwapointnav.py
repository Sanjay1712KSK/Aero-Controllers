import cosysairsim as airsim
import time

# Connect to AirSim
client = airsim.MultirotorClient()
client.confirmConnection()

# Enable control and arm
client.enableApiControl(True)
client.armDisarm(True)

# Takeoff
client.takeoffAsync().join()

# Define path (x, y, z, velocity)
path = [
    airsim.Vector3r(0, 0, -10),
    airsim.Vector3r(10, 0, -10),
    airsim.Vector3r(10, 10, -10),
    airsim.Vector3r(0, 10, -10),
    airsim.Vector3r(0, 0, -10)
]

# Fly path
client.moveOnPathAsync(
    path,
    velocity=5,
    drivetrain=airsim.DrivetrainType.ForwardOnly,
    yaw_mode=airsim.YawMode(False, 0),
    lookahead=5,
    adaptive_lookahead=1
).join()

# Hover
client.hoverAsync().join()
time.sleep(2)

# Land
client.landAsync().join()

# Disarm and release control
client.armDisarm(False)
client.enableApiControl(False)