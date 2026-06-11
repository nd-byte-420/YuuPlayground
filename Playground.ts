import { registerStart } from "./Yuu API/RegisterStart";
import { playgroundDemos } from "./PlaygroundLaex";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { lexy } from "./PlaygroundLexy";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";


registerStart(start);
async function start() {
  playgroundDemos.spawnPaintableSphere(new Vector3(-1.5, 2, -3));
  playgroundDemos.canvas(new Vector3(0, 0.85, -4), Quaternion.one, Vector3.one);
  lexy.spawnDrawSettingButtons(new Vector3(0, 2.05, -4.15));
  playgroundDemos.colorPicker(new Vector3(1, 1.5, -3.5), Quaternion.fromEuler(new Vector3(0, -Math.PI / 4, 0)), new Vector3(0.35, 1, 0.35));
  playgroundDemos.spawnShaderSphere(new Vector3(-5, 2.5, -4));

  playgroundDemos.spawnDissolveCube(new Vector3(-11, 2.5, 4));
  playgroundDemos.spawnDissolveCube(new Vector3(-10, 2.5, 4));
  playgroundDemos.spawnDissolveCube(new Vector3(-9, 2.5, 4));
  playgroundDemos.spawnDissolveCube(new Vector3(-8, 2.5, 4));
  playgroundDemos.spawnDissolveCube(new Vector3(-7, 2.5, 4));
  playgroundDemos.spawnDissolveCube(new Vector3(-6, 2.5, 4));

  playgroundDemos.spawnDissolveCube(new Vector3(-11, 1.5, 4));
  playgroundDemos.spawnDissolveCube(new Vector3(-10, 1.5, 4));
  playgroundDemos.spawnDissolveCube(new Vector3(-9, 1.5, 4));
  playgroundDemos.spawnDissolveCube(new Vector3(-8, 1.5, 4));
  playgroundDemos.spawnDissolveCube(new Vector3(-7, 1.5, 4));
  playgroundDemos.spawnDissolveCube(new Vector3(-6, 1.5, 4));




  // playgroundDemos.spawnDissolveCube(new Vector3(-11, 2.5, 3));
  // playgroundDemos.spawnDissolveCube(new Vector3(-10, 2.5, 3));
  // playgroundDemos.spawnDissolveCube(new Vector3(-9, 2.5, 3));
  // playgroundDemos.spawnDissolveCube(new Vector3(-8, 2.5, 3));
  // playgroundDemos.spawnDissolveCube(new Vector3(-7, 2.5, 3));
  // playgroundDemos.spawnDissolveCube(new Vector3(-6, 2.5, 3));

  // playgroundDemos.spawnDissolveCube(new Vector3(-11, 1.5, 3));
  // playgroundDemos.spawnDissolveCube(new Vector3(-10, 1.5, 3));
  // playgroundDemos.spawnDissolveCube(new Vector3(-9, 1.5, 3));
  // playgroundDemos.spawnDissolveCube(new Vector3(-8, 1.5, 3));
  // playgroundDemos.spawnDissolveCube(new Vector3(-7, 1.5, 3));
  // playgroundDemos.spawnDissolveCube(new Vector3(-6, 1.5, 3));

  // playgroundDemos.spawnDissolveCube(new Vector3(-11, 2.5, 2));
  // playgroundDemos.spawnDissolveCube(new Vector3(-10, 2.5, 2));
  // playgroundDemos.spawnDissolveCube(new Vector3(-9, 2.5, 2));
  // playgroundDemos.spawnDissolveCube(new Vector3(-8, 2.5, 2));
  // playgroundDemos.spawnDissolveCube(new Vector3(-7, 2.5, 2));
  // playgroundDemos.spawnDissolveCube(new Vector3(-6, 2.5, 2));

  // playgroundDemos.spawnDissolveCube(new Vector3(-11, 1.5, 2));
  // playgroundDemos.spawnDissolveCube(new Vector3(-10, 1.5, 2));
  // playgroundDemos.spawnDissolveCube(new Vector3(-9, 1.5, 2));
  // playgroundDemos.spawnDissolveCube(new Vector3(-8, 1.5, 2));
  // playgroundDemos.spawnDissolveCube(new Vector3(-7, 1.5, 2));
  // playgroundDemos.spawnDissolveCube(new Vector3(-6, 1.5, 2));

  // playgroundDemos.spawnDissolveCube(new Vector3(-11, 2.5, 1));
  // playgroundDemos.spawnDissolveCube(new Vector3(-10, 2.5, 1));
  // playgroundDemos.spawnDissolveCube(new Vector3(-9, 2.5, 1));
  // playgroundDemos.spawnDissolveCube(new Vector3(-8, 2.5, 1));
  // playgroundDemos.spawnDissolveCube(new Vector3(-7, 2.5, 1));
  // playgroundDemos.spawnDissolveCube(new Vector3(-6, 2.5, 1));

  // playgroundDemos.spawnDissolveCube(new Vector3(-11, 1.5, 1));
  // playgroundDemos.spawnDissolveCube(new Vector3(-10, 1.5, 1));
  // playgroundDemos.spawnDissolveCube(new Vector3(-9, 1.5, 1));
  // playgroundDemos.spawnDissolveCube(new Vector3(-8, 1.5, 1));
  // playgroundDemos.spawnDissolveCube(new Vector3(-7, 1.5, 1));
  // playgroundDemos.spawnDissolveCube(new Vector3(-6, 1.5, 1));

  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-11, 2.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-10, 2.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-9, 2.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-8, 2.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-7, 2.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-6, 2.5, 3));

  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-11, 2.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-10, 2.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-9, 2.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-8, 2.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-7, 2.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-6, 2.25, 3));

  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-11, 2.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-10, 2.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-9, 2.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-8, 2.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-7, 2.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-6, 2.0, 3));

  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-11, 1.75, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-10, 1.75, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-9, 1.75, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-8, 1.75, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-7, 1.75, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-6, 1.75, 3));

  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-11, 1.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-10, 1.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-9, 1.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-8, 1.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-7, 1.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-6, 1.5, 3));

  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-11, 1.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-10, 1.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-9, 1.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-8, 1.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-7, 1.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-6, 1.25, 3));

  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-11, 1.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-10, 1.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-9, 1.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-8, 1.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-7, 1.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-6, 1.0, 3));

  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-11, 0.75, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-10, 0.75, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-9, 0.75, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-8, 0.75, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-7, 0.75, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-6, 0.75, 3));

  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-11, 0.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-10, 0.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-9, 0.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-8, 0.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-7, 0.5, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-6, 0.5, 3));

  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-11, 0.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-10, 0.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-9, 0.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-8, 0.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-7, 0.25, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-6, 0.25, 3));

  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-11, 0.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-10, 0.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-9, 0.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-8, 0.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-7, 0.0, 3));
  // playgroundDemos.spawnDissolveCubeSmall(new Vector3(-6, 0.0, 3));

  // write a function to spawn a 5x5x5 grid of small cubes

  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = 0; z < 20; z++) {
        playgroundDemos.spawnDissolveCubeSmall(new Vector3(-11 + (x * 0.25), 2.5 - (y * 0.25), 3 - (z * 0.25)));

      }
    }
  }




  playgroundDemos.spawnDissolveCubeBig(new Vector3(6, 1.5, 1));

  // Come back to this to get water shader working
  // playgroundDemos.spawnShaderSphere(new Vector3(-5, 2.5, -4));
}

// registerStart(start2);
function start2() {
  // const peer = new Peer();
  console.log(Godot.networking.rtcPeer.create());
}
