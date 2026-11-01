import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  35.999054,
  -28.001219,
  -33.001247,
  35.999054,
  -28.001219,
  19.000677,
  35.999054,
  -43.996826,
  11.002894,
  35.999054,
  -43.996834,
  -33.001244,
  -28.001131,
  35.999023,
  -33.001247,
  -43.996979,
  35.999023,
  -33.001247,
  -43.996983,
  35.999027,
  51.000706,
  -28.001133,
  35.999027,
  51.000713,
  35.999054,
  -28.001219,
  -33.001247,
  35.999054,
  -43.996834,
  -33.001244,
  -43.996979,
  35.999023,
  -33.001247,
  -28.001131,
  35.999023,
  -33.001247,
  35.999054,
  -28.001219,
  19.000677,
  -28.001133,
  35.999027,
  51.000713,
  -43.996983,
  35.999027,
  51.000706,
  35.999054,
  -43.996826,
  11.002894,
  35.999054,
  -43.996834,
  -33.001244,
  35.999054,
  -43.996826,
  11.002894,
  -43.996983,
  35.999027,
  51.000706,
  -43.996979,
  35.999023,
  -33.001247
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  39.998018,
  -42.000980,
  24.002316,
  39.998018,
  10.000944,
  24.002316,
  39.998018,
  2.003161,
  39.997923,
  39.998018,
  -42.000977,
  39.997931,
  -24.002167,
  -42.000980,
  -39.997927,
  -39.998014,
  -42.000980,
  -39.997927,
  -39.998018,
  42.000973,
  -39.997931,
  -24.002169,
  42.000980,
  -39.997931,
  39.998018,
  -42.000980,
  24.002316,
  39.998018,
  -42.000977,
  39.997931,
  -39.998014,
  -42.000980,
  -39.997927,
  -24.002167,
  -42.000980,
  -39.997927,
  39.998018,
  10.000944,
  24.002316,
  -24.002169,
  42.000980,
  -39.997931,
  -39.998018,
  42.000973,
  -39.997931,
  39.998018,
  2.003161,
  39.997923,
  39.998018,
  -42.000977,
  39.997931,
  39.998018,
  2.003161,
  39.997923,
  -39.998018,
  42.000973,
  -39.997931,
  -39.998014,
  -42.000980,
  -39.997927
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.001389,
  0.527905,
  0.270291,
  0.527905,
  0.228935,
  0.586392,
  0.001389,
  0.586392,
  0.001389,
  0.059877,
  0.001389,
  0.001389,
  0.435764,
  0.001389,
  0.435764,
  0.059877,
  0.940124,
  0.059876,
  0.998611,
  0.001389,
  0.998611,
  0.586392,
  0.940123,
  0.527904,
  0.875695,
  0.552951,
  0.875694,
  0.056532,
  0.937346,
  0.001389,
  0.937346,
  0.621878,
  0.438541,
  0.001389,
  0.666087,
  0.001389,
  0.872916,
  0.586392,
  0.438541,
  0.586392
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
  0,
  7,
  4,
  0,
  1,
  7,
  16,
  18,
  17,
  16,
  19,
  18
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail3904839049(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3904839049Raw(): [Vector3[], Vector2[], number[]] {
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
