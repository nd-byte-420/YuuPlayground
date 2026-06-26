import { Color } from "../../Yuu API/Basic Types/Color";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { Vector2 } from "../../Yuu API/Basic Types/Vector2";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Entity } from "../../Yuu API/Entity";
import { spawnPrimitive } from "../../Yuu API/SpawnPrimitive";
import { Files } from "../../Yuu API/Files";
import { ModelingTool } from "./ModelingTool";
import { SceneManager, SceneNode } from "./SceneManager";

/** The primitive types we can reconstruct without storing mesh data. */
export type SerializedObjectType = 'Cube' | 'Sphere' | 'Plane' | 'Cone' | 'Custom';

export interface SerializedObject {
  name: string;
  type: SerializedObjectType;
  pos: { x: number; y: number; z: number };
  rot: { x: number; y: number; z: number; w: number };
  scale: { x: number; y: number; z: number };
  color: { r: number; g: number; b: number; a: number };
  shader?: string;
  /** Only present for 'Custom' (FBX-imported) objects. */
  mesh?: {
    verts: number[];   // flat: x,y,z,x,y,z,...
    uvs: number[];     // flat: u,v,u,v,...
    triangles: number[];
  };
  children: SerializedObject[];
}

export interface SerializedScene {
  version: 1;
  objects: SerializedObject[];
}

// ─────────────────────────────────────────────
// SAVE
// ─────────────────────────────────────────────

function serializeNode(node: SceneNode): SerializedObject {
  const entity = node.entity;
  const pos = entity.pos;
  const rot = entity.rot;
  const scale = entity.scale;

  // Determine type
  let type: SerializedObjectType = 'Custom';
  if (node.name.startsWith('Cube')) type = 'Cube';
  else if (node.name.startsWith('Sphere')) type = 'Sphere';
  else if (node.name.startsWith('Plane')) type = 'Plane';
  else if (node.name.startsWith('Cone')) type = 'Cone';

  const obj: SerializedObject = {
    name: node.name,
    type,
    pos: { x: pos.x, y: pos.y, z: pos.z },
    rot: { x: rot.x, y: rot.y, z: rot.z, w: rot.w },
    scale: { x: scale.x, y: scale.y, z: scale.z },
    color: {
      r: entity.customColor.r,
      g: entity.customColor.g,
      b: entity.customColor.b,
      a: entity.customAlpha,
    },
    children: [],
  };

  if (entity.customShader) {
    obj.shader = entity.customShader;
  }

  // For custom meshes, store the raw mesh data
  if (type === 'Custom') {
    const verts = entity.mesh.verts;
    const uvs = entity.mesh.uvs;
    const triangles = entity.mesh.triangles;

    const flatVerts: number[] = [];
    for (const v of verts) {
      flatVerts.push(v.x, v.y, v.z);
    }
    const flatUVs: number[] = [];
    for (const uv of uvs) {
      flatUVs.push(uv.x, uv.y);
    }

    obj.mesh = {
      verts: flatVerts,
      uvs: flatUVs,
      triangles: [...triangles],
    };
  }

  // Recurse children
  for (const childId of node.childIds) {
    const childNode = SceneManager.getNode(childId);
    if (childNode) {
      obj.children.push(serializeNode(childNode));
    }
  }

  return obj;
}

export function saveScene(fileName: string): boolean {
  const roots = SceneManager.getRoots();
  const scene: SerializedScene = {
    version: 1,
    objects: roots.map(root => serializeNode(root)),
  };

  const json = JSON.stringify(scene, null, 2);

  try {
    Files.text.create('user://worlds', '', fileName, '.json', json);
    console.log(`Scene saved as ${fileName}.json`);
    return true;
  } catch (e) {
    console.log(`Failed to save scene: ${e}`);
    return false;
  }
}

// ─────────────────────────────────────────────
// LOAD
// ─────────────────────────────────────────────

