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
  32.000889,
  32.000000,
  -8.001221,
  16.000887,
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
  32.000000,
  -8.001221,
  16.000887,
  -32.000000,
  23.998779,
  -20.001070,
  32.000000,
  -23.998779,
  8.001252
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -32.000000,
  -20.001070,
  -23.998779,
  32.000000,
  -20.001070,
  8.001221,
  32.000000,
  -20.001070,
  23.998779,
  -32.000000,
  -20.001070,
  -8.001221,
  -32.000000,
  32.000889,
  -23.998779,
  32.000000,
  16.000887,
  8.001221,
  -32.000000,
  -20.001070,
  -8.001221,
  32.000000,
  -20.001070,
  23.998779,
  32.000000,
  8.001252,
  23.998779,
  -32.000000,
  24.001253,
  -8.001221,
  -32.000000,
  32.000889,
  -23.998779,
  32.000000,
  16.000887,
  8.001221,
  -32.000000,
  -20.001070,
  -23.998779,
  32.000000,
  8.001252,
  23.998779
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.000000,
  0.000000,
  0.000000,
  0.909104,
  0.000000,
  1.000000,
  0.000000,
  0.090897,
  0.498773,
  0.000000,
  0.345310,
  0.909104,
  0.501227,
  0.909103,
  0.501227,
  0.000000,
  0.769809,
  0.000000,
  0.923272,
  0.909103,
  1.000000,
  1.000000,
  0.846537,
  0.090896,
  0.501227,
  1.000000,
  0.268582,
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
  0,
  5,
  4,
  0,
  1,
  5,
  6,
  8,
  7,
  6,
  9,
  8,
  10,
  8,
  9,
  10,
  11,
  8,
  12,
  9,
  6,
  12,
  10,
  9,
  1,
  13,
  5,
  1,
  2,
  13
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
