import { registerStart } from "./Yuu API/RegisterStart";

import { InteractionManager } from "./Interaction/InteractionManager";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Color } from "./Yuu API/Basic Types/Color";

registerStart(start);
async function start() {
  InteractionManager.initialize();

  const cubePos = new Vector3(0, 1.5, -2);
  const cubeScale = new Vector3(0.5, 0.5, 0.5);
  const cubeRot = Quaternion.one;
  const cubeColor = Color.blue;
  
  // Create a primitive cube with a collider so it can be raycasted and grabbed
  spawnPrimitive.cube(cubePos, cubeScale, cubeRot, cubeColor, 1, true, 'Animated', undefined);
}
