import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -48.000000,
  15.996582,
  -6.001770,
  -48.000000,
  0.003418,
  -6.001770,
  -48.000000,
  0.003417,
  6.003113,
  -48.000000,
  15.996582,
  14.000428,
  48.000000,
  -0.003418,
  -6.001770,
  48.000000,
  -0.003417,
  6.000427,
  48.000000,
  -15.996582,
  -1.996888,
  48.000000,
  -15.996582,
  -6.001770,
  -48.000000,
  15.996582,
  -6.001770,
  48.000000,
  -0.003418,
  -6.001770,
  48.000000,
  -15.996582,
  -6.001770,
  -48.000000,
  0.003418,
  -6.001770,
  -48.000000,
  15.996582,
  -6.001770,
  -48.000000,
  15.996582,
  14.000428,
  48.000000,
  -0.003417,
  6.000427,
  48.000000,
  -0.003418,
  -6.001770,
  -48.000000,
  0.003418,
  -6.001770,
  48.000000,
  -15.996582,
  -6.001770,
  48.000000,
  -15.996582,
  -1.996888,
  -48.000000,
  0.003417,
  6.003113,
  -48.000000,
  15.996582,
  14.000428,
  48.000000,
  -0.003417,
  6.000427
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -48.000000,
  -10.001099,
  -15.996582,
  -48.000000,
  -10.001099,
  -0.003418,
  -48.000000,
  2.003784,
  -0.003417,
  -48.000000,
  10.001099,
  -15.996582,
  48.000000,
  -10.001099,
  0.003418,
  48.000000,
  2.001098,
  0.003417,
  48.000000,
  -5.996217,
  15.996582,
  48.000000,
  -10.001099,
  15.996582,
  -48.000000,
  -10.001099,
  -15.996582,
  48.000000,
  -10.001099,
  0.003418,
  48.000000,
  -10.001099,
  15.996582,
  -48.000000,
  -10.001099,
  -0.003418,
  -48.000000,
  -10.001099,
  -15.996582,
  -48.000000,
  10.001099,
  -15.996582,
  48.000000,
  2.001098,
  0.003417,
  48.000000,
  -10.001099,
  0.003418,
  -48.000000,
  -10.001099,
  -0.003418,
  48.000000,
  -10.001099,
  15.996582,
  48.000000,
  -5.996217,
  15.996582,
  -48.000000,
  2.003784,
  -0.003417,
  -48.000000,
  10.001099,
  -15.996582,
  48.000000,
  2.001098,
  0.003417
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.752982,
  0.200026,
  0.594345,
  0.200026,
  0.594345,
  0.080949,
  0.752982,
  0.001623,
  0.594345,
  0.203272,
  0.713396,
  0.203272,
  0.634070,
  0.361910,
  0.594345,
  0.361910,
  0.434620,
  0.993067,
  0.434620,
  0.027703,
  0.591099,
  0.001623,
  0.591099,
  0.966987,
  0.232971,
  0.001623,
  0.431374,
  0.001623,
  0.352022,
  0.966987,
  0.232971,
  0.966987,
  0.229725,
  0.035625,
  0.229725,
  0.998377,
  0.212152,
  0.995758,
  0.177050,
  0.027774,
  0.001623,
  0.001623,
  0.036725,
  0.969607
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
export function getFuncDetail4276142762(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail4276142762Raw(): [Vector3[], Vector2[], number[]] {
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
