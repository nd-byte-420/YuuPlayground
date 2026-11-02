import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -16.002090,
  -48.000000,
  -54.000977,
  -16.002090,
  -48.000000,
  30.000980,
  -31.997910,
  -48.000000,
  30.000980,
  -31.997906,
  -48.000000,
  -54.000977,
  31.997910,
  48.000000,
  -54.000977,
  16.002090,
  48.000000,
  -54.000977,
  16.002090,
  48.000000,
  78.000977,
  31.997910,
  48.000000,
  78.000977,
  -16.002090,
  -48.000000,
  -54.000977,
  -31.997906,
  -48.000000,
  -54.000977,
  31.997910,
  48.000000,
  78.000977,
  16.002090,
  48.000000,
  78.000977,
  31.997910,
  48.000000,
  -54.000977,
  -31.997910,
  -48.000000,
  30.000980
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -16.002090,
  -54.000977,
  48.000000,
  -16.002090,
  30.000980,
  48.000000,
  -31.997910,
  30.000980,
  48.000000,
  -31.997906,
  -54.000977,
  48.000000,
  31.997910,
  -54.000977,
  -48.000000,
  16.002090,
  -54.000977,
  -48.000000,
  16.002090,
  78.000977,
  -48.000000,
  31.997910,
  78.000977,
  -48.000000,
  -16.002090,
  -54.000977,
  48.000000,
  -31.997906,
  -54.000977,
  48.000000,
  31.997910,
  78.000977,
  -48.000000,
  16.002090,
  78.000977,
  -48.000000,
  31.997910,
  -54.000977,
  -48.000000,
  -31.997910,
  30.000980,
  48.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.467753,
  1.000000,
  0.467753,
  0.363631,
  0.498929,
  0.363631,
  0.498929,
  1.000000,
  1.000000,
  1.000000,
  0.968825,
  1.000000,
  0.968825,
  0.000000,
  1.000000,
  0.000000,
  0.532247,
  1.000000,
  0.501072,
  1.000000,
  0.000000,
  0.000000,
  0.031175,
  0.000000,
  0.000000,
  1.000000,
  0.501072,
  0.363631
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
  5,
  9,
  8,
  4,
  5,
  1,
  11,
  10,
  1,
  2,
  11,
  0,
  10,
  12,
  0,
  1,
  10,
  9,
  6,
  13,
  9,
  5,
  6
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail2286022861(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail2286022861Raw(): [Vector3[], Vector2[], number[]] {
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
