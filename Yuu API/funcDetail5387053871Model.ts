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
  16.000023,
  128.000000,
  192.000000,
  -0.000008,
  0.000009,
  192.000000,
  -0.000008,
  -127.999992,
  -192.000000,
  -0.000009,
  -0.000004,
  -192.000000,
  -16.000008,
  -127.999992,
  -192.000000,
  -16.000008,
  0.000009,
  192.000000,
  -0.000007,
  128.000000,
  192.000000,
  16.000021,
  -0.000004,
  -192.000000,
  -0.000009,
  -0.000004,
  -192.000000,
  -0.000007,
  128.000000,
  192.000000,
  16.000023,
  128.000000,
  192.000000,
  -0.000008,
  -127.999992,
  -192.000000,
  -0.000008,
  0.000009,
  192.000000,
  -16.000008,
  0.000009,
  192.000000,
  -16.000008,
  -127.999992,
  -192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  16.000013,
  -192.000000,
  0.000008,
  -0.000015,
  -192.000000,
  127.999996,
  -16.000015,
  -192.000000,
  127.999996,
  -0.000016,
  -192.000000,
  0.000008,
  16.000015,
  192.000000,
  -127.999996,
  -0.000014,
  192.000000,
  -127.999996,
  -16.000015,
  192.000000,
  -0.000005,
  -0.000015,
  192.000000,
  -0.000005,
  16.000013,
  -192.000000,
  0.000008,
  16.000015,
  192.000000,
  -127.999996,
  -0.000015,
  192.000000,
  -0.000005,
  -0.000015,
  -192.000000,
  127.999996,
  -0.000016,
  -192.000000,
  0.000008,
  -16.000015,
  -192.000000,
  127.999996,
  -16.000015,
  192.000000,
  -0.000005,
  -0.000014,
  192.000000,
  -127.999996,
  16.000013,
  -192.000000,
  0.000008,
  -0.000016,
  -192.000000,
  0.000008,
  -0.000014,
  192.000000,
  -127.999996,
  16.000015,
  192.000000,
  -127.999996,
  -0.000015,
  -192.000000,
  127.999996,
  -0.000015,
  192.000000,
  -0.000005,
  -16.000015,
  192.000000,
  -0.000005,
  -16.000015,
  -192.000000,
  127.999996
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.634527,
  0.591284,
  0.634527,
  0.302500,
  0.670070,
  0.298057,
  0.670070,
  0.586841,
  0.670069,
  0.294837,
  0.634527,
  0.290394,
  0.634527,
  0.001610,
  0.670069,
  0.006053,
  0.279029,
  0.907774,
  0.279029,
  0.001610,
  0.553228,
  0.092226,
  0.553228,
  0.998390,
  0.275809,
  0.907774,
  0.001610,
  0.998390,
  0.001610,
  0.092226,
  0.275809,
  0.001610,
  0.592267,
  0.907774,
  0.556448,
  0.907774,
  0.556448,
  0.001610,
  0.592267,
  0.001610,
  0.595487,
  0.907774,
  0.595487,
  0.001610,
  0.631307,
  0.001610,
  0.631307,
  0.907774
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
  22,
  21,
  20,
  23,
  22
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
