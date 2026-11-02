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
  15.995361,
  -6.001892,
  48.000000,
  15.995361,
  -6.001892,
  48.000000,
  0.004638,
  -6.001892,
  48.000000,
  15.995360,
  13.999816
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -48.000000,
  -1.996032,
  15.995361,
  -48.000000,
  -6.001892,
  15.995361,
  48.000000,
  -6.001892,
  -0.004638,
  48.000000,
  6.003967,
  -0.004638,
  48.000000,
  13.999816,
  -15.995360,
  -48.000000,
  5.999817,
  0.004639,
  -48.000000,
  -1.996032,
  15.995361,
  -48.000000,
  5.999817,
  0.004639,
  -48.000000,
  -6.001892,
  0.004640,
  -48.000000,
  -6.001892,
  15.995361,
  48.000000,
  -6.001892,
  -15.995361,
  48.000000,
  -6.001892,
  -15.995361,
  48.000000,
  -6.001892,
  -0.004638,
  48.000000,
  13.999816,
  -15.995360
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.615488,
  0.997372,
  0.583382,
  1.000000,
  0.583382,
  0.034110,
  0.679606,
  0.026232,
  1.000000,
  0.000000,
  0.935882,
  0.971140,
  0.579632,
  0.955334,
  0.289900,
  0.955334,
  0.289900,
  0.955334,
  0.579632,
  0.955334,
  0.839690,
  0.013124,
  0.000000,
  0.000000,
  0.289732,
  0.000000,
  0.000000,
  0.000000
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
  3,
  10,
  2,
  3,
  4,
  10,
  9,
  11,
  8,
  9,
  12,
  11,
  7,
  11,
  13,
  7,
  8,
  11
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
