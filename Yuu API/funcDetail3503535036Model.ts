import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -32.000134,
  -20.000162,
  -192.000000,
  -15.999750,
  -12.000069,
  -192.000000,
  31.999941,
  -107.999695,
  -192.000000,
  15.999950,
  -116.000084,
  -192.000000,
  -32.000134,
  107.999825,
  192.000000,
  15.999943,
  11.999926,
  192.000000,
  31.999941,
  20.000319,
  192.000000,
  -15.999756,
  115.999931,
  192.000000,
  -32.000134,
  -20.000162,
  -192.000000,
  15.999950,
  -116.000084,
  -192.000000,
  -15.999756,
  115.999931,
  192.000000,
  31.999941,
  20.000319,
  192.000000,
  -32.000134,
  107.999825,
  192.000000,
  31.999941,
  -107.999695,
  -192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -32.000134,
  -192.000000,
  20.000162,
  -15.999750,
  -192.000000,
  12.000069,
  31.999941,
  -192.000000,
  107.999695,
  15.999950,
  -192.000000,
  116.000084,
  -32.000134,
  192.000000,
  -107.999825,
  15.999943,
  192.000000,
  -11.999926,
  31.999941,
  192.000000,
  -20.000319,
  -15.999756,
  192.000000,
  -115.999931,
  -32.000134,
  -192.000000,
  20.000162,
  15.999950,
  -192.000000,
  116.000084,
  -15.999756,
  192.000000,
  -115.999931,
  31.999941,
  192.000000,
  -20.000319,
  -32.000134,
  192.000000,
  -107.999825,
  31.999941,
  -192.000000,
  107.999695
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.502046,
  0.930636,
  0.505629,
  0.924856,
  1.000000,
  0.994219,
  0.996419,
  1.000000,
  0.497954,
  0.005780,
  0.003581,
  0.075145,
  0.000000,
  0.069364,
  0.494371,
  0.000000,
  0.497954,
  0.930636,
  0.003581,
  1.000000,
  0.505629,
  0.000000,
  1.000000,
  0.069364,
  0.502046,
  0.005780,
  0.000000,
  0.994219
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
  5,
  9,
  8,
  4,
  5,
  1,
  11,
  10,
  1,
  2,
  11,
  0,
  10,
  12,
  0,
  1,
  10,
  9,
  6,
  13,
  9,
  5,
  6
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail3503535036(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3503535036Raw(): [Vector3[], Vector2[], number[]] {
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
