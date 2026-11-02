import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  7.999991,
  -64.000000,
  -82.000977,
  24.000023,
  -64.000000,
  -82.000977,
  24.000023,
  -64.000000,
  50.000980,
  7.999992,
  -64.000000,
  50.000980,
  -24.000038,
  64.000000,
  -82.000977,
  -24.000038,
  63.999996,
  114.000984,
  -7.999976,
  63.999996,
  114.000984,
  -7.999977,
  64.000000,
  -82.000977,
  -24.000038,
  64.000000,
  -82.000977,
  -7.999977,
  64.000000,
  -82.000977,
  -7.999976,
  63.999996,
  114.000984,
  -24.000038,
  63.999996,
  114.000984,
  24.000023,
  -64.000000,
  -82.000977,
  24.000023,
  -64.000000,
  50.000980
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  7.999991,
  -82.000977,
  64.000000,
  24.000023,
  -82.000977,
  64.000000,
  24.000023,
  50.000980,
  64.000000,
  7.999992,
  50.000980,
  64.000000,
  -24.000038,
  -82.000977,
  -64.000000,
  -24.000038,
  114.000984,
  -63.999996,
  -7.999976,
  114.000984,
  -63.999996,
  -7.999977,
  -82.000977,
  -64.000000,
  -24.000038,
  -82.000977,
  -64.000000,
  -7.999977,
  -82.000977,
  -64.000000,
  -7.999976,
  114.000984,
  -63.999996,
  -24.000038,
  114.000984,
  -63.999996,
  24.000023,
  -82.000977,
  64.000000,
  24.000023,
  50.000980,
  64.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.014251,
  1.000000,
  0.000000,
  1.000000,
  0.000000,
  0.326527,
  0.014251,
  0.326527,
  0.501198,
  1.000000,
  0.501199,
  0.000000,
  0.515450,
  0.000000,
  0.515450,
  1.000000,
  0.498802,
  1.000000,
  0.484550,
  1.000000,
  0.484550,
  0.000000,
  0.498802,
  0.000000,
  1.000000,
  1.000000,
  1.000000,
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
  9,
  8,
  0,
  1,
  9,
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
  8,
  11,
  12,
  6,
  7,
  12,
  13,
  6
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail2502925030(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail2502925030Raw(): [Vector3[], Vector2[], number[]] {
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
