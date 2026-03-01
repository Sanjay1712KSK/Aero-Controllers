import cosysairsim as ca
import time as t
client=ca.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)
client.armDisarm(True) 
client.takeoffAsync().join()
t.sleep(3)
client.moveToPositionAsync(x=10,y=0,z=-5,velocity=4).join()
client.landAsync().join()
client.armDisarm(False)
client.enableApiControl(False)