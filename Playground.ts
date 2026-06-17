import { registerStart } from "./Yuu API/RegisterStart";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { antichamber } from "./Antichamber";
import { initializeCubeGun, CubeEntity } from "./CubeGun";
import { scene } from "./Scene";

registerStart(start);
async function start() {

  // gravity door with block under it
  antichamber.spawnDoor(new Vector3(9,0,0));



  // static door at 18,0,0
  antichamber.spawnStaticDoor(new Vector3(18, 0, 0));

  // gravity door down physics, laser makes it go up
  // 22.25x, 0, 0
  // door connected to laser, laser position 13.5x
  antichamber.spawnLaserDoor(new Vector3(22.25, 0, 0), new Vector3(13.5, 1.0, 0));


  // gravity door at 31.75x, 0,0
  // laser at 36,0,0
  antichamber.spawnLaserDoor(new Vector3(31.75, 0, 0), new Vector3(35.6, 1.0, 0), new Vector3(0.1, 0.1, 0.1));
  new CubeEntity(new Vector3(35.6, 1.0, 0));
  
  // gravity door up, blocked with cube on 35.5 laser makes it go up


  antichamber.spawnStaticDoor(new Vector3(35.5, 0, 0));
  antichamber.spawnStaticDoor(new Vector3(39, 0, 0));

  // static door at 35.5,0,0
  // static door at 39,0,0


  // gravity door down, laser makes it go up
  antichamber.spawnLaserDoor(new Vector3(42.5, 0, 0), new Vector3(38.9, 1.0, 0), new Vector3(0.1, 0.1, 0.1));

  // static door at 54,0,0
  antichamber.spawnStaticDoor(new Vector3(54, 0, 0));


  antichamber.spawnLaserDoor(new Vector3(55, 0, 0), new Vector3(53.9, 1.0, 0), new Vector3(0.1, 0.1, 0.1));
  antichamber.spawnLaserDoor(new Vector3(56.5, 0, 0), new Vector3(53.9, 1.0, 0), new Vector3(0.1, 0.1, 0.1));
  antichamber.spawnLaserDoor(new Vector3(57.8, 0, 0), new Vector3(53.9, 1.0, 0), new Vector3(0.1, 0.1, 0.1));



  antichamber.spawnStaticDoor(new Vector3(58, 0, 0));


  // 3 doors 
  // gravity down, laser makes it go up
  // gravity up, laser make it go down
  // gravity down, laser make it go up


  // static door at 58,0,0

  initializeCubeGun();
  // scene.spawnChamber();
  scene.spawnScene();
}
