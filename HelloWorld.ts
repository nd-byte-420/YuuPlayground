import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { inWorldConsole } from "./Yuu API/Console";
import { registerStart } from "./Yuu API/RegisterStart";
import { playgroundDemos } from "./Playground";

registerStart(start);
function start() {
  inWorldConsole.visible(true, new Vector3(0, 1.5, -1.5));

  console.log('Hello World!');

  // load a cube
  playgroundDemos.spawnCube(new Vector3(0, 1.5, -4.5))
}