import { Async } from "./Yuu API/Async";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector2 } from "./Yuu API/Basic Types/Vector2";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Entity } from "./Yuu API/Entity";
import { Paint } from "./Yuu API/Paint";
import { Player } from "./Yuu API/Player";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Texture } from "./Yuu API/Texture";
import { CubeEntity } from "./CubeGun";
import { Events } from "./Yuu API/Events";

export const scene = {
  spawnChamber,
}

// create a cube and attach shadercode new/
async function spawnChamber() {
    const chamber = spawnPrimitive.door(new Vector3(0,0,0), new Vector3(1,1,1), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Physics', undefined);
}

