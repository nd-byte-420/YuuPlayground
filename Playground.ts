import { registerStart } from "./Yuu API/RegisterStart";

import { scene } from "./Scene";

registerStart(start);
async function start() {
  scene.spawnScene();
}
