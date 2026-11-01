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
  -8.001253,
  6.000515,
  -192.000000,
  23.999067,
  -130.000854,
  -192.000000,
  8.001364,
  -130.000854,
  -191.999985,
  -23.999174,
  -1.998827,
  -192.000000,
  -8.001259,
  134.000534,
  192.000000,
  -23.999178,
  126.001198,
  192.000000,
  8.001364,
  -2.000855,
  191.999985,
  23.999067,
  -2.000856,
  192.000000,
  -23.999174,
  -1.998827,
  -192.000000,
  8.001364,
  -130.000854,
  -191.999985,
  8.001364,
  -2.000855,
  191.999985,
  -23.999178,
  126.001198,
  192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -8.001198,
  -192.000000,
  -4.000675,
  -8.001204,
  192.000000,
  -132.000694,
  23.999123,
  192.000000,
  4.000696,
  23.999123,
  -192.000000,
  132.000694,
  -8.001198,
  -192.000000,
  -4.000675,
  -23.999119,
  -192.000000,
  3.998667,
  -23.999123,
  192.000000,
  -124.001358,
  -8.001204,
  192.000000,
  -132.000694,
  23.999123,
  -192.000000,
  132.000694,
  23.999123,
  192.000000,
  4.000696,
  8.001419,
  191.999985,
  4.000695,
  8.001419,
  -191.999985,
  132.000694,
  -8.001198,
  -192.000000,
  -4.000675,
  23.999123,
  -192.000000,
  132.000694,
  8.001419,
  -191.999985,
  132.000694,
  -23.999119,
  -192.000000,
  3.998667,
  -8.001204,
  192.000000,
  -132.000694,
  -23.999123,
  192.000000,
  -124.001358,
  8.001419,
  191.999985,
  4.000695,
  23.999123,
  192.000000,
  4.000696,
  -23.999119,
  -192.000000,
  3.998667,
  8.001419,
  -191.999985,
  132.000694,
  8.001419,
  191.999985,
  4.000695,
  -23.999123,
  192.000000,
  -124.001358
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.001657,
  0.902615,
  0.001657,
  0.001657,
  0.297542,
  0.097385,
  0.297542,
  0.998343,
  0.623101,
  0.902615,
  0.583689,
  0.908246,
  0.583689,
  0.007288,
  0.623101,
  0.001657,
  0.626415,
  0.902615,
  0.626415,
  0.001657,
  0.662024,
  0.001657,
  0.662024,
  0.902615,
  0.665338,
  0.312642,
  0.665338,
  0.001657,
  0.700000,
  0.009813,
  0.704078,
  0.303465,
  0.704078,
  0.626940,
  0.665338,
  0.617764,
  0.669416,
  0.324111,
  0.704078,
  0.315956,
  0.580375,
  0.902615,
  0.300856,
  0.992712,
  0.300856,
  0.091754,
  0.580375,
  0.001657
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
