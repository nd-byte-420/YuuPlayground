import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -7.999991,
  -64.000000,
  -82.000977,
  -7.999993,
  -64.000000,
  50.000973,
  -24.000021,
  -64.000000,
  50.000973,
  -24.000023,
  -64.000000,
  -82.000977,
  24.000036,
  64.000000,
  -82.000977,
  7.999977,
  64.000000,
  -82.000977,
  7.999977,
  63.999996,
  114.000969,
  24.000038,
  63.999996,
  114.000969,
  7.999977,
  64.000000,
  -82.000977,
  24.000036,
  64.000000,
  -82.000977,
  24.000038,
  63.999996,
  114.000969,
  7.999977,
  63.999996,
  114.000969,
  -24.000023,
  -64.000000,
  -82.000977,
  -24.000021,
  -64.000000,
  50.000973
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -7.999991,
  -82.000977,
  64.000000,
  -7.999993,
  50.000973,
  64.000000,
  -24.000021,
  50.000973,
  64.000000,
  -24.000023,
  -82.000977,
  64.000000,
  24.000036,
  -82.000977,
  -64.000000,
  7.999977,
  -82.000977,
  -64.000000,
  7.999977,
  114.000969,
  -63.999996,
  24.000038,
  114.000969,
  -63.999996,
  7.999977,
  -82.000977,
  -64.000000,
  24.000036,
  -82.000977,
  -64.000000,
  24.000038,
  114.000969,
  -63.999996,
  7.999977,
  114.000969,
  -63.999996,
  -24.000023,
  -82.000977,
  64.000000,
  -24.000021,
  50.000973,
  64.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.484550,
  1.000000,
  0.484550,
  0.326527,
  0.498802,
  0.326527,
  0.498802,
  1.000000,
  1.000000,
  1.000000,
  0.985748,
  1.000000,
  0.985748,
  0.000000,
  1.000000,
  0.000000,
  0.014252,
  1.000000,
  0.000000,
  1.000000,
  0.000000,
  0.000000,
  0.014252,
  0.000000,
  0.501198,
  1.000000,
  0.501198,
  0.326527
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
  8,
  3,
  0,
  9,
  8,
  1,
  11,
  10,
  1,
  2,
  11,
  0,
  10,
  9,
  0,
  1,
  10,
  12,
  6,
  13,
  12,
  5,
  6
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail5035750358(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail5035750358Raw(): [Vector3[], Vector2[], number[]] {
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
