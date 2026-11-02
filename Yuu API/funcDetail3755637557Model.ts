import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  49.000008,
  -55.999271,
  -192.000000,
  49.000008,
  -40.000744,
  -192.000015,
  49.000008,
  87.999252,
  191.999985,
  49.000008,
  72.000732,
  192.000000,
  49.000008,
  -55.999271,
  -192.000000,
  -47.000183,
  -87.999268,
  -192.000000,
  -50.999817,
  -72.000717,
  -192.000000,
  49.000008,
  -40.000744,
  -192.000015,
  -50.999817,
  55.999283,
  191.999985,
  -47.000183,
  40.000744,
  192.000000,
  -47.000183,
  -87.999268,
  -192.000000,
  -50.999817,
  55.999283,
  191.999985,
  49.000008,
  87.999252,
  191.999985,
  -47.000183,
  40.000744,
  192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  49.000008,
  -192.000000,
  55.999271,
  49.000008,
  -192.000015,
  40.000744,
  49.000008,
  191.999985,
  -87.999252,
  49.000008,
  192.000000,
  -72.000732,
  49.000008,
  -192.000000,
  55.999271,
  -47.000183,
  -192.000000,
  87.999268,
  -50.999817,
  -192.000000,
  72.000717,
  49.000008,
  -192.000015,
  40.000744,
  -50.999817,
  191.999985,
  -55.999283,
  -47.000183,
  192.000000,
  -40.000744,
  -47.000183,
  -192.000000,
  87.999268,
  -50.999817,
  191.999985,
  -55.999283,
  49.000008,
  191.999985,
  -87.999252,
  -47.000183,
  192.000000,
  -40.000744
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.021669,
  0.975903,
  0.000000,
  0.963856,
  0.000000,
  0.000000,
  0.021669,
  0.012047,
  0.979124,
  0.975904,
  0.502402,
  1.000000,
  0.505157,
  0.987953,
  1.000000,
  0.963857,
  0.494810,
  0.024096,
  0.498422,
  0.036144,
  0.498422,
  1.000000,
  0.505157,
  0.024096,
  1.000000,
  0.000000,
  0.502402,
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
  0,
  9,
  3,
  0,
  10,
  9,
  7,
  11,
  6,
  7,
  12,
  11,
  5,
  11,
  13,
  5,
  6,
  11
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail3755637557(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3755637557Raw(): [Vector3[], Vector2[], number[]] {
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
