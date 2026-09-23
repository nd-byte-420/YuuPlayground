import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Vector2 } from "./Yuu API/Basic Types/Vector2";
import { Entity } from "./Yuu API/Entity";
import { getWorldspawn18943 } from "./Yuu API/worldspawn18943Model";
import { getWorldspawn18950 } from "./Yuu API/worldspawn18950Model";
import { getWorldspawn18957 } from "./Yuu API/worldspawn18957Model";
import { getWorldspawn18964 } from "./Yuu API/worldspawn18964Model";
import { getWorldspawn18971 } from "./Yuu API/worldspawn18971Model";
import { getWorldspawn110399 } from "./Yuu API/worldspawn110399Model";
import { getWorldspawn110406 } from "./Yuu API/worldspawn110406Model";
import { getWorldspawn110413 } from "./Yuu API/worldspawn110413Model";
import { getWorldspawn110420 } from "./Yuu API/worldspawn110420Model";
import { getWorldspawn110427 } from "./Yuu API/worldspawn110427Model";
import { getWorldspawn110434 } from "./Yuu API/worldspawn110434Model";
import { getWorldspawn110441 } from "./Yuu API/worldspawn110441Model";
import { getWorldspawn110448 } from "./Yuu API/worldspawn110448Model";
import { getWorldspawn110455 } from "./Yuu API/worldspawn110455Model";
import { getWorldspawn110462 } from "./Yuu API/worldspawn110462Model";
import { getWorldspawn110469 } from "./Yuu API/worldspawn110469Model";
import { getWorldspawn110476 } from "./Yuu API/worldspawn110476Model";
import { getWorldspawn110483 } from "./Yuu API/worldspawn110483Model";
import { getWorldspawn110490 } from "./Yuu API/worldspawn110490Model";
import { getWorldspawn110497 } from "./Yuu API/worldspawn110497Model";
import { getPropStatic55602 } from "./Yuu API/propStatic55602Model";
import { getPropStatic55785 } from "./Yuu API/propStatic55785Model";
import { getPropStatic55786 } from "./Yuu API/propStatic55786Model";
import { getPropStatic55862 } from "./Yuu API/propStatic55862Model";
import { getPropStatic55863 } from "./Yuu API/propStatic55863Model";
import { getPropStatic55864 } from "./Yuu API/propStatic55864Model";
import { getPropStatic55865 } from "./Yuu API/propStatic55865Model";
import { getPropStatic55866 } from "./Yuu API/propStatic55866Model";

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
  // Spawn worldspawn_1_8943
  spawnModel(
    getWorldspawn18943,
    new Vector3(-0.094241, -3.552597, -0.387955),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_8950
  spawnModel(
    getWorldspawn18950,
    new Vector3(-0.094246, -3.552597, 0.665436),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_8957
  spawnModel(
    getWorldspawn18957,
    new Vector3(-0.620898, -3.552597, 0.138733),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_8964
  spawnModel(
    getWorldspawn18964,
    new Vector3(0.432414, -3.552597, 0.138748),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_8971
  spawnModel(
    getWorldspawn18971,
    new Vector3(-0.094243, -5.238007, 0.138748),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10399
  spawnModel(
    getWorldspawn110399,
    new Vector3(-0.094280, -2.462555, 0.138733),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10406
  spawnModel(
    getWorldspawn110406,
    new Vector3(-2.765952, -1.026840, 0.138733),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10413
  spawnModel(
    getWorldspawn110413,
    new Vector3(2.577393, -1.026840, 0.138733),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10420
  spawnModel(
    getWorldspawn110420,
    new Vector3(-0.094280, -1.026840, -2.532944),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10427
  spawnModel(
    getWorldspawn110427,
    new Vector3(-0.094280, -1.026840, 2.810394),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10434
  spawnModel(
    getWorldspawn110434,
    new Vector3(-0.094279, 0.252686, 0.138733),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10441
  spawnModel(
    getWorldspawn110441,
    new Vector3(-2.727245, 0.170410, 0.138733),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10448
  spawnModel(
    getWorldspawn110448,
    new Vector3(2.538687, 0.170410, 0.138733),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10455
  spawnModel(
    getWorldspawn110455,
    new Vector3(-0.094278, 0.170410, -2.494232),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10462
  spawnModel(
    getWorldspawn110462,
    new Vector3(-0.094279, 0.170410, 2.771683),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10469
  spawnModel(
    getWorldspawn110469,
    new Vector3(-0.093317, 3.444244, 0.139984),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10476
  spawnModel(
    getWorldspawn110476,
    new Vector3(-0.125120, 3.457397, 0.171707),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10483
  spawnModel(
    getWorldspawn110483,
    new Vector3(-0.061483, 3.457397, 0.108246),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10490
  spawnModel(
    getWorldspawn110490,
    new Vector3(-0.139858, 3.457397, 0.093384),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn worldspawn_1_10497
  spawnModel(
    getWorldspawn110497,
    new Vector3(-0.046751, 3.457397, 0.186569),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn prop_static_55602
  spawnModel(
    getPropStatic55602,
    new Vector3(0.705720, 1.882401, 0.938721),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.382683, 0.000000, 0.923880)
  );

  // Spawn prop_static_55785
  spawnModel(
    getPropStatic55785,
    new Vector3(1.627830, 0.875397, -1.583282),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.120590, 0.379410, 0.049950, -0.915976)
  );

  // Spawn prop_static_55786
  spawnModel(
    getPropStatic55786,
    new Vector3(1.826760, 0.639404, -1.273270),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.120590, 0.379410, 0.049950, -0.915976)
  );

  // Spawn prop_static_55862
  spawnModel(
    getPropStatic55862,
    new Vector3(-0.094280, 0.287399, 0.138733),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn prop_static_55863
  spawnModel(
    getPropStatic55863,
    new Vector3(-0.094280, 0.207397, 0.138733),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn prop_static_55864
  spawnModel(
    getPropStatic55864,
    new Vector3(1.745720, 0.747406, -1.701279),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.120590, 0.379410, 0.049950, -0.915976)
  );

  // Spawn prop_static_55865
  spawnModel(
    getPropStatic55865,
    new Vector3(-1.774279, 0.497406, 1.818726),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn prop_static_55866
  spawnModel(
    getPropStatic55866,
    new Vector3(-1.874090, 0.505402, -1.535278),
    new Vector3(0.010000, 0.010000, 0.010000),
    new Quaternion(0.000000, 0.963630, 0.000000, -0.267238)
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
