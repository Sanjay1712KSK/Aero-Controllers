'''import cosysairsim as airsim
import time
client = airsim.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)
client.armDisarm(True)

# Takeoff
print("Lift off...")
client.takeoffAsync().join()

# Hover at 3 meters
client.moveToZAsync(-3, velocity=1).join()
time.sleep(2)

print("Flying forward...")
client.moveToPositionAsync(
    x=10,   # forward
    y=0,    # no sideways motion
    z=-3,   # maintain altitude
    velocity=2
).join()

time.sleep(3)

print("Landing...")
client.landAsync().join()

client.armDisarm(False)
client.enableApiControl(False)
print("Flight completed")'''
import cosysairsim as airsim
import time

client = airsim.MultirotorClient()
client.confirmConnection()

client.enableApiControl(True)
client.armDisarm(True)

print("Taking off...")
client.takeoffAsync().join()

time.sleep(2)

path = [
    airsim.Vector3r(-28.80, -38.70, -2.0),
    airsim.Vector3r(-46.40, -63.20, -2.0),
    airsim.Vector3r(-46.40, -63.20, -2.0)
]

print("Flying path...")
client.moveOnPathAsync(
    path,
    velocity=1.5,
    drivetrain=airsim.DrivetrainType.ForwardOnly,
    yaw_mode=airsim.YawMode(False, 0),
    lookahead=1,
    adaptive_lookahead=0
).join()

print("Landing...")
client.landAsync().join()
client.armDisarm(False)
client.enableApiControl(False)