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
  mappingMode: 'wrap' | 'face' | 'planar-x' | 'planar-y' | 'planar-z' | 'triplanar' | 'spherical' | 'cylindrical';
  rotation: number;
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

export function getMeshBoundingInfo(verts: Vector3[]): { center: Vector3; size: Vector3 } {
  if (verts.length === 0) {
    return { center: Vector3.zero, size: Vector3.one };
  }
  let minX = verts[0].x, maxX = verts[0].x;
  let minY = verts[0].y, maxY = verts[0].y;
  let minZ = verts[0].z, maxZ = verts[0].z;

  for (const v of verts) {
    if (v.x < minX) minX = v.x;
    if (v.x > maxX) maxX = v.x;
    if (v.y < minY) minY = v.y;
    if (v.y > maxY) maxY = v.y;
    if (v.z < minZ) minZ = v.z;
    if (v.z > maxZ) maxZ = v.z;
  }

  const center = new Vector3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
  const size = new Vector3(
    Math.max(0.001, maxX - minX),
    Math.max(0.001, maxY - minY),
    Math.max(0.001, maxZ - minZ)
  );
  return { center, size };
}

export function computeVertexNormals(verts: Vector3[], triangles: number[]): Vector3[] {
  const normals = verts.map(() => new Vector3(0, 0, 0));
  
  for (let i = 0; i < triangles.length; i += 3) {
    const idx0 = triangles[i];
    const idx1 = triangles[i + 1];
    const idx2 = triangles[i + 2];
    
    if (verts[idx0] && verts[idx1] && verts[idx2]) {
      const v0 = verts[idx0];
      const v1 = verts[idx1];
      const v2 = verts[idx2];
      
      const edge1 = v1.subtract(v0);
      const edge2 = v2.subtract(v0);
      
      const faceNormal = new Vector3(
        edge1.y * edge2.z - edge1.z * edge2.y,
        edge1.z * edge2.x - edge1.x * edge2.z,
        edge1.x * edge2.y - edge1.y * edge2.x
      ).normalize();
      
      normals[idx0] = normals[idx0].add(faceNormal);
      normals[idx1] = normals[idx1].add(faceNormal);
      normals[idx2] = normals[idx2].add(faceNormal);
    }
  }
  
  return normals.map(n => n.normalize());
}

export function generateProjectedUVs(entity: Entity, mode: string): Vector2[] {
  const verts = entity.mesh.verts;
  const triangles = entity.mesh.triangles;
  if (verts.length === 0) return [];

  const { center, size } = getMeshBoundingInfo(verts);
  let normals: Vector3[] = [];
  if (mode === 'triplanar') {
    normals = computeVertexNormals(verts, triangles);
  }

  return verts.map((v, i) => {
    let u = 0.5;
    let vCoord = 0.5;

    if (mode === 'planar-x') {
      u = (v.z - center.z) / size.z + 0.5;
      vCoord = (v.y - center.y) / size.y + 0.5;
    } else if (mode === 'planar-y') {
      u = (v.x - center.x) / size.x + 0.5;
      vCoord = (v.z - center.z) / size.z + 0.5;
    } else if (mode === 'planar-z') {
      u = (v.x - center.x) / size.x + 0.5;
      vCoord = (v.y - center.y) / size.y + 0.5;
    } else if (mode === 'spherical') {
      const dir = v.subtract(center).normalize();
      u = 0.5 + Math.atan2(dir.z, dir.x) / (2 * Math.PI);
      vCoord = 0.5 - Math.asin(dir.y) / Math.PI;
    } else if (mode === 'cylindrical') {
      const dir = v.subtract(center);
      u = 0.5 + Math.atan2(dir.z, dir.x) / (2 * Math.PI);
      vCoord = (dir.y / size.y) + 0.5;
    } else if (mode === 'triplanar') {
      const n = normals[i] || Vector3.up;
      const absN = new Vector3(Math.abs(n.x), Math.abs(n.y), Math.abs(n.z));
      const total = absN.x + absN.y + absN.z || 1.0;
      const w = new Vector3(absN.x / total, absN.y / total, absN.z / total);

      const uvX = new Vector2(v.z / size.z, v.y / size.y);
      const uvY = new Vector2(v.x / size.x, v.z / size.z);
      const uvZ = new Vector2(v.x / size.x, v.y / size.y);

      const finalUV = uvX.multiply(w.x).add(uvY.multiply(w.y)).add(uvZ.multiply(w.z));
      u = finalUV.x + 0.5;
      vCoord = finalUV.y + 0.5;
    }

    return new Vector2(u, vCoord);
  });
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
  const isProjMode = settings.mappingMode !== 'wrap' && settings.mappingMode !== 'face';

  if (isProjMode) {
    baseUVs = generateProjectedUVs(entity, settings.mappingMode);
    const transformedUVs = applyUVTransformations(baseUVs, settings);
    entity.mesh.create(entity.mesh.verts, transformedUVs, entity.mesh.triangles);
  } else if (isCube) {
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
