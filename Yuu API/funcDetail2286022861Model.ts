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
  16.002090,
  48.000000,
  -54.000977,
  31.997910,
  48.000000,
  -54.000977,
  -16.002090,
  -48.000000,
  30.000980,
  31.997910,
  48.000000,
  78.000977,
  16.002090,
  48.000000,
  78.000977,
  -31.997910,
  -48.000000,
  30.000980,
  31.997910,
  48.000000,
  -54.000977,
  31.997910,
  48.000000,
  78.000977,
  -31.997906,
  -48.000000,
  -54.000977,
  -31.997910,
  -48.000000,
  30.000980
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -16.002090,
  -66.000977,
  48.000000,
  -16.002090,
  18.000980,
  48.000000,
  -31.997910,
  18.000980,
  48.000000,
  -31.997906,
  -66.000977,
  48.000000,
  31.997910,
  -66.000977,
  -48.000000,
  16.002090,
  -66.000977,
  -48.000000,
  16.002090,
  66.000977,
  -48.000000,
  31.997910,
  66.000977,
  -48.000000,
  -16.002090,
  -66.000977,
  48.000000,
  -31.997906,
  -66.000977,
  48.000000,
  16.002090,
  -66.000977,
  -48.000000,
  31.997910,
  -66.000977,
  -48.000000,
  -16.002090,
  18.000980,
  48.000000,
  31.997910,
  66.000977,
  -48.000000,
  16.002090,
  66.000977,
  -48.000000,
  -31.997910,
  18.000980,
  48.000000,
  31.997910,
  -66.000977,
  -48.000000,
  31.997910,
  66.000977,
  -48.000000,
  -31.997906,
  -66.000977,
  48.000000,
  -31.997910,
  18.000980,
  48.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.438454,
  0.538927,
  0.438454,
  0.196823,
  0.467587,
  0.196823,
  0.467587,
  0.538927,
  0.936513,
  0.538927,
  0.907380,
  0.538927,
  0.907380,
  0.001339,
  0.936513,
  0.001339,
  0.939192,
  0.538581,
  0.997459,
  0.509448,
  0.997459,
  0.946562,
  0.939192,
  0.975695,
  0.939192,
  0.480174,
  0.939192,
  0.001339,
  0.998660,
  0.027934,
  0.998660,
  0.506769,
  0.001339,
  0.538927,
  0.001339,
  0.001339,
  0.470266,
  0.538927,
  0.470266,
  0.196823
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
  17,
  16,
  0,
  1,
  17,
  18,
  6,
  19,
  18,
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
