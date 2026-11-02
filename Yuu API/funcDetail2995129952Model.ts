import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  23.999231,
  126.001175,
  191.999985,
  8.001217,
  134.000534,
  191.999985,
  -23.999140,
  -2.000853,
  192.000000,
  -8.001307,
  -2.000854,
  191.999985,
  -8.001307,
  -130.000854,
  -191.999985,
  23.999231,
  -1.998817,
  -191.999985,
  8.001217,
  134.000534,
  191.999985,
  8.001217,
  6.000512,
  -191.999985,
  -23.999140,
  -130.000839,
  -192.000000,
  -23.999140,
  -2.000853,
  192.000000,
  8.001217,
  6.000512,
  -191.999985,
  -23.999140,
  -130.000839,
  -192.000000,
  23.999231,
  -1.998817,
  -191.999985,
  -8.001307,
  -130.000854,
  -191.999985
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  23.999231,
  191.999985,
  -126.001175,
  8.001217,
  191.999985,
  -134.000534,
  -23.999140,
  192.000000,
  2.000853,
  -8.001307,
  191.999985,
  2.000854,
  -8.001307,
  -191.999985,
  130.000854,
  23.999231,
  -191.999985,
  1.998817,
  8.001217,
  191.999985,
  -134.000534,
  8.001217,
  -191.999985,
  -6.000512,
  -23.999140,
  -192.000000,
  130.000839,
  -23.999140,
  192.000000,
  2.000853,
  8.001217,
  -191.999985,
  -6.000512,
  -23.999140,
  -192.000000,
  130.000839,
  23.999231,
  -191.999985,
  1.998817,
  -8.001307,
  -191.999985,
  130.000854
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.514079,
  0.005649,
  0.501855,
  0.000000,
  1.000000,
  0.096046,
  0.984722,
  0.096046,
  0.984722,
  1.000000,
  0.514079,
  0.909603,
  0.498198,
  0.000000,
  0.498198,
  0.903954,
  0.000000,
  1.000000,
  0.000000,
  0.096046,
  0.501855,
  0.903954,
  1.000000,
  1.000000,
  0.485026,
  0.909603,
  0.014433,
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
  0,
  4,
  3,
  0,
  5,
  4,
  6,
  8,
  7,
  6,
  9,
  8,
  0,
  10,
  5,
  0,
  1,
  10,
  3,
  11,
  2,
  3,
  4,
  11,
  12,
  8,
  13,
  12,
  7,
  8
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail2995129952(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail2995129952Raw(): [Vector3[], Vector2[], number[]] {
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
