import { DirectoryBasePaths } from "../../Yuu API/files/index";
import { Texture, loadPNGToTexture } from "../../Yuu API/images/index";
import { Entity } from "../../Yuu API/Entity";
import { Vector2 } from "../../Yuu API/Basic Types/Vector2";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { spawnPrimitive } from "../../Yuu API/SpawnPrimitive";
import { SceneManager } from "./SceneManager";

export type LoadablePNG = {
  base: DirectoryBasePaths;
  sub: string;
  name: string; // e.g. 'bedrock_png'
  displayName: string; // e.g. 'bedrock.png'
};

export interface TextureSettings {
  mappingMode: 'wrap' | 'face';
  rotation: 0 | 90 | 180 | 270;
  selectedPNGName: string | undefined;
  scale: Vector2;
  offset: Vector2;
}

const entityTextureSettings = new Map<number, TextureSettings>();
export const entityBaseUVs = new Map<number, Vector2[]>();

export function getTextureSettings(entity: Entity): TextureSettings {
  if (!entity.nodeID) {
    return {
      mappingMode: 'wrap',
      rotation: 0,
      selectedPNGName: undefined,
      scale: new Vector2(1, 1),
      offset: Vector2.zero
    };
  }
  let settings = entityTextureSettings.get(entity.nodeID);
  if (!settings) {
    settings = {
      mappingMode: 'wrap',
      rotation: 0,
      selectedPNGName: undefined,
      scale: new Vector2(1, 1),
      offset: Vector2.zero
    };
    entityTextureSettings.set(entity.nodeID, settings);
  }
  return settings;
}

export function findLoadablePNGs(): LoadablePNG[] {
  const list: LoadablePNG[] = [];
  const searchBases: DirectoryBasePaths[] = ['vm', 'user://templates', 'user://worlds'];
  
  for (const base of searchBases) {
    try {
      const basePath = base === 'vm' ? Godot.files.folder.getVMPath() : base;
      const files = Godot.files.folder.getContents(basePath, true) || [];
      for (const f of files) {
        const dirPath = f[0];
        const name = f[1];
        const ext = f[2];
        if (ext.toLowerCase() === 'txt' && name.toLowerCase().endsWith('_png')) {
          let sub = '';
          if (base === 'vm') {
            sub = dirPath.substring(basePath.length);
          } else {
            sub = dirPath.substring(base.length);
          }
          
          let cleanName = name.substring(0, name.length - 4); // Remove '_png'
          list.push({
            base,
            sub,
            name,
            displayName: `${cleanName}.png`
          });
        }
      }
    } catch (e: any) {
      console.log(`Failed listing files in ${base}: ${e.message}`);
    }
  }
  return list;
}

export function applyUVTransformations(baseUVs: Vector2[], settings: TextureSettings): Vector2[] {
  const rad = (settings.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return baseUVs.map(uv => {
    // Translate to center (0.5, 0.5) for scale/rotation pivot
    let u = uv.x - 0.5;
    let v = uv.y - 0.5;

    // Apply scale (tiling)
    u *= settings.scale.x;
    v *= settings.scale.y;

    // Apply rotation
    const ru = u * cos - v * sin;
    const rv = u * sin + v * cos;

    // Translate back and apply offset
    return new Vector2(
      ru + 0.5 + settings.offset.x,
      rv + 0.5 + settings.offset.y
    );
  });
}

export function updateEntityMeshTexture(entity: Entity) {
  if (!entity || !entity.mesh) return;

  const settings = getTextureSettings(entity);
  const currentTexture = entity.mesh.texture.get();
  
  const node = SceneManager.findByEntity(entity);
  const isCube = node && node.name.startsWith('Cube_');
  
  let baseUVs: Vector2[] | undefined;

  if (isCube) {
    const baseMesh = settings.mappingMode === 'face' 
      ? spawnPrimitive.getShadeSmoothFaceUVCube()
      : spawnPrimitive.getShadeSmoothStretchedUVCube();
    baseUVs = baseMesh[1];
    const transformedUVs = applyUVTransformations(baseUVs, settings);
    entity.mesh.create(baseMesh[0], transformedUVs, baseMesh[2]);
  } else {
    // Check if we have registered base UVs for this entity
    if (entity.nodeID) {
      baseUVs = entityBaseUVs.get(entity.nodeID);
    }
    
    // If not, try to clone from the entity's existing UVs
    if (!baseUVs && entity.mesh.uvs && entity.mesh.uvs.length > 0) {
      baseUVs = entity.mesh.uvs.map(uv => new Vector2(uv.x, uv.y));
      if (entity.nodeID) {
        entityBaseUVs.set(entity.nodeID, baseUVs);
      }
    }

    if (baseUVs && baseUVs.length > 0) {
      const transformedUVs = applyUVTransformations(baseUVs, settings);
      entity.mesh.create(entity.mesh.verts, transformedUVs, entity.mesh.triangles);
    }
  }
  
  if (currentTexture) {
    entity.mesh.texture.set(currentTexture, false);
  }
}

export function applyTextureToEntity(entity: Entity, png: LoadablePNG) {
  const texture = loadPNGToTexture(png.base, png.sub, png.name);
  if (texture) {
    entity.mesh.texture.set(texture, false);
    const settings = getTextureSettings(entity);
    settings.selectedPNGName = png.name;
  }
}
