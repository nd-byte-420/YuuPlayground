import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -32.000000,
  -8.000976,
  -20.001284,
  -32.000000,
  -23.999025,
  -20.001284,
  -32.000000,
  -23.999023,
  8.001770,
  -32.000000,
  -8.000975,
  16.000795,
  32.000000,
  23.999023,
  -20.001284,
  32.000000,
  23.999027,
  32.000797,
  32.000000,
  8.000976,
  24.001770,
  32.000000,
  8.000976,
  -20.001284,
  32.000000,
  23.999023,
  -20.001284,
  32.000000,
  8.000976,
  -20.001284,
  32.000000,
  23.999027,
  32.000797,
  -32.000000,
  -23.999025,
  -20.001284,
  -32.000000,
  -23.999023,
  8.001770,
  -32.000000,
  -8.000975,
  16.000795
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -32.000000,
  -20.001284,
  8.000976,
  -32.000000,
  -20.001284,
  23.999025,
  -32.000000,
  8.001770,
  23.999023,
  -32.000000,
  16.000795,
  8.000975,
  32.000000,
  -20.001284,
  -23.999023,
  32.000000,
  32.000797,
  -23.999027,
  32.000000,
  24.001770,
  -8.000976,
  32.000000,
  -20.001284,
  -8.000976,
  32.000000,
  -20.001284,
  -23.999023,
  32.000000,
  -20.001284,
  -8.000976,
  32.000000,
  32.000797,
  -23.999027,
  -32.000000,
  -20.001284,
  23.999025,
  -32.000000,
  8.001770,
  23.999023,
  -32.000000,
  16.000795,
  8.000975
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.000000,
  0.090899,
  0.000000,
  0.000000,
  0.268588,
  0.000000,
  0.345310,
  0.090899,
  0.501227,
  0.000000,
  1.000000,
  0.000000,
  0.923278,
  0.090899,
  0.501227,
  0.090899,
  0.000000,
  1.000000,
  0.000000,
  0.909101,
  0.498773,
  1.000000,
  0.501227,
  1.000000,
  0.769816,
  1.000000,
  0.846538,
  0.909101
];

// Triangle indices
const triangles = [
  0,
  2,
  1,
  0,
  3,
  2,
  4,
  6,
  5,
  4,
  7,
  6,
  0,
  9,
  8,
  0,
  1,
  9,
  0,
  10,
  3,
  0,
  8,
  10,
  11,
  6,
  7,
  11,
  12,
  6,
  13,
  6,
  12,
  13,
  5,
  6
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail4804948050(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail4804948050Raw(): [Vector3[], Vector2[], number[]] {
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
