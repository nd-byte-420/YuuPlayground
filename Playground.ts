import { registerStart } from "./Yuu API/RegisterStart";

import { scene } from "./Scene";
import { Player } from "./Yuu API/Player";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Controller } from "./Yuu API/Controller";

registerStart(start);
async function start() {
  scene.spawnScene();

  Player.position.set(new Vector3(0, 11, 0));

  // if you press right trigger go up 11 units

  Controller.subscribe('rightTrigger', 'Pressed', () => {
    const prevpos = Player.position.get() || new Vector3(0, 0, 0);
    const newPos = new Vector3(prevpos.x, prevpos.y + 11, prevpos.z);
    Player.position.set(newPos);
  })
}
