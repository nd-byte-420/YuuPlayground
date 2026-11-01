import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";

// Raw vertex positions from FBX
const rawVerts = [
  -32.000000,
  -8.000976,
  -20.001284,
  -32.000000,
  -23.999025,
  -20.001284,
  -32.000000,
  -23.999023,
  8.001770,
  -32.000000,
  -8.000975,
  16.000795,
  32.000000,
  23.999023,
  -20.001284,
  32.000000,
  23.999027,
  32.000797,
  32.000000,
  8.000976,
  24.001770,
  32.000000,
  8.000976,
  -20.001284,
  -32.000000,
  -8.000976,
  -20.001284,
  32.000000,
  23.999023,
  -20.001284,
  32.000000,
  8.000976,
  -20.001284,
  -32.000000,
  -23.999025,
  -20.001284,
  32.000000,
  23.999027,
  32.000797,
  32.000000,
  23.999023,
  -20.001284,
  -32.000000,
  -23.999025,
  -20.001284,
  -32.000000,
  -23.999023,
  8.001770,
  -32.000000,
  -8.000975,
  16.000795,
  -32.000000,
  -23.999023,
  8.001770,
  32.000000,
  8.000976,
  24.001770,
  32.000000,
  23.999027,
  32.000797
];

// Transformed vertex positions (Rotated -90deg on X to be Y-up, and centered at origin)
const transformedVerts = [
  -32.000000,
  -26.001040,
  8.000977,
  -32.000000,
  -26.001040,
  23.999026,
  -32.000000,
  2.002013,
  23.999024,
  -32.000000,
  10.001039,
  8.000976,
  32.000000,
  -26.001040,
  -23.999022,
  32.000000,
  26.001040,
  -23.999026,
  32.000000,
  18.002013,
  -8.000975,
  32.000000,
  -26.001040,
  -8.000975,
  -32.000000,
  -26.001040,
  8.000977,
  32.000000,
  -26.001040,
  -23.999022,
  32.000000,
  -26.001040,
  -8.000975,
  -32.000000,
  -26.001040,
  23.999026,
  32.000000,
  26.001040,
  -23.999026,
  32.000000,
  -26.001040,
  -23.999022,
  -32.000000,
  -26.001040,
  23.999026,
  -32.000000,
  2.002013,
  23.999024,
  -32.000000,
  10.001039,
  8.000976,
  -32.000000,
  2.002013,
  23.999024,
  32.000000,
  18.002013,
  -8.000975,
  32.000000,
  26.001040,
  -23.999026
];

// Raw UV coordinates (flat array: u, v)
const rawUvs = [
  0.001526,
  0.051354,
  0.001526,
  0.001526,
  0.196554,
  0.001526,
  0.252263,
  0.051354,
  0.366748,
  0.001526,
  0.728916,
  0.001526,
  0.673207,
  0.051354,
  0.366748,
  0.051354,
  0.224390,
  0.998474,
  0.001526,
  0.552746,
  0.112945,
  0.552746,
  0.335809,
  0.998474,
  0.363695,
  0.549693,
  0.001526,
  0.549693,
  0.366748,
  0.549693,
  0.561775,
  0.549693,
  0.840702,
  0.512172,
  0.731969,
  0.572955,
  0.731969,
  0.062310,
  0.840702,
  0.001526
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
  0,
  12,
  3,
  0,
  13,
  12,
  14,
  6,
  7,
  14,
  15,
  6,
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
export function getFuncDetail4804948050(): [Vector3[], Vector2[], number[]] {
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
export function getFuncDetail4804948050Raw(): [Vector3[], Vector2[], number[]] {
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
