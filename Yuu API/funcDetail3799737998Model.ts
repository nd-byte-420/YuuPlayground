import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -37.999527,
  -38.000038,
  -192.000000,
  -29.999702,
  -22.000570,
  -192.000000,
  41.999363,
  -93.999870,
  -192.000000,
  25.999886,
  -101.999512,
  -192.000000,
  -37.999531,
  89.999947,
  192.000000,
  25.999872,
  26.000488,
  192.000000,
  41.999340,
  34.000130,
  192.000000,
  -29.999702,
  105.999428,
  192.000000,
  -37.999527,
  -38.000038,
  -192.000000,
  25.999886,
  -101.999512,
  -192.000000,
  -29.999702,
  105.999428,
  192.000000,
  41.999340,
  34.000130,
  192.000000,
  -29.999702,
  -22.000570,
  -192.000000,
  41.999363,
  -93.999870,
  -192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -37.999527,
  -192.000000,
  38.000038,
  -29.999702,
  -192.000000,
  22.000570,
  41.999363,
  -192.000000,
  93.999870,
  25.999886,
  -192.000000,
  101.999512,
  -37.999531,
  192.000000,
  -89.999947,
  25.999872,
  192.000000,
  -26.000488,
  41.999340,
  192.000000,
  -34.000130,
  -29.999702,
  192.000000,
  -105.999428,
  -37.999527,
  -192.000000,
  38.000038,
  25.999886,
  -192.000000,
  101.999512,
  -29.999702,
  192.000000,
  -105.999428,
  41.999340,
  192.000000,
  -34.000130,
  -29.999702,
  -192.000000,
  22.000570,
  41.999363,
  -192.000000,
  93.999870
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.525367,
  0.952942,
  0.502073,
  0.941177,
  1.000000,
  0.994118,
  0.967970,
  1.000000,
  0.474633,
  0.011764,
  0.032030,
  0.058823,
  0.000000,
  0.052941,
  0.497927,
  0.000000,
  0.474633,
  0.952942,
  0.032030,
  1.000000,
  0.502073,
  0.000000,
  1.000000,
  0.052941,
  0.497927,
  0.941177,
  0.000000,
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
  5,
  9,
  8,
  4,
  5,
  1,
  11,
  10,
  1,
  2,
  11,
  8,
  7,
  4,
  8,
  12,
  7,
  9,
  6,
  13,
  9,
  5,
  6
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail3799737998(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3799737998Raw(): [Vector3[], Vector2[], number[]] {
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
