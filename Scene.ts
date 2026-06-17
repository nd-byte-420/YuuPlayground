import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";

export const scene = {
  spawnChamber,
}

// create a cube and attach shadercode new/
async function spawnChamber() {
  const chamber = spawnPrimitive.chamber(new Vector3(0, 0, 0), new Vector3(2, 2, 2), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Physics', undefined);

  const nodeId = chamber.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, chamberShader);
}

const chamberShader = `
shader_type spatial;
render_mode cull_disabled;

uniform vec4 wall_color : source_color = vec4(0.8, 0.8, 0.8, 1.0);

void fragment() {
    ALBEDO = wall_color.rgb;
}
`

