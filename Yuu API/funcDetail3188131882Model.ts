import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -36.000099,
  -43.999454,
  11.001236,
  -36.000099,
  -43.999451,
  -33.000961,
  43.999508,
  36.000061,
  -33.000961,
  43.999508,
  36.000061,
  51.000988,
  -36.000099,
  -28.000668,
  19.000629,
  28.000690,
  36.000061,
  51.000988,
  28.000694,
  36.000061,
  -33.000961,
  -36.000099,
  -28.000668,
  -33.000961,
  28.000690,
  36.000061,
  51.000988,
  -36.000099,
  -28.000668,
  19.000629,
  -36.000099,
  -43.999454,
  11.001236,
  -36.000099,
  -43.999451,
  -33.000961,
  43.999508,
  36.000061,
  51.000988,
  43.999508,
  36.000061,
  -33.000961,
  -36.000099,
  -28.000668,
  -33.000961,
  28.000694,
  36.000061,
  -33.000961
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -36.000099,
  11.001236,
  43.999454,
  -36.000099,
  -33.000961,
  43.999451,
  43.999508,
  -33.000961,
  -36.000061,
  43.999508,
  51.000988,
  -36.000061,
  -36.000099,
  19.000629,
  28.000668,
  28.000690,
  51.000988,
  -36.000061,
  28.000694,
  -33.000961,
  -36.000061,
  -36.000099,
  -33.000961,
  28.000668,
  28.000690,
  51.000988,
  -36.000061,
  -36.000099,
  19.000629,
  28.000668,
  -36.000099,
  11.001236,
  43.999454,
  -36.000099,
  -33.000961,
  43.999451,
  43.999508,
  51.000988,
  -36.000061,
  43.999508,
  -33.000961,
  -36.000061,
  -36.000099,
  -33.000961,
  28.000668,
  28.000694,
  -33.000961,
  -36.000061
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.237548,
  0.000000,
  0.498865,
  0.000000,
  0.498865,
  1.000000,
  0.000000,
  1.000000,
  0.691177,
  0.869764,
  0.501135,
  0.130647,
  1.000000,
  0.130647,
  1.000000,
  0.869764,
  0.000000,
  0.900007,
  0.190041,
  0.099993,
  0.738683,
  0.923880,
  1.000000,
  0.923880,
  0.501135,
  0.000000,
  1.000000,
  0.000000,
  0.498865,
  0.099993,
  0.498865,
  0.900007
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
  10,
  7,
  4,
  10,
  11,
  7,
  12,
  6,
  13,
  12,
  5,
  6,
  1,
  15,
  14,
  1,
  2,
  15
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail3188131882(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3188131882Raw(): [Vector3[], Vector2[], number[]] {
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
