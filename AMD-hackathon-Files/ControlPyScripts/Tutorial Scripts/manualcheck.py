import cosysairsim as airsim
import numpy as np
import time
client = airsim.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)
client.armDisarm(True)
print("Takeoff")
client.takeoffAsync().join()
time.sleep(2)
'''checkpoints = [ # SAFE
    (  0.00,   0.00, -15.0),
    ( -0.80,   9.80, -15.0),
    ( -22.60, -22.00, -15.0),
    ( -28.80, -38.70, -15.0),
    ( -46.40, -63.20, -15.0),
    ( -99.60, -75.30, -15.0),
    ( -108.50, -148.60, -15.0),
    ( -162.70, -107.90, -15.0),
    ( -222.33,   4.37, -15.0),
    ( -241.71,  31.73, -15.0),
    ( -274.75,  56.49, -15.0)
]'''
checkpoints = [ # NORMAL
    (  0.00,   0.00,   -15.00), 
    ( -0.80,   9.80,  -15.80),
    ( -22.60, -22.00, -15.80),
    ( -28.80, -38.70, -3.80),
    ( -46.40, -63.20, -3.80),
    ( -99.60, -75.30, -3.80),
    ( -108.50, -148.60, -5.00),
    ( -162.70, -107.90, -5.40),
    ( -222.33,   4.37, -2.50),
    ( -241.71,  31.73, -1.00),
    ( -274.75,  56.49, -6.25)   
]
SPEED = 2.5
DT = 0.2
ARRIVAL_RADIUS = 2.0
for i, (cx, cy, cz) in enumerate(checkpoints):
    print(f"Checkpoint {i+1}/{len(checkpoints)}")
    while True:
        state = client.getMultirotorState()
        pos = state.kinematics_estimated.position
        dx = cx - pos.x_val
        dy = cy - pos.y_val
        dz = cz - pos.z_val
        dist = np.sqrt(dx*dx + dy*dy + dz*dz)
        if dist < ARRIVAL_RADIUS:
            client.moveByVelocityAsync(0, 0, 0, 1).join()
            break
        vx = (dx / dist) * SPEED
        vy = (dy / dist) * SPEED
        vz = (dz / dist) * SPEED

        client.moveByVelocityAsync(vx, vy, vz, DT)
        time.sleep(DT)
print("Reached final navigation point")
time.sleep(2)
print("Initiating Landing...")
time.sleep(2)
print("Descending for landing....")
print("~~~~Better than RyanAir👏👏👏👏👏👏👏!!!!!!~~~~~")
client.moveToPositionAsync(
    -274.75, 56.49, -6.25,  
    velocity=0.8
).join()
client.hoverAsync().join()
time.sleep(1)
client.landAsync().join()
client.armDisarm(False)
client.enableApiControl(False)