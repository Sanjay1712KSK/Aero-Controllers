import cosysairsim as airsim
import keyboard
import time
client = airsim.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)
client.armDisarm(True)
client.takeoffAsync().join()

PITCH_RATE = 0.4    # radians/sec
ROLL_RATE  = 0.4
YAW_RATE   = 0.4
THROTTLE_HOVER = 0.6
THROTTLE_STEP = 0.02
throttle = THROTTLE_HOVER
while True:
    pitch_rate = 0
    roll_rate = 0
    yaw_rate = 0

    if keyboard.is_pressed('w'):
        pitch_rate = PITCH_RATE
    if keyboard.is_pressed('s'):
        pitch_rate = -PITCH_RATE

    if keyboard.is_pressed('a'):
        roll_rate = -ROLL_RATE
    if keyboard.is_pressed('d'):
        roll_rate = ROLL_RATE

    if keyboard.is_pressed('e'):
        throttle += THROTTLE_STEP
    if keyboard.is_pressed('f'):
        throttle -= THROTTLE_STEP

    throttle = max(0.0, min(1.0, throttle))

    if keyboard.is_pressed('space'):
        client.hoverAsync().join()
        throttle = THROTTLE_HOVER
        continue

    client.moveByAngleRatesThrottleAsync(
        roll_rate,
        pitch_rate,
        yaw_rate,
        throttle,
        duration=0.05
    )
    time.sleep(0.05)