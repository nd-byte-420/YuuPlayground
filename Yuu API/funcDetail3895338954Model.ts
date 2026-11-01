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
  -48.000000,
  -7.999387,
  -12.000885,
  48.000000,
  24.000610,
  -12.000885,
  48.000000,
  7.999387,
  -12.000885,
  -48.000000,
  -24.000610,
  -12.000885,
  -48.000000,
  -7.999387,
  -12.000885,
  -48.000004,
  -7.999387,
  8.001314,
  47.999996,
  24.000610,
  24.001312,
  48.000000,
  24.000610,
  -12.000885,
  -48.000000,
  -24.000610,
  -12.000885,
  48.000000,
  7.999387,
  -12.000885,
  48.000000,
  7.999387,
  16.000456,
  -48.000000,
  -24.000610,
  0.000458,
  -48.000004,
  -7.999387,
  8.001314,
  47.999996,
  24.000610,
  24.001312
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -47.999998,
  -18.001099,
  7.999387,
  -47.999998,
  -18.001099,
  24.000610,
  -47.999998,
  -5.999756,
  24.000610,
  -48.000002,
  2.001101,
  7.999387,
  48.000002,
  -18.001099,
  -24.000610,
  47.999998,
  18.001099,
  -24.000610,
  48.000002,
  10.000242,
  -7.999387,
  48.000002,
  -18.001099,
  -7.999387,
  -47.999998,
  -18.001099,
  7.999387,
  48.000002,
  -18.001099,
  -24.000610,
  48.000002,
  -18.001099,
  -7.999387,
  -47.999998,
  -18.001099,
  24.000610,
  -47.999998,
  -18.001099,
  7.999387,
  -48.000002,
  2.001101,
  7.999387,
  47.999998,
  18.001099,
  -24.000610,
  48.000002,
  -18.001099,
  -24.000610,
  -47.999998,
  -18.001099,
  24.000610,
  48.000002,
  -18.001099,
  -7.999387,
  48.000002,
  10.000242,
  -7.999387,
  -47.999998,
  -5.999756,
  24.000610,
  -48.000002,
  2.001101,
  7.999387,
  47.999998,
  18.001099,
  -24.000610
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.245982,
  0.877891,
  0.125609,
  0.877891,
  0.125609,
  0.787608,
  0.245982,
  0.727419,
  0.001745,
  0.998255,
  0.001745,
  0.727419,
  0.122118,
  0.787608,
  0.122118,
  0.998255,
  0.242473,
  0.723929,
  0.001745,
  0.001745,
  0.122118,
  0.001745,
  0.362846,
  0.723929,
  0.640662,
  0.001745,
  0.791134,
  0.001745,
  0.911498,
  0.762994,
  0.640662,
  0.762994,
  0.366337,
  0.801059,
  0.366337,
  0.039810,
  0.576984,
  0.039810,
  0.456620,
  0.801059,
  0.516808,
  0.762994,
  0.637172,
  0.001745
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
  8,
  10,
  9,
  8,
  11,
  10,
  12,
  14,
  13,
  12,
  15,
  14,
  16,
  18,
  17,
  16,
  19,
  18,
  20,
  18,
  19,
  20,
  21,
  18
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
