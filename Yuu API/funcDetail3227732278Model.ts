import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -48.000000,
  24.001768,
  24.001600,
  48.000000,
  -7.998229,
  8.001602,
  48.000000,
  -7.998230,
  -12.000595,
  -48.000000,
  24.001770,
  -12.000595,
  -48.000000,
  7.998109,
  15.999527,
  -48.000000,
  7.998108,
  -12.000595,
  48.000000,
  -24.001646,
  -12.000595,
  48.000000,
  -24.001650,
  -0.000352,
  -48.000000,
  24.001768,
  24.001600,
  48.000000,
  -7.998229,
  8.001602,
  -48.000000,
  24.001768,
  24.001600,
  -48.000000,
  24.001770,
  -12.000595,
  -48.000000,
  7.998108,
  -12.000595,
  -48.000000,
  7.998109,
  15.999527,
  48.000000,
  -7.998229,
  8.001602,
  48.000000,
  -24.001650,
  -0.000352,
  48.000000,
  -24.001646,
  -12.000595,
  48.000000,
  -7.998230,
  -12.000595,
  -48.000000,
  24.001770,
  -12.000595,
  48.000000,
  -7.998230,
  -12.000595,
  48.000000,
  -24.001646,
  -12.000595,
  -48.000000,
  7.998108,
  -12.000595
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -48.000000,
  18.001098,
  -24.001708,
  48.000000,
  2.001100,
  7.998289,
  48.000000,
  -18.001098,
  7.998290,
  -48.000000,
  -18.001098,
  -24.001710,
  -48.000000,
  9.999024,
  -7.998049,
  -48.000000,
  -18.001098,
  -7.998048,
  48.000000,
  -18.001098,
  24.001706,
  48.000000,
  -6.000854,
  24.001710,
  -48.000000,
  18.001098,
  -24.001708,
  48.000000,
  2.001100,
  7.998289,
  -48.000000,
  18.001098,
  -24.001708,
  -48.000000,
  -18.001098,
  -24.001710,
  -48.000000,
  -18.001098,
  -7.998048,
  -48.000000,
  9.999024,
  -7.998049,
  48.000000,
  2.001100,
  7.998289,
  48.000000,
  -6.000854,
  24.001710,
  48.000000,
  -18.001098,
  24.001706,
  48.000000,
  -18.001098,
  7.998290,
  -48.000000,
  -18.001098,
  -24.001710,
  48.000000,
  -18.001098,
  7.998290,
  48.000000,
  -18.001098,
  24.001706,
  -48.000000,
  -18.001098,
  -7.998048
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.680815,
  0.001915,
  0.530809,
  0.950639,
  0.343280,
  0.950639,
  0.343280,
  0.001915,
  0.264427,
  0.950638,
  0.001915,
  0.950638,
  0.001915,
  0.001915,
  0.114422,
  0.001915,
  0.339450,
  0.998085,
  0.189444,
  0.049361,
  0.980857,
  0.001915,
  0.980857,
  0.339450,
  0.830817,
  0.339450,
  0.830817,
  0.076938,
  0.830817,
  0.343280,
  0.980855,
  0.418302,
  0.980855,
  0.530809,
  0.830817,
  0.530809,
  0.684645,
  0.998085,
  0.684645,
  0.049361,
  0.826984,
  0.001915,
  0.826986,
  0.950638
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
  7,
  4,
  8,
  9,
  7,
  10,
  12,
  11,
  10,
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
export function getFuncDetail3227732278(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3227732278Raw(): [Vector3[], Vector2[], number[]] {
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
