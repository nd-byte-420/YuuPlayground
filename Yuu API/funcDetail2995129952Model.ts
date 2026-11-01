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
  23.999231,
  126.001175,
  191.999985,
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
  23.999231,
  126.001175,
  191.999985,
  23.999231,
  -1.998817,
  -191.999985,
  8.001217,
  6.000512,
  -191.999985,
  8.001217,
  134.000534,
  191.999985,
  -8.001307,
  -2.000854,
  191.999985,
  -23.999140,
  -2.000853,
  192.000000,
  -23.999140,
  -130.000839,
  -192.000000,
  -8.001307,
  -130.000854,
  -191.999985,
  23.999231,
  -1.998817,
  -191.999985,
  -8.001307,
  -130.000854,
  -191.999985,
  -23.999140,
  -130.000839,
  -192.000000,
  8.001217,
  6.000512,
  -191.999985
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  23.999186,
  191.999985,
  -124.001335,
  8.001171,
  191.999985,
  -132.000694,
  -23.999186,
  192.000000,
  4.000692,
  -8.001353,
  191.999985,
  4.000694,
  23.999186,
  191.999985,
  -124.001335,
  -8.001353,
  191.999985,
  4.000694,
  -8.001353,
  -191.999985,
  132.000694,
  23.999186,
  -191.999985,
  3.998657,
  8.001171,
  191.999985,
  -132.000694,
  8.001171,
  -191.999985,
  -4.000672,
  -23.999186,
  -192.000000,
  132.000679,
  -23.999186,
  192.000000,
  4.000692,
  23.999186,
  191.999985,
  -124.001335,
  23.999186,
  -191.999985,
  3.998657,
  8.001171,
  -191.999985,
  -4.000672,
  8.001171,
  191.999985,
  -132.000694,
  -8.001353,
  191.999985,
  4.000694,
  -23.999186,
  192.000000,
  4.000692,
  -23.999186,
  -192.000000,
  132.000679,
  -8.001353,
  -191.999985,
  132.000694,
  23.999186,
  -191.999985,
  3.998657,
  -8.001353,
  -191.999985,
  132.000694,
  -23.999186,
  -192.000000,
  132.000679,
  8.001171,
  -191.999985,
  -4.000672
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.704079,
  0.303466,
  0.665338,
  0.312642,
  0.665338,
  0.001657,
  0.700001,
  0.009813,
  0.300856,
  0.001657,
  0.580375,
  0.091754,
  0.580375,
  0.992712,
  0.300856,
  0.902615,
  0.297542,
  0.001657,
  0.297542,
  0.902615,
  0.001657,
  0.998343,
  0.001657,
  0.097385,
  0.623102,
  0.007288,
  0.623102,
  0.908246,
  0.583689,
  0.902615,
  0.583689,
  0.001657,
  0.626416,
  0.001657,
  0.662024,
  0.001657,
  0.662024,
  0.902615,
  0.626416,
  0.902615,
  0.665338,
  0.617764,
  0.669417,
  0.324112,
  0.704079,
  0.315956,
  0.704079,
  0.626940
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
  12,
  14,
  13,
  12,
  15,
  14,
  16,
  18,
  17,
  16,
  19,
  18,
  20,
  22,
  21,
  20,
  23,
  22
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
