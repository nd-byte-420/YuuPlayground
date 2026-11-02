import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -96.000000,
  -71.999008,
  -192.000000,
  -96.000000,
  -56.000977,
  -192.000000,
  96.000000,
  -56.000977,
  -192.000000,
  96.000000,
  -71.999008,
  -192.000000,
  -96.000000,
  56.000977,
  192.000000,
  96.000000,
  56.000977,
  192.000000,
  96.000000,
  71.999008,
  192.000000,
  -96.000000,
  71.999008,
  192.000000,
  -96.000000,
  -71.999008,
  -192.000000,
  96.000000,
  -71.999008,
  -192.000000,
  -96.000000,
  71.999008,
  192.000000,
  96.000000,
  71.999008,
  192.000000,
  -96.000000,
  -56.000977,
  -192.000000,
  96.000000,
  -56.000977,
  -192.000000
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -96.000000,
  -192.000000,
  71.999008,
  -96.000000,
  -192.000000,
  56.000977,
  96.000000,
  -192.000000,
  56.000977,
  96.000000,
  -192.000000,
  71.999008,
  -96.000000,
  192.000000,
  -56.000977,
  96.000000,
  192.000000,
  -56.000977,
  96.000000,
  192.000000,
  -71.999008,
  -96.000000,
  192.000000,
  -71.999008,
  -96.000000,
  -192.000000,
  71.999008,
  96.000000,
  -192.000000,
  71.999008,
  -96.000000,
  192.000000,
  -71.999008,
  96.000000,
  192.000000,
  -71.999008,
  -96.000000,
  -192.000000,
  56.000977,
  96.000000,
  -192.000000,
  56.000977
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.000000,
  1.000000,
  0.000000,
  0.987656,
  0.498543,
  0.987656,
  0.498543,
  1.000000,
  1.000000,
  0.012344,
  0.501457,
  0.012344,
  0.501457,
  0.000000,
  1.000000,
  0.000000,
  1.000000,
  1.000000,
  0.501457,
  1.000000,
  0.000000,
  0.000000,
  0.498543,
  0.000000,
  1.000000,
  0.987656,
  0.501457,
  0.987656
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
export function getFuncDetail5133051331(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail5133051331Raw(): [Vector3[], Vector2[], number[]] {
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