function spawnSerializedObject(
  obj: SerializedObject,
  parentEntity: Entity | undefined,
  parentSceneId: number | undefined
): void {
  const pos = new Vector3(obj.pos.x, obj.pos.y, obj.pos.z);
  const rot = new Quaternion(obj.rot.x, obj.rot.y, obj.rot.z, obj.rot.w);
  const scale = new Vector3(obj.scale.x, obj.scale.y, obj.scale.z);
  const color = new Color(obj.color.r, obj.color.g, obj.color.b);
  const alpha = obj.color.a;

  let entity: Entity | undefined;

  switch (obj.type) {
    case 'Cube':
      entity = spawnPrimitive.cube(pos, scale, rot, color, alpha, true, 'Static', parentEntity);
      break;
    case 'Sphere':
      entity = spawnPrimitive.sphere(16, 16, pos, scale.x, rot, color, alpha, 'Convex', 'Static', parentEntity);
      break;
    case 'Plane':
      entity = spawnPrimitive.plane('Both', pos, scale, rot, color, alpha, 'Convex', 'Static', parentEntity);
      break;
    case 'Cone':
      entity = spawnPrimitive.cone(16, pos, scale.x, rot, color, alpha, 'Convex', 'Static', parentEntity);
      break;
    case 'Custom': {
      if (!obj.mesh) {
        console.log(`Custom object "${obj.name}" has no mesh data — skipping.`);
        return;
      }
      entity = new Entity(pos, rot, Vector3.one, parentEntity, 'Static');

      const verts: Vector3[] = [];
      for (let i = 0; i < obj.mesh.verts.length; i += 3) {
        verts.push(new Vector3(obj.mesh.verts[i], obj.mesh.verts[i + 1], obj.mesh.verts[i + 2]));
      }
      const uvs: Vector2[] = [];
      for (let i = 0; i < obj.mesh.uvs.length; i += 2) {
        uvs.push(new Vector2(obj.mesh.uvs[i], obj.mesh.uvs[i + 1]));
      }

      entity.mesh.create(verts, uvs, [...obj.mesh.triangles]);
      entity.mesh.color.set(color, alpha);

      if (entity.mesh.nodeID) {
        entity.collider.createFromMeshNode(entity.mesh.nodeID, 'Convex');
      }

      entity.scale = scale;
      break;
    }
  }

  if (!entity) return;

  entity.customColor = color;
  entity.customAlpha = alpha;
  if (obj.shader) {
    entity.customShader = obj.shader;
    if (entity.mesh.nodeID) {
      Godot.shader.applyToMesh(entity.mesh.nodeID, obj.shader);
    }
  }

  // Wire up ray click so the object is interactive
  entity.rayClick.initialize(false);
  entity.rayClick.setClickFunction((hit) => ModelingTool.handleEntityClick(entity!, hit));
  entity.rayClick.setHeldFunction((hit) => ModelingTool.handleEntityHeld(entity!, hit));

  ModelingTool.spawnedEntities.push(entity);

  // Register in scene with the saved name (bypass auto-numbering)
  const sceneNode = SceneManager.addObjectWithName(entity, obj.name, parentSceneId);

  // Recurse children
  for (const child of obj.children) {
    spawnSerializedObject(child, entity, sceneNode.id);
  }
}

export function loadScene(fileName: string): boolean {
  try {
    const content = Files.text.get('user://worlds', '', fileName, '.json');
    if (!content) {
      console.log(`Scene file not found: ${fileName}.json`);
      return false;
    }

    const scene: SerializedScene = JSON.parse(content);

    if (scene.version !== 1) {
      console.log(`Unknown scene version: ${scene.version}`);
      return false;
    }

    // Clear existing scene (batch — no onChange per node)
    SceneManager.clearAll();
    for (const entity of [...ModelingTool.spawnedEntities]) {
      entity.destroy();
    }
    ModelingTool.spawnedEntities = [];
    ModelingTool.selectedEntity = undefined;

    // Spawn all saved objects
    for (const obj of scene.objects) {
      spawnSerializedObject(obj, undefined, undefined);
    }

    console.log(`Scene "${fileName}" loaded successfully.`);
    return true;
  } catch (e) {
    console.log(`Failed to load scene: ${e}`);
    return false;
  }
}

// ─────────────────────────────────────────────
// DISCOVERY — list saved scene files
// ─────────────────────────────────────────────

export function listSavedScenes(): string[] {
  try {
    const files = Godot.files.folder.getContents('user://worlds', false);
    return files
      .filter(f => f[2].toLowerCase() === 'json')
      .map(f => f[1]);
  } catch (e) {
    console.log(`Failed to list scenes: ${e}`);
    return [];
  }
}
