import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  31.999086,
  -48.000000,
  -54.000977,
  -16.000916,
  48.000000,
  -54.000977,
  -16.000916,
  48.000000,
  78.000977,
  31.999086,
  -48.000000,
  30.000973,
  31.999086,
  -48.000000,
  -54.000977,
  31.999086,
  -48.000000,
  30.000973,
  16.000881,
  -48.000000,
  30.000973,
  16.000881,
  -48.000004,
  -54.000977,
  -31.999052,
  48.000004,
  -54.000977,
  -31.999052,
  48.000000,
  78.000977,
  31.999086,
  -48.000000,
  -54.000977,
  16.000881,
  -48.000004,
  -54.000977,
  -31.999052,
  48.000004,
  -54.000977,
  -16.000916,
  48.000000,
  -54.000977,
  -16.000916,
  48.000000,
  78.000977,
  -31.999052,
  48.000000,
  78.000977,
  16.000881,
  -48.000004,
  -54.000977,
  16.000881,
  -48.000000,
  30.000973,
  -31.999052,
  48.000000,
  78.000977,
  -31.999052,
  48.000004,
  -54.000977
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  31.999069,
  -66.000977,
  48.000000,
  -16.000933,
  -66.000977,
  -48.000000,
  -16.000933,
  66.000977,
  -48.000000,
  31.999069,
  18.000973,
  48.000000,
  31.999069,
  -66.000977,
  48.000000,
  31.999069,
  18.000973,
  48.000000,
  16.000864,
  18.000973,
  48.000000,
  16.000864,
  -66.000977,
  48.000004,
  -31.999069,
  -66.000977,
  -48.000004,
  -31.999069,
  66.000977,
  -48.000000,
  31.999069,
  -66.000977,
  48.000000,
  16.000864,
  -66.000977,
  48.000004,
  -31.999069,
  -66.000977,
  -48.000004,
  -16.000933,
  -66.000977,
  -48.000000,
  -16.000933,
  66.000977,
  -48.000000,
  -31.999069,
  66.000977,
  -48.000000,
  16.000864,
  -66.000977,
  48.000004,
  16.000864,
  18.000973,
  48.000000,
  -31.999069,
  66.000977,
  -48.000000,
  -31.999069,
  -66.000977,
  -48.000004
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.457681,
  0.527493,
  0.029901,
  0.527493,
  0.029901,
  0.001386,
  0.457681,
  0.192695,
  0.938086,
  0.629805,
  0.891003,
  0.487674,
  0.951531,
  0.467624,
  0.998614,
  0.609754,
  0.001386,
  0.527493,
  0.001386,
  0.001386,
  0.001386,
  0.530264,
  0.058417,
  0.558780,
  0.058416,
  0.986560,
  0.001386,
  0.958044,
  0.938087,
  0.021437,
  0.998614,
  0.001386,
  0.460452,
  0.527493,
  0.460452,
  0.192695,
  0.888232,
  0.001386,
  0.888232,
  0.527493
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
  1,
  9,
  8,
  1,
  2,
  9,
  10,
  12,
  11,
  10,
  13,
  12,
  5,
  15,
  14,
  5,
  6,
  15,
  16,
  18,
  17,
  16,
  19,
  18
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail4556745568(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail4556745568Raw(): [Vector3[], Vector2[], number[]] {
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
