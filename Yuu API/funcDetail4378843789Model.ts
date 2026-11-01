import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -48.000000,
  -15.995361,
  -1.996032,
  -48.000000,
  -15.995361,
  -6.001892,
  48.000000,
  0.004638,
  -6.001892,
  48.000000,
  0.004638,
  6.003967,
  48.000000,
  15.995360,
  13.999816,
  -48.000000,
  -0.004639,
  5.999817,
  -48.000000,
  -15.995361,
  -1.996032,
  -48.000000,
  -0.004639,
  5.999817,
  -48.000000,
  -0.004640,
  -6.001892,
  -48.000000,
  -15.995361,
  -6.001892,
  48.000000,
  0.004638,
  6.003967,
  48.000000,
  0.004638,
  -6.001892,
  48.000000,
  15.995361,
  -6.001892,
  48.000000,
  15.995360,
  13.999816,
  -48.000000,
  -15.995361,
  -6.001892,
  -48.000000,
  -0.004640,
  -6.001892,
  48.000000,
  15.995361,
  -6.001892,
  48.000000,
  0.004638,
  -6.001892,
  -48.000000,
  -0.004639,
  5.999817,
  48.000000,
  15.995360,
  13.999816,
  48.000000,
  15.995361,
  -6.001892,
  -48.000000,
  -0.004640,
  -6.001892
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -48.000000,
  -5.994994,
  15.995361,
  -48.000000,
  -10.000854,
  15.995361,
  48.000000,
  -10.000854,
  -0.004638,
  48.000000,
  2.005005,
  -0.004638,
  48.000000,
  10.000854,
  -15.995360,
  -48.000000,
  2.000855,
  0.004639,
  -48.000000,
  -5.994994,
  15.995361,
  -48.000000,
  2.000855,
  0.004639,
  -48.000000,
  -10.000854,
  0.004640,
  -48.000000,
  -10.000854,
  15.995361,
  48.000000,
  2.005005,
  -0.004638,
  48.000000,
  -10.000854,
  -0.004638,
  48.000000,
  -10.000854,
  -15.995361,
  48.000000,
  10.000854,
  -15.995360,
  -48.000000,
  -10.000854,
  15.995361,
  -48.000000,
  -10.000854,
  0.004640,
  48.000000,
  -10.000854,
  -15.995361,
  48.000000,
  -10.000854,
  -0.004638,
  -48.000000,
  2.000855,
  0.004639,
  48.000000,
  10.000854,
  -15.995360,
  48.000000,
  -10.000854,
  -15.995361,
  -48.000000,
  -10.000854,
  0.004640
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.340126,
  0.995602,
  0.322555,
  0.998222,
  0.322555,
  0.035767,
  0.375217,
  0.027917,
  0.550561,
  0.001778,
  0.515471,
  0.969464,
  0.795734,
  0.203672,
  0.875021,
  0.362236,
  0.756012,
  0.362236,
  0.756012,
  0.203672,
  0.914576,
  0.081065,
  0.914576,
  0.200115,
  0.756012,
  0.200115,
  0.756012,
  0.001778,
  0.318998,
  0.953714,
  0.160434,
  0.953714,
  0.001778,
  0.001778,
  0.160342,
  0.001778,
  0.673127,
  0.001778,
  0.752455,
  0.966845,
  0.554118,
  0.966845,
  0.554118,
  0.001778
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
  10,
  12,
  11,
  10,
  13,
  12,
  14,
  16,
  15,
  14,
  17,
  16,
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
export function getFuncDetail4378843789(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail4378843789Raw(): [Vector3[], Vector2[], number[]] {
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
