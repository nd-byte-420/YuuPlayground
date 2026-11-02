import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -48.000000,
  -64.000000,
  -192.000000,
  48.000000,
  -80.000000,
  -192.000000,
  48.000000,
  48.000000,
  192.000000,
  -48.000000,
  64.000000,
  192.000000,
  -48.000000,
  -48.000000,
  -192.000000,
  -48.000000,
  79.999992,
  192.000000,
  48.000000,
  64.000000,
  192.000000,
  48.000000,
  -64.000000,
  -192.000000,
  -48.000000,
  79.999992,
  192.000000,
  -48.000000,
  -48.000000,
  -192.000000,
  48.000000,
  -80.000000,
  -192.000000,
  48.000000,
  48.000000,
  192.000000,
  -48.000000,
  -64.000000,
  -192.000000,
  48.000000,
  64.000000,
  192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -48.000000,
  -192.000000,
  64.000000,
  48.000000,
  -192.000000,
  80.000000,
  48.000000,
  192.000000,
  -48.000000,
  -48.000000,
  192.000000,
  -64.000000,
  -48.000000,
  -192.000000,
  48.000000,
  -48.000000,
  192.000000,
  -79.999992,
  48.000000,
  192.000000,
  -64.000000,
  48.000000,
  -192.000000,
  64.000000,
  -48.000000,
  192.000000,
  -79.999992,
  -48.000000,
  -192.000000,
  48.000000,
  48.000000,
  -192.000000,
  80.000000,
  48.000000,
  192.000000,
  -48.000000,
  -48.000000,
  -192.000000,
  64.000000,
  48.000000,
  192.000000,
  -64.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.486111,
  0.987805,
  0.000000,
  1.000000,
  0.000000,
  0.024390,
  0.486111,
  0.012195,
  0.502033,
  0.975610,
  0.502033,
  0.000000,
  0.988144,
  0.012195,
  0.988144,
  0.987805,
  0.497967,
  0.000000,
  0.497967,
  0.975610,
  1.000000,
  1.000000,
  1.000000,
  0.024390,
  0.513889,
  0.987805,
  0.011856,
  0.012195
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
  6,
  7,
  10,
  11,
  6,
  12,
  7,
  4,
  12,
  10,
  7,
  3,
  13,
  2,
  3,
  8,
  13
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail5363353634(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail5363353634Raw(): [Vector3[], Vector2[], number[]] {
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
