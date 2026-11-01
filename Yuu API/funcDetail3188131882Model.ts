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
  -36.000099,
  -43.999454,
  11.001236,
  43.999508,
  36.000061,
  51.000988,
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
  -43.999451,
  -33.000961,
  -36.000099,
  -28.000668,
  -33.000961,
  28.000694,
  36.000061,
  -33.000961,
  43.999508,
  36.000061,
  -33.000961
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -39.999804,
  2.001223,
  39.999758,
  -39.999804,
  -42.000975,
  39.999754,
  39.999804,
  -42.000975,
  -39.999758,
  39.999804,
  42.000975,
  -39.999758,
  -39.999804,
  10.000616,
  24.000971,
  24.000986,
  42.000975,
  -39.999758,
  24.000990,
  -42.000975,
  -39.999758,
  -39.999804,
  -42.000975,
  24.000971,
  -39.999804,
  2.001223,
  39.999758,
  39.999804,
  42.000975,
  -39.999758,
  24.000986,
  42.000975,
  -39.999758,
  -39.999804,
  10.000616,
  24.000971,
  -39.999804,
  2.001223,
  39.999758,
  -39.999804,
  -42.000975,
  39.999754,
  39.999804,
  42.000975,
  -39.999758,
  39.999804,
  -42.000975,
  -39.999758,
  -39.999804,
  -42.000975,
  39.999754,
  -39.999804,
  -42.000975,
  24.000971,
  24.000990,
  -42.000975,
  -39.999758,
  39.999804,
  -42.000975,
  -39.999758
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.666062,
  0.586405,
  0.438532,
  0.586405,
  0.438531,
  0.001389,
  0.872897,
  0.001389,
  0.166859,
  0.527908,
  0.001389,
  0.059886,
  0.435754,
  0.059886,
  0.435754,
  0.527908,
  0.875674,
  0.621892,
  0.875674,
  0.001389,
  0.937336,
  0.056541,
  0.937336,
  0.552952,
  0.208223,
  0.586405,
  0.435754,
  0.586405,
  0.001389,
  0.001389,
  0.435754,
  0.001389,
  0.940114,
  0.001389,
  0.998611,
  0.059886,
  0.998611,
  0.527908,
  0.940114,
  0.586405
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
  7,
  4,
  12,
  13,
  7,
  14,
  6,
  15,
  14,
  5,
  6,
  16,
  18,
  17,
  16,
  19,
  18
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
