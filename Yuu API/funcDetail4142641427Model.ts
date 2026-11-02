import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -16.000021,
  128.000000,
  192.000000,
  0.000009,
  -0.000003,
  192.000000,
  16.000008,
  -0.000003,
  192.000000,
  0.000005,
  128.000000,
  192.000000,
  -16.000021,
  -0.000002,
  -192.000000,
  0.000009,
  -128.000000,
  -192.000000,
  0.000005,
  128.000000,
  192.000000,
  16.000008,
  -0.000003,
  192.000000,
  16.000008,
  -128.000000,
  -192.000000,
  0.000007,
  -0.000002,
  -192.000000,
  -16.000021,
  128.000000,
  192.000000,
  -16.000021,
  -0.000002,
  -192.000000,
  16.000008,
  -128.000000,
  -192.000000,
  0.000009,
  -128.000000,
  -192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -16.000021,
  192.000000,
  -128.000000,
  0.000009,
  192.000000,
  0.000003,
  16.000008,
  192.000000,
  0.000003,
  0.000005,
  192.000000,
  -128.000000,
  -16.000021,
  -192.000000,
  0.000002,
  0.000009,
  -192.000000,
  128.000000,
  0.000005,
  192.000000,
  -128.000000,
  16.000008,
  192.000000,
  0.000003,
  16.000008,
  -192.000000,
  128.000000,
  0.000007,
  -192.000000,
  0.000002,
  -16.000021,
  192.000000,
  -128.000000,
  -16.000021,
  -192.000000,
  0.000002,
  16.000008,
  -192.000000,
  128.000000,
  0.000009,
  -192.000000,
  128.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.498117,
  0.000000,
  0.008358,
  0.090909,
  0.000000,
  0.090909,
  0.489759,
  0.000000,
  0.498116,
  0.909091,
  0.008358,
  1.000000,
  0.510241,
  0.000000,
  1.000000,
  0.090909,
  1.000000,
  1.000000,
  0.510241,
  0.909091,
  0.501884,
  0.000000,
  0.501884,
  0.909091,
  0.000000,
  1.000000,
  0.991642,
  1.000000
];

// Triangle indices
const triangles = [
  0,
  2,
  1,
  0,
  3,
  2,
  0,
  5,
  4,
  0,
  1,
  5,
  6,
  8,
  7,
  6,
  9,
  8,
  10,
  9,
  6,
  10,
  11,
  9,
  1,
  12,
  5,
  1,
  2,
  12,
  11,
  8,
  9,
  11,
  13,
  8
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail4142641427(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail4142641427Raw(): [Vector3[], Vector2[], number[]] {
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
