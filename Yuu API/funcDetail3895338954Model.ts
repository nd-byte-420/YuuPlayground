import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -48.000000,
  -7.999387,
  -12.000885,
  -48.000000,
  -24.000610,
  -12.000885,
  -48.000000,
  -24.000610,
  0.000458,
  -48.000004,
  -7.999387,
  8.001314,
  48.000000,
  24.000610,
  -12.000885,
  47.999996,
  24.000610,
  24.001312,
  48.000000,
  7.999387,
  16.000456,
  48.000000,
  7.999387,
  -12.000885,
  48.000000,
  24.000610,
  -12.000885,
  48.000000,
  7.999387,
  -12.000885,
  47.999996,
  24.000610,
  24.001312,
  -48.000000,
  -24.000610,
  -12.000885,
  -48.000000,
  -24.000610,
  0.000458,
  -48.000004,
  -7.999387,
  8.001314
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -48.000000,
  -12.000885,
  7.999387,
  -48.000000,
  -12.000885,
  24.000610,
  -48.000000,
  0.000458,
  24.000610,
  -48.000004,
  8.001314,
  7.999387,
  48.000000,
  -12.000885,
  -24.000610,
  47.999996,
  24.001312,
  -24.000610,
  48.000000,
  16.000456,
  -7.999387,
  48.000000,
  -12.000885,
  -7.999387,
  48.000000,
  -12.000885,
  -24.000610,
  48.000000,
  -12.000885,
  -7.999387,
  47.999996,
  24.001312,
  -24.000610,
  -48.000000,
  -12.000885,
  24.000610,
  -48.000000,
  0.000458,
  24.000610,
  -48.000004,
  8.001314,
  7.999387
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.000000,
  0.047623,
  0.000000,
  0.000000,
  0.166104,
  0.000000,
  0.276840,
  0.047623,
  0.501712,
  0.000000,
  1.000000,
  0.000000,
  0.889264,
  0.047623,
  0.501712,
  0.047623,
  0.000000,
  1.000000,
  0.000000,
  0.952377,
  0.498288,
  1.000000,
  0.501712,
  1.000000,
  0.667817,
  1.000000,
  0.778552,
  0.952377
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
export function getFuncDetail3895338954(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3895338954Raw(): [Vector3[], Vector2[], number[]] {
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
