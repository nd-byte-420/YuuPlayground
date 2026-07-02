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
}

const entityTextureSettings = new Map<number, TextureSettings>();

export function getTextureSettings(entity: Entity): TextureSettings {
  if (!entity.nodeID) {
    return { mappingMode: 'wrap', rotation: 0, selectedPNGName: undefined };
  }
  let settings = entityTextureSettings.get(entity.nodeID);
  if (!settings) {
    settings = { mappingMode: 'wrap', rotation: 0, selectedPNGName: undefined };
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

export function getRotatedUVs(baseUVs: Vector2[], rotationAngle: 0 | 90 | 180 | 270): Vector2[] {
  if (rotationAngle === 0) {
    return baseUVs;
  }
  
  const rotated = baseUVs.map(uv => new Vector2(uv.x, uv.y));
  const numFaces = Math.floor(baseUVs.length / 4);
  const steps = rotationAngle / 90;
  
  for (let step = 0; step < steps; step++) {
    for (let face = 0; face < numFaces; face++) {
      const idxs = [4 * face, 4 * face + 1, 4 * face + 2, 4 * face + 3];
      
      // Calculate center of this face's UVs
      let sumX = 0;
      let sumY = 0;
      for (const i of idxs) {
        sumX += rotated[i].x;
        sumY += rotated[i].y;
      }
      const centerX = sumX / 4;
      const centerY = sumY / 4;
      
      // Rotate 90 deg CW
      const orig = idxs.map(i => new Vector2(rotated[i].x, rotated[i].y));
      for (let k = 0; k < 4; k++) {
        const i = idxs[k];
        const u = orig[k].x;
        const v = orig[k].y;
        rotated[i].x = centerX - (v - centerY);
        rotated[i].y = centerY + (u - centerX);
      }
    }
  }
  
  return rotated;
}

export function updateEntityMeshTexture(entity: Entity) {
  if (!entity || !entity.mesh) return;

  const settings = getTextureSettings(entity);
  const currentTexture = entity.mesh.texture.get();
  
  const node = SceneManager.findByEntity(entity);
  const isCube = node && node.name.startsWith('Cube_');
  
  if (isCube) {
    const baseMesh = settings.mappingMode === 'face' 
      ? spawnPrimitive.getShadeSmoothFaceUVCube()
      : spawnPrimitive.getShadeSmoothStretchedUVCube();
      
    const rotatedUVs = getRotatedUVs(baseMesh[1], settings.rotation);
    entity.mesh.create(baseMesh[0], rotatedUVs, baseMesh[2]);
  } else {
    const existingUVs = entity.mesh.uvs;
    if (existingUVs && existingUVs.length > 0 && existingUVs.length % 4 === 0) {
      const rotatedUVs = getRotatedUVs(existingUVs, settings.rotation);
      entity.mesh.create(entity.mesh.verts, rotatedUVs, entity.mesh.triangles);
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
