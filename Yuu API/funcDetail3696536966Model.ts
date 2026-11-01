import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  15.999016,
  -64.000000,
  -114.000977,
  -0.000983,
  64.000000,
  -114.000977,
  -0.000983,
  64.000000,
  146.000977,
  15.999016,
  -64.000000,
  82.000977,
  15.999016,
  -64.000000,
  -114.000977,
  15.999016,
  -64.000000,
  82.000977,
  0.001000,
  -64.000000,
  82.000977,
  0.001000,
  -64.000000,
  -114.000977,
  -0.000983,
  64.000000,
  -114.000977,
  -15.999031,
  64.000000,
  -114.000977,
  -15.999030,
  64.000000,
  146.000977,
  -0.000983,
  64.000000,
  146.000977,
  15.999016,
  -64.000000,
  -114.000977,
  0.001000,
  -64.000000,
  -114.000977,
  -15.999031,
  64.000000,
  -114.000977,
  -0.000983,
  64.000000,
  -114.000977,
  -0.000983,
  64.000000,
  146.000977,
  -15.999030,
  64.000000,
  146.000977,
  0.001000,
  -64.000000,
  -114.000977,
  0.001000,
  -64.000000,
  82.000977,
  -15.999030,
  64.000000,
  146.000977,
  -15.999031,
  64.000000,
  -114.000977
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  15.999023,
  -130.000977,
  64.000000,
  -0.000975,
  -130.000977,
  -64.000000,
  -0.000976,
  130.000977,
  -64.000000,
  15.999023,
  66.000977,
  64.000000,
  15.999023,
  -130.000977,
  64.000000,
  15.999023,
  66.000977,
  64.000000,
  0.001007,
  66.000977,
  64.000000,
  0.001007,
  -130.000977,
  64.000000,
  -0.000975,
  -130.000977,
  -64.000000,
  -15.999023,
  -130.000977,
  -64.000000,
  -15.999022,
  130.000977,
  -64.000000,
  -0.000976,
  130.000977,
  -64.000000,
  15.999023,
  -130.000977,
  64.000000,
  0.001007,
  -130.000977,
  64.000000,
  -15.999023,
  -130.000977,
  -64.000000,
  -0.000975,
  -130.000977,
  -64.000000,
  -0.000976,
  130.000977,
  -64.000000,
  -15.999022,
  130.000977,
  -64.000000,
  0.001007,
  -130.000977,
  64.000000,
  0.001007,
  66.000977,
  64.000000,
  -15.999022,
  130.000977,
  -64.000000,
  -15.999023,
  -130.000977,
  -64.000000
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.818095,
  0.820974,
  0.411637,
  0.820974,
  0.411637,
  0.001726,
  0.818095,
  0.203386,
  0.840652,
  0.734077,
  0.821548,
  0.458545,
  0.871835,
  0.455058,
  0.890940,
  0.730590,
  0.944801,
  0.820974,
  0.894392,
  0.820974,
  0.894392,
  0.001726,
  0.944801,
  0.001726,
  0.948254,
  0.001726,
  0.998274,
  0.007979,
  0.998274,
  0.414437,
  0.948254,
  0.408184,
  0.840652,
  0.005213,
  0.890940,
  0.001726,
  0.001726,
  0.820974,
  0.001726,
  0.203386,
  0.408184,
  0.001726,
  0.408184,
  0.820974
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
  5,
  17,
  16,
  5,
  6,
  17,
  18,
  20,
  19,
  18,
  21,
  20
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail3696536966(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3696536966Raw(): [Vector3[], Vector2[], number[]] {
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
