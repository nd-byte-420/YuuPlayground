import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -15.998314,
  -64.000000,
  -114.000977,
  -15.998314,
  -64.000000,
  82.000977,
  0.001687,
  64.000000,
  146.000977,
  0.001687,
  64.000000,
  -114.000977,
  -15.998314,
  -64.000000,
  -114.000977,
  -0.001702,
  -64.000000,
  -114.000977,
  -0.001701,
  -64.000000,
  82.000977,
  -15.998314,
  -64.000000,
  82.000977,
  15.998328,
  64.000000,
  146.000977,
  15.998329,
  64.000000,
  -114.000977,
  -0.001702,
  -64.000000,
  -114.000977,
  15.998328,
  64.000000,
  146.000977,
  0.001687,
  64.000000,
  146.000977,
  15.998329,
  64.000000,
  -114.000977
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -15.998314,
  -114.000977,
  64.000000,
  -15.998314,
  82.000977,
  64.000000,
  0.001687,
  146.000977,
  -64.000000,
  0.001687,
  -114.000977,
  -64.000000,
  -15.998314,
  -114.000977,
  64.000000,
  -0.001702,
  -114.000977,
  64.000000,
  -0.001701,
  82.000977,
  64.000000,
  -15.998314,
  82.000977,
  64.000000,
  15.998328,
  146.000977,
  -64.000000,
  15.998329,
  -114.000977,
  -64.000000,
  -0.001702,
  -114.000977,
  64.000000,
  15.998328,
  146.000977,
  -64.000000,
  0.001687,
  146.000977,
  -64.000000,
  15.998329,
  -114.000977,
  -64.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.501405,
  1.000000,
  0.501405,
  0.246152,
  0.992447,
  0.000000,
  0.992447,
  1.000000,
  0.498595,
  1.000000,
  0.491042,
  1.000000,
  0.491042,
  0.246152,
  0.498595,
  0.246152,
  1.000000,
  0.000000,
  1.000000,
  1.000000,
  0.508958,
  1.000000,
  0.000000,
  0.000000,
  0.007553,
  0.000000,
  0.000000,
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
  3,
  8,
  2,
  3,
  9,
  8,
  0,
  9,
  3,
  0,
  10,
  9,
  7,
  11,
  6,
  7,
  12,
  11,
  5,
  11,
  13,
  5,
  6,
  11
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail3335133352(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3335133352Raw(): [Vector3[], Vector2[], number[]] {
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
