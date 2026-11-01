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
  7.999991,
  -64.000000,
  -82.000977,
  -24.000038,
  64.000000,
  -82.000977,
  -7.999977,
  64.000000,
  -82.000977,
  24.000023,
  -64.000000,
  -82.000977,
  -7.999976,
  63.999996,
  114.000984,
  -24.000038,
  63.999996,
  114.000984,
  7.999991,
  -64.000000,
  -82.000977,
  7.999992,
  -64.000000,
  50.000980,
  -24.000038,
  63.999996,
  114.000984,
  -24.000038,
  64.000000,
  -82.000977,
  24.000023,
  -64.000000,
  -82.000977,
  -7.999977,
  64.000000,
  -82.000977,
  -7.999976,
  63.999996,
  114.000984,
  24.000023,
  -64.000000,
  50.000980
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  7.999999,
  -98.000980,
  64.000000,
  24.000031,
  -98.000980,
  64.000000,
  24.000031,
  34.000977,
  64.000000,
  8.000000,
  34.000977,
  64.000000,
  -24.000031,
  -98.000980,
  -64.000000,
  -24.000031,
  98.000980,
  -63.999996,
  -7.999969,
  98.000980,
  -63.999996,
  -7.999969,
  -98.000980,
  -64.000000,
  7.999999,
  -98.000980,
  64.000000,
  -24.000031,
  -98.000980,
  -64.000000,
  -7.999969,
  -98.000980,
  -64.000000,
  24.000031,
  -98.000980,
  64.000000,
  -7.999969,
  98.000980,
  -63.999996,
  -24.000031,
  98.000980,
  -63.999996,
  7.999999,
  -98.000980,
  64.000000,
  8.000000,
  34.000977,
  64.000000,
  -24.000031,
  98.000980,
  -63.999996,
  -24.000031,
  -98.000980,
  -64.000000,
  24.000031,
  -98.000980,
  64.000000,
  -7.999969,
  -98.000980,
  -64.000000,
  -7.999969,
  98.000980,
  -63.999996,
  24.000031,
  34.000977,
  64.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.895510,
  0.630487,
  0.846943,
  0.638175,
  0.818576,
  0.458984,
  0.867143,
  0.451296,
  0.898555,
  0.603882,
  0.898555,
  0.001523,
  0.947727,
  0.001523,
  0.947727,
  0.603882,
  0.998477,
  0.013449,
  0.998477,
  0.418929,
  0.950773,
  0.407003,
  0.950773,
  0.001523,
  0.846942,
  0.009211,
  0.895510,
  0.001523,
  0.001523,
  0.603883,
  0.001523,
  0.198210,
  0.407003,
  0.001523,
  0.407003,
  0.603883,
  0.815530,
  0.603883,
  0.410049,
  0.603883,
  0.410049,
  0.001523,
  0.815530,
  0.198210
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
  3,
  12,
  2,
  3,
  13,
  12,
  14,
  16,
  15,
  14,
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
