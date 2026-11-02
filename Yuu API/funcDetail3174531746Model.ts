import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  35.000153,
  -55.999722,
  -192.000000,
  -29.000357,
  -87.999802,
  -192.000000,
  -37.000160,
  -72.000305,
  -192.000000,
  31.000357,
  -40.000168,
  -192.000000,
  35.000156,
  72.000290,
  192.000000,
  31.000360,
  87.999832,
  192.000015,
  -37.000160,
  55.999676,
  192.000000,
  -29.000357,
  40.000195,
  192.000000,
  35.000153,
  -55.999722,
  -192.000000,
  -29.000357,
  -87.999802,
  -192.000000,
  -37.000160,
  55.999676,
  192.000000,
  31.000360,
  87.999832,
  192.000015,
  31.000357,
  -40.000168,
  -192.000000,
  -37.000160,
  -72.000305,
  -192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  35.000153,
  -192.000000,
  55.999722,
  -29.000357,
  -192.000000,
  87.999802,
  -37.000160,
  -192.000000,
  72.000305,
  31.000357,
  -192.000000,
  40.000168,
  35.000156,
  192.000000,
  -72.000290,
  31.000360,
  192.000015,
  -87.999832,
  -37.000160,
  192.000000,
  -55.999676,
  -29.000357,
  192.000000,
  -40.000195,
  35.000153,
  -192.000000,
  55.999722,
  -29.000357,
  -192.000000,
  87.999802,
  -37.000160,
  192.000000,
  -55.999676,
  31.000360,
  192.000015,
  -87.999832,
  31.000357,
  -192.000000,
  40.000168,
  -37.000160,
  -192.000000,
  72.000305
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.480758,
  0.975904,
  0.007467,
  1.000000,
  0.000000,
  0.987952,
  0.497702,
  0.963856,
  0.521752,
  0.012048,
  0.502430,
  0.000000,
  1.000000,
  0.024097,
  0.995169,
  0.036144,
  0.521752,
  0.975903,
  0.995169,
  1.000000,
  0.000000,
  0.024097,
  0.497702,
  0.000000,
  0.502430,
  0.963856,
  1.000000,
  0.987952
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
  8,
  5,
  12,
  8,
  4,
  5,
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
export function getFuncDetail3174531746(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3174531746Raw(): [Vector3[], Vector2[], number[]] {
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
