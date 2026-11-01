import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -32.000000,
  23.998779,
  -20.001070,
  32.000000,
  -8.001221,
  -20.001070,
  32.000000,
  -23.998779,
  -20.001070,
  -32.000000,
  8.001221,
  -20.001070,
  -32.000000,
  23.998779,
  -20.001070,
  -32.000000,
  23.998779,
  32.000889,
  32.000000,
  -8.001221,
  16.000887,
  32.000000,
  -8.001221,
  -20.001070,
  -32.000000,
  8.001221,
  -20.001070,
  32.000000,
  -23.998779,
  -20.001070,
  32.000000,
  -23.998779,
  8.001252,
  -32.000000,
  8.001221,
  24.001253,
  -32.000000,
  23.998779,
  32.000889,
  -32.000000,
  8.001221,
  24.001253,
  32.000000,
  -23.998779,
  8.001252,
  32.000000,
  -8.001221,
  16.000887,
  -32.000000,
  23.998779,
  -20.001070,
  -32.000000,
  23.998779,
  32.000889,
  32.000000,
  -23.998779,
  8.001252,
  32.000000,
  -23.998779,
  -20.001070
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -32.000000,
  -26.000979,
  -23.998779,
  32.000000,
  -26.000979,
  8.001221,
  32.000000,
  -26.000979,
  23.998779,
  -32.000000,
  -26.000979,
  -8.001221,
  -32.000000,
  -26.000979,
  -23.998779,
  -32.000000,
  26.000979,
  -23.998779,
  32.000000,
  10.000978,
  8.001221,
  32.000000,
  -26.000979,
  8.001221,
  -32.000000,
  -26.000979,
  -8.001221,
  32.000000,
  -26.000979,
  23.998779,
  32.000000,
  2.001343,
  23.998779,
  -32.000000,
  18.001344,
  -8.001221,
  -32.000000,
  26.000979,
  -23.998779,
  -32.000000,
  18.001344,
  -8.001221,
  32.000000,
  2.001343,
  23.998779,
  32.000000,
  10.000978,
  8.001221,
  -32.000000,
  -26.000979,
  -23.998779,
  -32.000000,
  26.000979,
  -23.998779,
  32.000000,
  2.001343,
  23.998779,
  32.000000,
  -26.000979,
  23.998779
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.892948,
  0.582316,
  0.892948,
  0.054254,
  0.998544,
  0.001456,
  0.998544,
  0.529518,
  0.001456,
  0.001456,
  0.385225,
  0.001456,
  0.267147,
  0.529518,
  0.001456,
  0.529518,
  0.388137,
  0.529518,
  0.388137,
  0.001456,
  0.594791,
  0.001456,
  0.712869,
  0.529518,
  0.774818,
  0.001456,
  0.890035,
  0.065865,
  0.890035,
  0.606967,
  0.774818,
  0.542559,
  0.388137,
  0.582316,
  0.771906,
  0.582316,
  0.208110,
  0.582316,
  0.001456,
  0.582316
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
  16,
  11,
  8,
  16,
  17,
  11,
  7,
  18,
  6,
  7,
  19,
  18
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail3470934710(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3470934710Raw(): [Vector3[], Vector2[], number[]] {
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
