import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -49.000015,
  -40.000492,
  -192.000000,
  -49.000015,
  -55.999531,
  -192.000000,
  -49.000015,
  72.000473,
  192.000000,
  -49.000015,
  87.999496,
  192.000000,
  -49.000015,
  -40.000492,
  -192.000000,
  50.999870,
  -72.000458,
  -192.000000,
  47.000168,
  -87.999512,
  -192.000000,
  -49.000015,
  -55.999531,
  -192.000000,
  47.000168,
  40.000484,
  192.000000,
  50.999870,
  55.999535,
  192.000000,
  -49.000015,
  87.999496,
  192.000000,
  50.999870,
  55.999535,
  192.000000,
  47.000168,
  -87.999512,
  -192.000000,
  47.000168,
  40.000484,
  192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -49.000015,
  -192.000000,
  40.000492,
  -49.000015,
  -192.000000,
  55.999531,
  -49.000015,
  192.000000,
  -72.000473,
  -49.000015,
  192.000000,
  -87.999496,
  -49.000015,
  -192.000000,
  40.000492,
  50.999870,
  -192.000000,
  72.000458,
  47.000168,
  -192.000000,
  87.999512,
  -49.000015,
  -192.000000,
  55.999531,
  47.000168,
  192.000000,
  -40.000484,
  50.999870,
  192.000000,
  -55.999535,
  -49.000015,
  192.000000,
  -87.999496,
  50.999870,
  192.000000,
  -55.999535,
  47.000168,
  -192.000000,
  87.999512,
  47.000168,
  192.000000,
  -40.000484
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.498422,
  0.963856,
  0.476753,
  0.975904,
  0.476753,
  0.012048,
  0.498422,
  0.000000,
  0.502402,
  0.963856,
  0.997245,
  0.987952,
  1.000000,
  1.000000,
  0.523279,
  0.975904,
  0.000000,
  0.036144,
  0.003612,
  0.024096,
  0.502402,
  0.000000,
  0.997245,
  0.024096,
  0.000000,
  1.000000,
  1.000000,
  0.036144
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
  3,
  8,
  2,
  3,
  9,
  8,
  4,
  11,
  10,
  4,
  5,
  11,
  1,
  8,
  12,
  1,
  2,
  8,
  5,
  13,
  11,
  5,
  6,
  13
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail4710947110(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail4710947110Raw(): [Vector3[], Vector2[], number[]] {
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
