import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  31.999987,
  -19.999990,
  -192.000000,
  -16.000048,
  -116.000008,
  -192.000000,
  -31.999985,
  -108.000015,
  -192.000000,
  16.000023,
  -11.999996,
  -192.000000,
  32.000011,
  107.999985,
  192.000000,
  16.000017,
  116.000008,
  192.000000,
  -31.999985,
  19.999992,
  192.000000,
  -16.000019,
  11.999996,
  192.000000,
  31.999987,
  -19.999990,
  -192.000000,
  -16.000048,
  -116.000008,
  -192.000000,
  -31.999985,
  19.999992,
  192.000000,
  16.000017,
  116.000008,
  192.000000,
  32.000011,
  107.999985,
  192.000000,
  -31.999985,
  -108.000015,
  -192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  31.999987,
  -192.000000,
  19.999990,
  -16.000048,
  -192.000000,
  116.000008,
  -31.999985,
  -192.000000,
  108.000015,
  16.000023,
  -192.000000,
  11.999996,
  32.000011,
  192.000000,
  -107.999985,
  16.000017,
  192.000000,
  -116.000008,
  -31.999985,
  192.000000,
  -19.999992,
  -16.000019,
  192.000000,
  -11.999996,
  31.999987,
  -192.000000,
  19.999990,
  -16.000048,
  -192.000000,
  116.000008,
  -31.999985,
  192.000000,
  -19.999992,
  16.000017,
  192.000000,
  -116.000008,
  32.000011,
  192.000000,
  -107.999985,
  -31.999985,
  -192.000000,
  108.000015
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.497954,
  0.930636,
  0.003582,
  1.000000,
  0.000000,
  0.994220,
  0.494372,
  0.924856,
  0.502046,
  0.005780,
  0.505628,
  0.000000,
  1.000000,
  0.069364,
  0.996418,
  0.075145,
  0.502046,
  0.930636,
  0.996418,
  1.000000,
  0.000000,
  0.069364,
  0.494372,
  0.000000,
  0.497954,
  0.005780,
  1.000000,
  0.994220
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
  12,
  11,
  9,
  6,
  7,
  9,
  13,
  6
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail4061640617(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail4061640617Raw(): [Vector3[], Vector2[], number[]] {
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
