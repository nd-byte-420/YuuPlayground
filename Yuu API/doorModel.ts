import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  1.000000,
  1.000000,
  1.000000,
  -1.000000,
  1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  1.000000,
  -1.000000,
  1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  -1.000000,
  -1.000000,
  -1.000000,
  -1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  1.000000,
  1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  1.000000,
  1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  1.000000,
  -1.000000,
  1.000000,
  1.000000,
  1.000000,
  1.000000,
  -1.000000,
  1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  1.000000,
  1.000000,
  1.000000,
  1.000000,
  -1.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  1.000000,
  1.000000,
  1.000000,
  1.000000,
  1.000000,
  -1.000000,
  1.000000,
  1.000000,
  1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  1.000000,
  1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  -1.000000,
  -1.000000,
  -1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  1.000000,
  1.000000,
  -1.000000,
  -1.000000,
  1.000000,
  1.000000,
  -1.000000,
  1.000000,
  1.000000,
  1.000000,
  1.000000,
  -1.000000,
  1.000000,
  1.000000,
  1.000000,
  -1.000000,
  1.000000,
  -1.000000,
  -1.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.000000,
  0.000000,
  1.000000,
  0.000000,
  1.000000,
  1.000000,
  0.000000,
  1.000000,
  0.000000,
  0.000000,
  1.000000,
  0.000000,
  0.000000,
  1.000000,
  0.000000,
  0.000000,
  1.000000,
  0.000000,
  1.000000,
  1.000000,
  0.000000,
  1.000000,
  0.000000,
  0.000000,
  1.000000,
  0.000000,
  1.000000,
  1.000000,
  0.000000,
  0.000000,
  1.000000,
  0.000000,
  1.000000,
  1.000000,
  0.000000,
  1.000000,
  1.000000,
  1.000000,
  0.000000,
  1.000000
];

// Triangle indices
const triangles = [
  0,
  1,
  2,
  0,
  2,
  3,
  4,
  5,
  2,
  4,
  2,
  6,
  7,
  8,
  9,
  7,
  9,
  10,
  11,
  12,
  13,
  11,
  13,
  6,
  14,
  15,
  16,
  14,
  16,
  17,
  11,
  1,
  18,
  11,
  18,
  19
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getDoor(): [Vector3[], Vector2[], number[]] {
  if (!cachedModel) {
    const verts: Vector3[] = [];
    for (let i = 0; i < transformedVerts.length; i += 3) {
      verts.push(new Vector3(transformedVerts[i], transformedVerts[i + 1], transformedVerts[i + 2]));
    }
    
    const uvs: Vector2[] = [];
    for (let i = 0; i < rawUvs.length; i += 2) {
      uvs.push(new Vector2(rawUvs[i], rawUvs[i + 1]));
    }
    
    cachedModel = [verts, uvs, triangles];
  }
  return cachedModel;
}

/**
 * Returns the raw parsed model data [Vector3[], Vector2[], number[]]
 * as stored originally in the FBX file.
 */
export function getDoorRaw(): [Vector3[], Vector2[], number[]] {
  if (!cachedRawModel) {
    const verts: Vector3[] = [];
    for (let i = 0; i < rawVerts.length; i += 3) {
      verts.push(new Vector3(rawVerts[i], rawVerts[i + 1], rawVerts[i + 2]));
    }
    
    const uvs: Vector2[] = [];
    for (let i = 0; i < rawUvs.length; i += 2) {
      uvs.push(new Vector2(rawUvs[i], rawUvs[i + 1]));
    }
    
    cachedRawModel = [verts, uvs, triangles];
  }
  return cachedRawModel;
}
