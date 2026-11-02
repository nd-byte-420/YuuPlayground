import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  37.999355,
  -38.000175,
  -192.000000,
  -25.999563,
  -101.999313,
  -192.000000,
  -41.999451,
  -93.999832,
  -192.000000,
  29.999649,
  -22.000702,
  -192.000000,
  37.999352,
  89.999825,
  192.000000,
  29.999647,
  105.999298,
  192.000000,
  -41.999443,
  34.000175,
  192.000000,
  -25.999552,
  26.000700,
  192.000000,
  37.999355,
  -38.000175,
  -192.000000,
  -25.999563,
  -101.999313,
  -192.000000,
  -41.999443,
  34.000175,
  192.000000,
  29.999647,
  105.999298,
  192.000000,
  29.999649,
  -22.000702,
  -192.000000,
  -41.999451,
  -93.999832,
  -192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  37.999355,
  -192.000000,
  38.000175,
  -25.999563,
  -192.000000,
  101.999313,
  -41.999451,
  -192.000000,
  93.999832,
  29.999649,
  -192.000000,
  22.000702,
  37.999352,
  192.000000,
  -89.999825,
  29.999647,
  192.000000,
  -105.999298,
  -41.999443,
  192.000000,
  -34.000175,
  -25.999552,
  192.000000,
  -26.000700,
  37.999355,
  -192.000000,
  38.000175,
  -25.999563,
  -192.000000,
  101.999313,
  -41.999443,
  192.000000,
  -34.000175,
  29.999647,
  192.000000,
  -105.999298,
  29.999649,
  -192.000000,
  22.000702,
  -41.999451,
  -192.000000,
  93.999832
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.474632,
  0.952942,
  0.032032,
  1.000000,
  0.000000,
  0.994118,
  0.497927,
  0.941177,
  0.525368,
  0.011764,
  0.502073,
  0.000000,
  1.000000,
  0.052941,
  0.967968,
  0.058823,
  0.525368,
  0.952942,
  0.967968,
  1.000000,
  0.000000,
  0.052941,
  0.497927,
  0.000000,
  0.502073,
  0.941177,
  1.000000,
  0.994118
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
  7,
  4,
  8,
  9,
  7,
  3,
  10,
  2,
  3,
  11,
  10,
  8,
  5,
  12,
  8,
  4,
  5,
  9,
  6,
  7,
  9,
  13,
  6
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail4663646637(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail4663646637Raw(): [Vector3[], Vector2[], number[]] {
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
