import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Vector2 } from "./Yuu API/Basic Types/Vector2";
import { Entity } from "./Yuu API/Entity";
import { getPropStatic55863 } from "./Yuu API/propStatic55863Model";
import { applyTextureToEntity } from "./Textures/loader";

export const scene = {
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

export async function spawnScene() {

  // Spawn prop_static_55863
  const propStatic55863 = spawnModel(
    getPropStatic55863,
    new Vector3(-0.094280, 0.207397, 0.138733),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  applyTextureToEntity(propStatic55863, 'footpath');

}

const chamberShader = `
shader_type spatial;
render_mode cull_disabled;

uniform vec4 wall_color : source_color = vec4(0.8, 0.8, 0.8, 1.0);

void fragment() {
    ALBEDO = wall_color.rgb;
}
`;
