import { registerStart } from "./Yuu API/RegisterStart";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { antichamber } from "./Antichamber";
import { initializeCubeGun } from "./CubeGun";
import { scene } from "./Scene";

registerStart(start);
async function start() {

  // gravity door with block under it
  antichamber.spawnDoor(new Vector3(9,0,0));



  // static door at 18,0,0
  antichamber.spawnStaticDoor(new Vector3(18, 0, 0));

  // gravity door down, laser makes it go up

  // gravity door up, blocked with cube on 35.5 laser makes it go up

  // static door at 35.5,0,0
  // static door at 39,0,0


  // gravity door down, laser makes it go up

  // static door at 54,0,0


  // 3 doors 
  // gravity down, laser makes it go up
  // gravity up, laser make it go down
  // gravity down, laser make it go up


  // static door at 58,0,0

  initializeCubeGun();
  // scene.spawnChamber();
  scene.spawnScene();
}
