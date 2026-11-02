import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -48.000000,
  -63.999996,
  -192.000000,
  -48.000000,
  -80.000000,
  -192.000000,
  -48.000000,
  47.999996,
  192.000000,
  -48.000000,
  64.000000,
  192.000000,
  48.000000,
  -47.999996,
  -192.000000,
  48.000000,
  80.000000,
  192.000000,
  48.000000,
  63.999989,
  192.000000,
  48.000000,
  -63.999996,
  -192.000000,
  48.000000,
  -47.999996,
  -192.000000,
  48.000000,
  -63.999996,
  -192.000000,
  -48.000000,
  64.000000,
  192.000000,
  -48.000000,
  47.999996,
  192.000000,
  48.000000,
  80.000000,
  192.000000,
  -48.000000,
  -80.000000,
  -192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -48.000000,
  -192.000000,
  63.999996,
  -48.000000,
  -192.000000,
  80.000000,
  -48.000000,
  192.000000,
  -47.999996,
  -48.000000,
  192.000000,
  -64.000000,
  48.000000,
  -192.000000,
  47.999996,
  48.000000,
  192.000000,
  -80.000000,
  48.000000,
  192.000000,
  -63.999989,
  48.000000,
  -192.000000,
  63.999996,
  48.000000,
  -192.000000,
  47.999996,
  48.000000,
  -192.000000,
  63.999996,
  -48.000000,
  192.000000,
  -64.000000,
  -48.000000,
  192.000000,
  -47.999996,
  48.000000,
  192.000000,
  -80.000000,
  -48.000000,
  -192.000000,
  80.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.011856,
  0.987805,
  0.000000,
  1.000000,
  0.000000,
  0.024390,
  0.011856,
  0.012195,
  0.502033,
  0.975610,
  0.502033,
  0.000000,
  0.513889,
  0.012195,
  0.513889,
  0.987805,
  0.497967,
  0.975610,
  0.486111,
  0.987805,
  0.988144,
  0.012195,
  1.000000,
  0.024390,
  0.497967,
  0.000000,
  1.000000,
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
  4,
  6,
  5,
  4,
  7,
  6,
  0,
  9,
  8,
  0,
  1,
  9,
  10,
  6,
  11,
  10,
  5,
  6,
  0,
  12,
  3,
  0,
  8,
  12,
  13,
  6,
  7,
  13,
  11,
  6
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail2768327684(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail2768327684Raw(): [Vector3[], Vector2[], number[]] {
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
