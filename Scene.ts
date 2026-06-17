import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";

export const scene = {
  spawnChamber,
}

// create a cube and attach shadercode new/
async function spawnChamber() {
    const chamber = spawnPrimitive.chamber(new Vector3(0,0,0), new Vector3(1,1,1), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Physics', undefined);
}

