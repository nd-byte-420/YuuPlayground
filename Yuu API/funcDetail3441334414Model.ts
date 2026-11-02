import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -8.000000,
  -311.999176,
  -205.600388,
  -8.000000,
  -311.999176,
  54.401554,
  -8.000001,
  -64.002350,
  178.399612,
  -8.000000,
  408.000336,
  178.399612,
  -8.000000,
  280.000336,
  -205.600388,
  8.000000,
  -311.999176,
  -205.600388,
  8.000000,
  280.000336,
  -205.600388,
  8.000000,
  408.000336,
  178.399612,
  8.000000,
  -64.002350,
  178.399612,
  8.000000,
  -311.999176,
  54.401554,
  8.000000,
  -311.999176,
  -205.600388,
  8.000000,
  -311.999176,
  54.401554,
  8.000000,
  280.000336,
  -205.600388,
  -8.000001,
  -64.002350,
  178.399612,
  -8.000000,
  408.000336,
  178.399612,
  -8.000000,
  -311.999176,
  54.401554,
  -8.000000,
  280.000336,
  -205.600388
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -8.000000,
  -205.600388,
  311.999176,
  -8.000000,
  54.401554,
  311.999176,
  -8.000001,
  178.399612,
  64.002350,
  -8.000000,
  178.399612,
  -408.000336,
  -8.000000,
  -205.600388,
  -280.000336,
  8.000000,
  -205.600388,
  311.999176,
  8.000000,
  -205.600388,
  -280.000336,
  8.000000,
  178.399612,
  -408.000336,
  8.000000,
  178.399612,
  64.002350,
  8.000000,
  54.401554,
  311.999176,
  8.000000,
  -205.600388,
  311.999176,
  8.000000,
  54.401554,
  311.999176,
  8.000000,
  -205.600388,
  -280.000336,
  -8.000001,
  178.399612,
  64.002350,
  -8.000000,
  178.399612,
  -408.000336,
  -8.000000,
  54.401554,
  311.999176,
  -8.000000,
  -205.600388,
  -280.000336
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  1.000000,
  1.000000,
  0.662380,
  1.000000,
  0.501366,
  0.655560,
  0.501366,
  0.000000,
  1.000000,
  0.177778,
  0.498634,
  0.000000,
  0.498634,
  0.822222,
  0.000000,
  1.000000,
  0.000000,
  0.344440,
  0.161015,
  0.000000,
  1.000000,
  1.000000,
  0.662380,
  1.000000,
  1.000000,
  0.177778,
  0.000000,
  0.344440,
  0.000000,
  1.000000,
  0.161015,
  0.000000,
  0.498634,
  0.822222
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
  5,
  7,
  6,
  5,
  8,
  7,
  5,
  9,
  8,
  0,
  11,
  10,
  0,
  1,
  11,
  0,
  12,
  4,
  0,
  10,
  12,
  13,
  7,
  8,
  13,
  14,
  7,
  15,
  8,
  9,
  15,
  13,
  8,
  16,
  7,
  14,
  16,
  6,
  7
];

let cachedModel: [Vector3[], Vector2[], number[]] | undefined;
let cachedRawModel: [Vector3[], Vector2[], number[]] | undefined;

/**
 * Returns the parsed model data [Vector3[], Vector2[], number[]]
 * rotated to be Y-up and centered at the origin.
 */
export function getFuncDetail3441334414(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail3441334414Raw(): [Vector3[], Vector2[], number[]] {
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
