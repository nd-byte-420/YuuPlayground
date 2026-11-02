import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -96.000000,
  -8.000000,
  -4.000977,
  -95.999992,
  -8.000000,
  0.000977,
  -95.999992,
  8.000000,
  8.000977,
  -96.000000,
  8.000000,
  -4.000977,
  96.000000,
  -8.000000,
  -4.000977,
  96.000000,
  8.000000,
  -4.000977,
  95.999992,
  8.000000,
  8.000977,
  95.999992,
  -8.000000,
  0.000977,
  -96.000000,
  8.000000,
  -4.000977,
  -95.999992,
  8.000000,
  8.000977,
  95.999992,
  8.000000,
  8.000977,
  96.000000,
  8.000000,
  -4.000977,
  -96.000000,
  -8.000000,
  -4.000977,
  96.000000,
  -8.000000,
  -4.000977
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -96.000000,
  -4.000977,
  8.000000,
  -95.999992,
  0.000977,
  8.000000,
  -95.999992,
  8.000977,
  -8.000000,
  -96.000000,
  -4.000977,
  -8.000000,
  96.000000,
  -4.000977,
  8.000000,
  96.000000,
  -4.000977,
  -8.000000,
  95.999992,
  8.000977,
  -8.000000,
  95.999992,
  0.000977,
  8.000000,
  -96.000000,
  -4.000977,
  -8.000000,
  -95.999992,
  8.000977,
  -8.000000,
  95.999992,
  8.000977,
  -8.000000,
  96.000000,
  -4.000977,
  -8.000000,
  -96.000000,
  -4.000977,
  8.000000,
  96.000000,
  -4.000977,
  8.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.547957,
  0.000000,
  0.498121,
  0.000000,
  0.000000,
  0.000000,
  0.149461,
  0.000000,
  0.547957,
  1.000000,
  0.149460,
  1.000000,
  0.000000,
  1.000000,
  0.498120,
  1.000000,
  1.000000,
  0.000000,
  1.000000,
  0.000000,
  1.000000,
  1.000000,
  1.000000,
  1.000000,
  0.554467,
  0.000000,
  0.554467,
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
  0,
  7,
  4,
  0,
  1,
  7,
  8,
  10,
  9,
  8,
  11,
  10,
  12,
  11,
  8,
  12,
  13,
  11,
  1,
  6,
  7,
  1,
  2,
  6
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail4915349154(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail4915349154Raw(): [Vector3[], Vector2[], number[]] {
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
