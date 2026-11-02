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
  24.001770,
  -12.000595,
  48.000000,
  -24.001650,
  -0.000352,
  48.000000,
  -24.001646,
  -12.000595,
  48.000000,
  -7.998230,
  -12.000595
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -48.000000,
  24.001600,
  -24.001768,
  48.000000,
  8.001602,
  7.998229,
  48.000000,
  -12.000595,
  7.998230,
  -48.000000,
  -12.000595,
  -24.001770,
  -48.000000,
  15.999527,
  -7.998109,
  -48.000000,
  -12.000595,
  -7.998108,
  48.000000,
  -12.000595,
  24.001646,
  48.000000,
  -0.000352,
  24.001650,
  -48.000000,
  24.001600,
  -24.001768,
  48.000000,
  8.001602,
  7.998229,
  -48.000000,
  -12.000595,
  -24.001770,
  48.000000,
  -0.000352,
  24.001650,
  48.000000,
  -12.000595,
  24.001646,
  48.000000,
  -12.000595,
  7.998230
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.498288,
  0.000000,
  0.276840,
  0.952371,
  0.000000,
  0.952371,
  0.000000,
  0.000000,
  0.889247,
  0.952370,
  0.501712,
  0.952370,
  0.501712,
  0.000000,
  0.667801,
  0.000000,
  1.000000,
  1.000000,
  0.778552,
  0.047628,
  0.501712,
  1.000000,
  0.166089,
  1.000000,
  0.000000,
  1.000000,
  0.501712,
  0.047628
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
  8,
  5,
  10,
  8,
  4,
  5,
  1,
  12,
  11,
  1,
  2,
  12,
  10,
  6,
  13,
  10,
  5,
  6
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
