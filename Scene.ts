import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Vector2 } from "./Yuu API/Basic Types/Vector2";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Entity } from "./Yuu API/Entity";
import { getCube001 } from "./Yuu API/cube001Model";
import { getCube002 } from "./Yuu API/cube002Model";
import { getCube003 } from "./Yuu API/cube003Model";

export const scene = {
  spawnChamber,
  spawnScene,
}

function spawnModel(
  getMesh: () => [Vector3[], Vector2[], number[]],
  pos: Vector3,
  scale: Vector3,
  rot: Quaternion,
  color: Color = new Color(1, 1, 1),
  alphaTransparency: number = 1,
  hasCollider: boolean = true,
  type: BaseNodeTypes = 'Static',
  parent: Entity | undefined = undefined
): Entity {
  const entity = new Entity(pos, rot, Vector3.one, parent, type);
  entity.mesh.create(...getMesh());
  entity.mesh.color.set(color, Math.min(1, alphaTransparency));
  if (hasCollider && entity.mesh.nodeID) {
    entity.collider.createFromMeshNode(entity.mesh.nodeID, 'Concave');
  }
  entity.scale = scale;
  return entity;
}

// create a cube and attach shadercode new/
async function spawnChamber() {
  const chamber = spawnPrimitive.chamber(new Vector3(0, 2, 0), new Vector3(2, 2, 2), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Static', undefined);

  const nodeId = chamber.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, chamberShader);
}

export async function spawnScene() {
  // Spawn Cube.001
  spawnModel(
    getCube001,
    new Vector3(0.000000, 0.000000, -5.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.002
  spawnModel(
    getCube002,
    new Vector3(0.000000, 0.000000, -5.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.003
  spawnModel(
    getCube003,
    new Vector3(0.000000, 0.000000, -5.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );
}

const chamberShader = `
shader_type spatial;
render_mode cull_disabled;

uniform vec4 wall_color : source_color = vec4(0.8, 0.8, 0.8, 1.0);

void fragment() {
    ALBEDO = wall_color.rgb;
}
`;
