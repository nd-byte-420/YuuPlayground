import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  35.999054,
  -28.001219,
  -33.001247,
  35.999054,
  -28.001219,
  19.000677,
  35.999054,
  -43.996826,
  11.002894,
  35.999054,
  -43.996834,
  -33.001244,
  -28.001131,
  35.999023,
  -33.001247,
  -43.996979,
  35.999023,
  -33.001247,
  -43.996983,
  35.999027,
  51.000706,
  -28.001133,
  35.999027,
  51.000713,
  35.999054,
  -28.001219,
  -33.001247,
  35.999054,
  -43.996834,
  -33.001244,
  -43.996979,
  35.999023,
  -33.001247,
  -28.001131,
  35.999023,
  -33.001247,
  35.999054,
  -28.001219,
  19.000677,
  -28.001133,
  35.999027,
  51.000713,
  -43.996983,
  35.999027,
  51.000706,
  35.999054,
  -43.996826,
  11.002894
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  35.999054,
  -33.001247,
  28.001219,
  35.999054,
  19.000677,
  28.001219,
  35.999054,
  11.002894,
  43.996826,
  35.999054,
  -33.001244,
  43.996834,
  -28.001131,
  -33.001247,
  -35.999023,
  -43.996979,
  -33.001247,
  -35.999023,
  -43.996983,
  51.000706,
  -35.999027,
  -28.001133,
  51.000713,
  -35.999027,
  35.999054,
  -33.001247,
  28.001219,
  35.999054,
  -33.001244,
  43.996834,
  -43.996979,
  -33.001247,
  -35.999023,
  -28.001131,
  -33.001247,
  -35.999023,
  35.999054,
  19.000677,
  28.001219,
  -28.001133,
  51.000713,
  -35.999027,
  -43.996983,
  51.000706,
  -35.999027,
  35.999054,
  11.002894,
  43.996826
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.501136,
  0.793252,
  0.809961,
  0.793252,
  0.762464,
  0.923879,
  0.501136,
  0.923879,
  0.501135,
  0.054108,
  0.501135,
  0.000000,
  1.000000,
  0.000000,
  1.000000,
  0.054108,
  0.000000,
  0.099978,
  0.000000,
  0.000000,
  0.000000,
  1.000000,
  0.000000,
  0.900021,
  0.308825,
  0.099977,
  0.498865,
  0.900021,
  0.498865,
  1.000000,
  0.261328,
  0.000000
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
  0,
  7,
  4,
  0,
  1,
  7,
  9,
  14,
  15,
  9,
  10,
  14
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail3904839049(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3904839049Raw(): [Vector3[], Vector2[], number[]] {
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
