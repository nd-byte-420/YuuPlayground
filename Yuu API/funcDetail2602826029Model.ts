import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -8.001253,
  6.000515,
  -192.000000,
  -8.001259,
  134.000534,
  192.000000,
  23.999067,
  -2.000856,
  192.000000,
  23.999067,
  -130.000854,
  -192.000000,
  -8.001253,
  6.000515,
  -192.000000,
  -23.999174,
  -1.998827,
  -192.000000,
  -23.999178,
  126.001198,
  192.000000,
  -8.001259,
  134.000534,
  192.000000,
  23.999067,
  -130.000854,
  -192.000000,
  23.999067,
  -2.000856,
  192.000000,
  8.001364,
  -2.000855,
  191.999985,
  8.001364,
  -130.000854,
  -191.999985,
  8.001364,
  -130.000854,
  -191.999985,
  -23.999174,
  -1.998827,
  -192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -8.001253,
  -192.000000,
  -6.000515,
  -8.001259,
  192.000000,
  -134.000534,
  23.999067,
  192.000000,
  2.000856,
  23.999067,
  -192.000000,
  130.000854,
  -8.001253,
  -192.000000,
  -6.000515,
  -23.999174,
  -192.000000,
  1.998827,
  -23.999178,
  192.000000,
  -126.001198,
  -8.001259,
  192.000000,
  -134.000534,
  23.999067,
  -192.000000,
  130.000854,
  23.999067,
  192.000000,
  2.000856,
  8.001364,
  191.999985,
  2.000855,
  8.001364,
  -191.999985,
  130.000854,
  8.001364,
  -191.999985,
  130.000854,
  -23.999174,
  -192.000000,
  1.998827
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.000000,
  0.903954,
  0.000000,
  0.000000,
  0.498198,
  0.096046,
  0.498198,
  1.000000,
  1.000000,
  0.903954,
  0.987776,
  0.909603,
  0.987776,
  0.005649,
  1.000000,
  0.000000,
  0.501855,
  1.000000,
  0.501855,
  0.096046,
  0.517133,
  0.096046,
  0.517133,
  1.000000,
  0.483765,
  1.000000,
  0.013172,
  0.909603
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
export function getFuncDetail2602826029(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail2602826029Raw(): [Vector3[], Vector2[], number[]] {
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
