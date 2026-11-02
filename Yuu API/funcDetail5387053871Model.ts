import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  16.000021,
  -0.000004,
  -192.000000,
  -0.000008,
  -127.999992,
  -192.000000,
  -16.000008,
  -127.999992,
  -192.000000,
  -0.000009,
  -0.000004,
  -192.000000,
  16.000023,
  128.000000,
  192.000000,
  -0.000007,
  128.000000,
  192.000000,
  -16.000008,
  0.000009,
  192.000000,
  -0.000008,
  0.000009,
  192.000000,
  16.000021,
  -0.000004,
  -192.000000,
  -0.000008,
  -127.999992,
  -192.000000,
  -16.000008,
  0.000009,
  192.000000,
  -0.000007,
  128.000000,
  192.000000,
  16.000023,
  128.000000,
  192.000000,
  -16.000008,
  -127.999992,
  -192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  16.000021,
  -192.000000,
  0.000004,
  -0.000008,
  -192.000000,
  127.999992,
  -16.000008,
  -192.000000,
  127.999992,
  -0.000009,
  -192.000000,
  0.000004,
  16.000023,
  192.000000,
  -128.000000,
  -0.000007,
  192.000000,
  -128.000000,
  -16.000008,
  192.000000,
  -0.000009,
  -0.000008,
  192.000000,
  -0.000009,
  16.000021,
  -192.000000,
  0.000004,
  -0.000008,
  -192.000000,
  127.999992,
  -16.000008,
  192.000000,
  -0.000009,
  -0.000007,
  192.000000,
  -128.000000,
  16.000023,
  192.000000,
  -128.000000,
  -16.000008,
  -192.000000,
  127.999992
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  1.000000,
  0.909091,
  0.510241,
  1.000000,
  0.501884,
  1.000000,
  0.991642,
  0.909091,
  0.000000,
  0.000000,
  0.008358,
  0.000000,
  0.498117,
  0.090909,
  0.489759,
  0.090909,
  0.000000,
  0.909091,
  0.489759,
  1.000000,
  0.501884,
  0.090909,
  0.991642,
  0.000000,
  1.000000,
  0.000000,
  0.498117,
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
  4,
  6,
  5,
  4,
  7,
  6,
  8,
  7,
  4,
  8,
  9,
  7,
  3,
  10,
  2,
  3,
  11,
  10,
  0,
  11,
  3,
  0,
  12,
  11,
  9,
  6,
  7,
  9,
  13,
  6
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail5387053871(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail5387053871Raw(): [Vector3[], Vector2[], number[]] {
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
