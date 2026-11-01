import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -384.000000,
  -384.000000,
  -0.500000,
  -384.000000,
  -384.000000,
  0.500000,
  -384.000000,
  384.000000,
  0.500000,
  -384.000000,
  384.000000,
  -0.500000,
  384.000000,
  -384.000000,
  -0.500000,
  384.000000,
  384.000000,
  -0.500000,
  384.000000,
  384.000000,
  0.500000,
  384.000000,
  -384.000000,
  0.500000,
  -384.000000,
  -384.000000,
  -0.500000,
  384.000000,
  -384.000000,
  -0.500000,
  384.000000,
  -384.000000,
  0.500000,
  -384.000000,
  -384.000000,
  0.500000,
  -384.000000,
  384.000000,
  -0.500000,
  -384.000000,
  384.000000,
  0.500000,
  384.000000,
  384.000000,
  0.500000,
  384.000000,
  384.000000,
  -0.500000,
  -384.000000,
  -384.000000,
  -0.500000,
  -384.000000,
  384.000000,
  -0.500000,
  384.000000,
  384.000000,
  -0.500000,
  384.000000,
  -384.000000,
  -0.500000,
  -384.000000,
  -384.000000,
  0.500000,
  384.000000,
  -384.000000,
  0.500000,
  384.000000,
  384.000000,
  0.500000,
  -384.000000,
  384.000000,
  0.500000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -384.000000,
  -0.500000,
  384.000000,
  -384.000000,
  0.500000,
  384.000000,
  -384.000000,
  0.500000,
  -384.000000,
  -384.000000,
  -0.500000,
  -384.000000,
  384.000000,
  -0.500000,
  384.000000,
  384.000000,
  -0.500000,
  -384.000000,
  384.000000,
  0.500000,
  -384.000000,
  384.000000,
  0.500000,
  384.000000,
  -384.000000,
  -0.500000,
  384.000000,
  384.000000,
  -0.500000,
  384.000000,
  384.000000,
  0.500000,
  384.000000,
  -384.000000,
  0.500000,
  384.000000,
  -384.000000,
  -0.500000,
  -384.000000,
  -384.000000,
  0.500000,
  -384.000000,
  384.000000,
  0.500000,
  -384.000000,
  384.000000,
  -0.500000,
  -384.000000,
  -384.000000,
  -0.500000,
  384.000000,
  -384.000000,
  -0.500000,
  -384.000000,
  384.000000,
  -0.500000,
  -384.000000,
  384.000000,
  -0.500000,
  384.000000,
  -384.000000,
  0.500000,
  384.000000,
  384.000000,
  0.500000,
  384.000000,
  384.000000,
  0.500000,
  -384.000000,
  -384.000000,
  0.500000,
  -384.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.501716,
  0.498932,
  0.501068,
  0.498932,
  0.501068,
  0.001068,
  0.501716,
  0.001068,
  0.501716,
  0.501068,
  0.501716,
  0.998932,
  0.501068,
  0.998932,
  0.501068,
  0.501068,
  0.504499,
  0.001068,
  0.504499,
  0.498932,
  0.503851,
  0.498932,
  0.503851,
  0.001068,
  0.504499,
  0.998932,
  0.503851,
  0.998932,
  0.503851,
  0.501068,
  0.504499,
  0.501068,
  0.001068,
  0.001068,
  0.498932,
  0.001068,
  0.498932,
  0.498932,
  0.001068,
  0.498932,
  0.001068,
  0.998932,
  0.001068,
  0.501068,
  0.498932,
  0.501068,
  0.498932,
  0.998932
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
  18,
  17,
  16,
  19,
  18,
  20,
  22,
  21,
  20,
  23,
  22
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncIllusionary146945316758(): [Vector3[], Vector2[], number[]] {
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
export function getFuncIllusionary146945316758Raw(): [Vector3[], Vector2[], number[]] {
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
