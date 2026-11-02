import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  15.999016,
  -64.000000,
  -114.000977,
  -0.000983,
  64.000000,
  -114.000977,
  -0.000983,
  64.000000,
  146.000977,
  15.999016,
  -64.000000,
  82.000977,
  15.999016,
  -64.000000,
  -114.000977,
  15.999016,
  -64.000000,
  82.000977,
  0.001000,
  -64.000000,
  82.000977,
  0.001000,
  -64.000000,
  -114.000977,
  -15.999031,
  64.000000,
  -114.000977,
  -15.999030,
  64.000000,
  146.000977,
  -15.999031,
  64.000000,
  -114.000977,
  -0.000983,
  64.000000,
  -114.000977,
  -0.000983,
  64.000000,
  146.000977,
  -15.999030,
  64.000000,
  146.000977
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  15.999016,
  -114.000977,
  64.000000,
  -0.000983,
  -114.000977,
  -64.000000,
  -0.000983,
  146.000977,
  -64.000000,
  15.999016,
  82.000977,
  64.000000,
  15.999016,
  -114.000977,
  64.000000,
  15.999016,
  82.000977,
  64.000000,
  0.001000,
  82.000977,
  64.000000,
  0.001000,
  -114.000977,
  64.000000,
  -15.999031,
  -114.000977,
  -64.000000,
  -15.999030,
  146.000977,
  -64.000000,
  -15.999031,
  -114.000977,
  -64.000000,
  -0.000983,
  -114.000977,
  -64.000000,
  -0.000983,
  146.000977,
  -64.000000,
  -15.999030,
  146.000977,
  -64.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  1.000000,
  1.000000,
  0.508959,
  1.000000,
  0.508959,
  0.000000,
  1.000000,
  0.246152,
  0.000000,
  1.000000,
  0.000000,
  0.246152,
  0.007554,
  0.246152,
  0.007554,
  1.000000,
  0.501405,
  1.000000,
  0.501405,
  0.000000,
  0.498595,
  1.000000,
  0.491042,
  1.000000,
  0.491042,
  0.000000,
  0.498595,
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
  1,
  9,
  8,
  1,
  2,
  9,
  4,
  10,
  7,
  4,
  11,
  10,
  5,
  13,
  12,
  5,
  6,
  13,
  7,
  13,
  6,
  7,
  10,
  13
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail3696536966(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3696536966Raw(): [Vector3[], Vector2[], number[]] {
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
