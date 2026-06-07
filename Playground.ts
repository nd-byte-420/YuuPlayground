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

  // Come back to this to get water shader working
  // playgroundDemos.spawnShaderSphere(new Vector3(-5, 2.5, -4));
}

// registerStart(start2);
function start2() {
  // const peer = new Peer();
  console.log(Godot.networking.rtcPeer.create());
}
