import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -31.000309,
  -40.000172,
  -191.999985,
  -31.000309,
  87.999840,
  192.000000,
  37.000099,
  55.999702,
  192.000000,
  37.000099,
  -72.000305,
  -192.000000,
  -31.000309,
  -40.000172,
  -191.999985,
  -35.000103,
  -55.999702,
  -192.000000,
  -35.000103,
  72.000282,
  192.000000,
  -31.000309,
  87.999840,
  192.000000,
  37.000099,
  -72.000305,
  -192.000000,
  37.000099,
  55.999702,
  192.000000,
  29.000309,
  40.000183,
  192.000000,
  29.000309,
  -87.999817,
  -191.999985,
  29.000309,
  -87.999817,
  -191.999985,
  -35.000103,
  -55.999702,
  -192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -31.000309,
  -191.999985,
  40.000172,
  -31.000309,
  192.000000,
  -87.999840,
  37.000099,
  192.000000,
  -55.999702,
  37.000099,
  -192.000000,
  72.000305,
  -31.000309,
  -191.999985,
  40.000172,
  -35.000103,
  -192.000000,
  55.999702,
  -35.000103,
  192.000000,
  -72.000282,
  -31.000309,
  192.000000,
  -87.999840,
  37.000099,
  -192.000000,
  72.000305,
  37.000099,
  192.000000,
  -55.999702,
  29.000309,
  192.000000,
  -40.000183,
  29.000309,
  -191.999985,
  87.999817,
  29.000309,
  -191.999985,
  87.999817,
  -35.000103,
  -192.000000,
  55.999702
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.000000,
  0.963856,
  0.000000,
  0.000000,
  0.497702,
  0.024097,
  0.497702,
  0.987952,
  1.000000,
  0.963856,
  0.980677,
  0.975903,
  0.980677,
  0.012048,
  1.000000,
  0.000000,
  0.502430,
  0.987952,
  0.502430,
  0.024096,
  0.507261,
  0.036144,
  0.507261,
  1.000000,
  0.490235,
  1.000000,
  0.016944,
  0.975904
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
  0,
  12,
  3,
  0,
  13,
  12,
  7,
  10,
  6,
  7,
  9,
  10,
  5,
  10,
  11,
  5,
  6,
  10
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail3614836149(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3614836149Raw(): [Vector3[], Vector2[], number[]] {
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
