import { registerStart } from "./Yuu API/RegisterStart";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { antichamber } from "./Antichamber";
import { initializeCubeGun } from "./CubeGun";
import { scene } from "./Scene";

registerStart(start);
async function start() {
  antichamber.spawnDoor(new Vector3(9,0,0));

  initializeCubeGun();
  // scene.spawnChamber();
  scene.spawnScene();
}
