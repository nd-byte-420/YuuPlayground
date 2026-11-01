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
  0.001687,
  64.000000,
  -114.000977,
  0.001687,
  64.000000,
  146.000977,
  15.998328,
  64.000000,
  146.000977,
  15.998329,
  64.000000,
  -114.000977,
  -15.998314,
  -64.000000,
  -114.000977,
  0.001687,
  64.000000,
  -114.000977,
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
  -0.001702,
  -64.000000,
  -114.000977,
  15.998329,
  64.000000,
  -114.000977,
  15.998328,
  64.000000,
  146.000977,
  -0.001701,
  -64.000000,
  82.000977
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -15.998322,
  -130.000977,
  64.000000,
  -15.998322,
  66.000977,
  64.000000,
  0.001679,
  130.000977,
  -64.000000,
  0.001679,
  -130.000977,
  -64.000000,
  -15.998322,
  -130.000977,
  64.000000,
  -0.001710,
  -130.000977,
  64.000000,
  -0.001709,
  66.000977,
  64.000000,
  -15.998322,
  66.000977,
  64.000000,
  0.001679,
  -130.000977,
  -64.000000,
  0.001679,
  130.000977,
  -64.000000,
  15.998321,
  130.000977,
  -64.000000,
  15.998322,
  -130.000977,
  -64.000000,
  -15.998322,
  -130.000977,
  64.000000,
  0.001679,
  -130.000977,
  -64.000000,
  15.998322,
  -130.000977,
  -64.000000,
  -0.001710,
  -130.000977,
  64.000000,
  15.998321,
  130.000977,
  -64.000000,
  0.001679,
  130.000977,
  -64.000000,
  -0.001710,
  -130.000977,
  64.000000,
  15.998322,
  -130.000977,
  -64.000000,
  15.998321,
  130.000977,
  -64.000000,
  -0.001709,
  66.000977,
  64.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.411642,
  0.820985,
  0.411642,
  0.203389,
  0.818106,
  0.001726,
  0.818106,
  0.820985,
  0.871843,
  0.734087,
  0.821559,
  0.730600,
  0.840663,
  0.455064,
  0.890947,
  0.458550,
  0.894400,
  0.820985,
  0.894400,
  0.001726,
  0.944805,
  0.001726,
  0.944805,
  0.820985,
  0.998273,
  0.001726,
  0.998273,
  0.408190,
  0.948258,
  0.414441,
  0.948258,
  0.007978,
  0.821558,
  0.001726,
  0.871843,
  0.005213,
  0.408190,
  0.820985,
  0.001726,
  0.820985,
  0.001726,
  0.001726,
  0.408190,
  0.203389
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
  7,
  16,
  6,
  7,
  17,
  16,
  18,
  20,
  19,
  18,
  21,
  20
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
