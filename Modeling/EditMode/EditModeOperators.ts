import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Vector2 } from "../../Yuu API/Basic Types/Vector2";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { rotateVector } from "../Core/MathUtils";

export function extrude(editMode: any) {
  if (!editMode.targetEntity || !editMode.active) return;
  const verts = editMode.targetEntity.mesh.verts;
  const uvs = editMode.targetEntity.mesh.uvs;
  const triangles = editMode.targetEntity.mesh.triangles;

  if (editMode.selectionMode === 'Face') {
    if (editMode.selectedFaces.size === 0) return;

    // Calculate average normal of selected faces to offset them along
    let avgNormal = Vector3.zero;
    for (const tIdx of editMode.selectedFaces) {
      const idxA = triangles[3 * tIdx];
      const idxB = triangles[3 * tIdx + 1];
      const idxC = triangles[3 * tIdx + 2];
      const vA = verts[idxA];
      const vB = verts[idxB];
      const vC = verts[idxC];
      const faceNorm = vB.subtract(vA).cross(vC.subtract(vA)).normalize();
      avgNormal = avgNormal.add(faceNorm);
    }
    avgNormal = avgNormal.normalize();

    // Find indices of vertices to duplicate
    const indicesToDuplicate = new Set<number>();
    for (const tIdx of editMode.selectedFaces) {
      indicesToDuplicate.add(triangles[3 * tIdx]);
      indicesToDuplicate.add(triangles[3 * tIdx + 1]);
      indicesToDuplicate.add(triangles[3 * tIdx + 2]);
    }

    const indexTranslationMap = new Map<number, number>();
    for (const idx of indicesToDuplicate) {
      const newIdx = verts.length;
      const newPos = verts[idx].add(avgNormal.multiply(0.2));
      verts.push(newPos);
      uvs.push(uvs[idx] ? uvs[idx].clone() : new Vector2(0.5, 0.5));
      indexTranslationMap.set(idx, newIdx);
    }

    // Count occurrences of each edge in the selected triangles (using unique vert IDs)
    const edgeCounts = new Map<string, { u: number, v: number, dir: [number, number], count: number }>();
    for (const tIdx of editMode.selectedFaces) {
      const idxA = triangles[3 * tIdx];
      const idxB = triangles[3 * tIdx + 1];
      const idxC = triangles[3 * tIdx + 2];

      const u = editMode.uniqueIdMap[idxA];
      const v = editMode.uniqueIdMap[idxB];
      const w = editMode.uniqueIdMap[idxC];

      const triEdges = [
        { idx1: idxA, idx2: idxB, uVal: u, vVal: v },
        { idx1: idxB, idx2: idxC, uVal: v, vVal: w },
        { idx1: idxC, idx2: idxA, uVal: w, vVal: u }
      ];

      for (const edge of triEdges) {
        const key = edge.uVal < edge.vVal ? `${edge.uVal},${edge.vVal}` : `${edge.vVal},${edge.uVal}`;
        const existing = edgeCounts.get(key);
        if (existing) {
          existing.count++;
        } else {
          edgeCounts.set(key, { u: edge.uVal, v: edge.vVal, dir: [edge.idx1, edge.idx2], count: 1 });
        }
      }
    }

    // Append side-wall quads for boundary edges (where edge count === 1)
    for (const [key, val] of edgeCounts.entries()) {
      if (val.count === 1) {
        const [origIdx1, origIdx2] = val.dir;
        const newIdx1 = indexTranslationMap.get(origIdx1)!;
        const newIdx2 = indexTranslationMap.get(origIdx2)!;

        // CCW triangle 1
        triangles.push(origIdx1, origIdx2, newIdx2);
        // CCW triangle 2
        triangles.push(origIdx1, newIdx2, newIdx1);
      }
    }

    // Re-route original extruded faces to the new cap indices
    const nextSelectedFaces = new Set<number>();
    for (const tIdx of editMode.selectedFaces) {
      triangles[3 * tIdx]     = indexTranslationMap.get(triangles[3 * tIdx])!;
      triangles[3 * tIdx + 1] = indexTranslationMap.get(triangles[3 * tIdx + 1])!;
      triangles[3 * tIdx + 2] = indexTranslationMap.get(triangles[3 * tIdx + 2])!;

      nextSelectedFaces.add(tIdx);
    }

    editMode.targetEntity.mesh.create(verts, uvs, triangles);

    editMode.selectedFaces = nextSelectedFaces;
    editMode.buildUniqueVertices();
    editMode.rebuildHandles();
  } else if (editMode.selectionMode === 'Edge') {
    if (editMode.selectedEdges.size === 0) return;

    const uniqVertices = new Set<number>();
    const edgesList: { u: number, v: number, key: string }[] = [];
    for (const edgeKey of editMode.selectedEdges) {
      const parts = edgeKey.split(',').map(Number);
      uniqVertices.add(parts[0]);
      uniqVertices.add(parts[1]);
      edgesList.push({ u: parts[0], v: parts[1], key: edgeKey });
    }

    // Get avg normal of adjacent faces
    let avgNormal = Vector3.zero;
    for (let i = 0; i < triangles.length; i += 3) {
      const u1 = editMode.uniqueIdMap[triangles[i]];
      const u2 = editMode.uniqueIdMap[triangles[i + 1]];
      const u3 = editMode.uniqueIdMap[triangles[i + 2]];

      let shares = 0;
      if (uniqVertices.has(u1)) shares++;
      if (uniqVertices.has(u2)) shares++;
      if (uniqVertices.has(u3)) shares++;

      if (shares >= 2) {
        const vA = verts[triangles[i]];
        const vB = verts[triangles[i + 1]];
        const vC = verts[triangles[i + 2]];
        const faceNorm = vB.subtract(vA).cross(vC.subtract(vA)).normalize();
        avgNormal = avgNormal.add(faceNorm);
      }
    }
    if (avgNormal.magnitude() > 0.001) {
      avgNormal = avgNormal.normalize();
    } else {
      avgNormal = Vector3.up; // default extrusion direction
    }

    const originalIndicesToDuplicate = new Set<number>();
    for (let i = 0; i < verts.length; i++) {
      if (uniqVertices.has(editMode.uniqueIdMap[i])) {
        originalIndicesToDuplicate.add(i);
      }
    }

    const indexTranslationMap = new Map<number, number>();
    for (const idx of originalIndicesToDuplicate) {
      const newIdx = verts.length;
      const newPos = verts[idx].add(avgNormal.multiply(0.2));
      verts.push(newPos);
      uvs.push(uvs[idx] ? uvs[idx].clone() : new Vector2(0.5, 0.5));
      indexTranslationMap.set(idx, newIdx);
    }

    for (const edge of edgesList) {
      let origIdxU = -1;
      let origIdxV = -1;
      for (let i = 0; i < verts.length; i++) {
        if (editMode.uniqueIdMap[i] === edge.u && origIdxU === -1) origIdxU = i;
        if (editMode.uniqueIdMap[i] === edge.v && origIdxV === -1) origIdxV = i;
      }

      if (origIdxU !== -1 && origIdxV !== -1) {
        const newIdxU = indexTranslationMap.get(origIdxU)!;
        const newIdxV = indexTranslationMap.get(origIdxV)!;

        // CCW triangle 1
        triangles.push(origIdxU, origIdxV, newIdxV);
        // CCW triangle 2
        triangles.push(origIdxU, newIdxV, newIdxU);
      }
    }

    editMode.targetEntity.mesh.create(verts, uvs, triangles);

    editMode.buildUniqueVertices();

    // Update selection to the new edges
    editMode.selectedEdges.clear();
    for (const edge of edgesList) {
      let origIdxU = -1;
      let origIdxV = -1;
      for (let i = 0; i < verts.length; i++) {
        if (editMode.uniqueIdMap[i] === edge.u && origIdxU === -1) origIdxU = i;
        if (editMode.uniqueIdMap[i] === edge.v && origIdxV === -1) origIdxV = i;
      }
      const newIdxU = indexTranslationMap.get(origIdxU)!;
      const newIdxV = indexTranslationMap.get(origIdxV)!;

      const newUniqU = editMode.uniqueIdMap[newIdxU];
      const newUniqV = editMode.uniqueIdMap[newIdxV];

      const minVal = Math.min(newUniqU, newUniqV);
      const maxVal = Math.max(newUniqU, newUniqV);
      editMode.selectedEdges.add(`${minVal},${maxVal}`);
    }

    editMode.rebuildHandles();
  }
}

export function deleteSelected(editMode: any) {
  if (!editMode.targetEntity || !editMode.active) return;
  const verts = editMode.targetEntity.mesh.verts;
  const uvs = editMode.targetEntity.mesh.uvs;
  const triangles = editMode.targetEntity.mesh.triangles;

  let facesToDelete = new Set<number>();

  if (editMode.selectionMode === 'Face') {
    facesToDelete = new Set(editMode.selectedFaces);
  } else if (editMode.selectionMode === 'Edge') {
    const selectedEdgesSet = new Set(editMode.selectedEdges);
    for (let tIdx = 0; tIdx < triangles.length / 3; tIdx++) {
      const u1 = editMode.uniqueIdMap[triangles[3 * tIdx]];
      const u2 = editMode.uniqueIdMap[triangles[3 * tIdx + 1]];
      const u3 = editMode.uniqueIdMap[triangles[3 * tIdx + 2]];

      const e1 = u1 < u2 ? `${u1},${u2}` : `${u2},${u1}`;
      const e2 = u2 < u3 ? `${u2},${u3}` : `${u3},${u2}`;
      const e3 = u3 < u1 ? `${u3},${u1}` : `${u1},${u3}`;

      if (selectedEdgesSet.has(e1) || selectedEdgesSet.has(e2) || selectedEdgesSet.has(e3)) {
        facesToDelete.add(tIdx);
      }
    }
  } else if (editMode.selectionMode === 'Vertex') {
    for (let tIdx = 0; tIdx < triangles.length / 3; tIdx++) {
      const u1 = editMode.uniqueIdMap[triangles[3 * tIdx]];
      const u2 = editMode.uniqueIdMap[triangles[3 * tIdx + 1]];
      const u3 = editMode.uniqueIdMap[triangles[3 * tIdx + 2]];

      if (editMode.selectedUniqueVerts.has(u1) || editMode.selectedUniqueVerts.has(u2) || editMode.selectedUniqueVerts.has(u3)) {
        facesToDelete.add(tIdx);
      }
    }
  }

  if (facesToDelete.size === 0) return;

  const nextTriangles: number[] = [];
  for (let tIdx = 0; tIdx < triangles.length / 3; tIdx++) {
    if (!facesToDelete.has(tIdx)) {
      nextTriangles.push(triangles[3 * tIdx], triangles[3 * tIdx + 1], triangles[3 * tIdx + 2]);
    }
  }

  // Clean up unreferenced vertices
  const referencedVerts = new Set<number>();
  for (const idx of nextTriangles) {
    referencedVerts.add(idx);
  }

  const nextVerts: Vector3[] = [];
  const nextUVs: Vector2[] = [];
  const indexMapping = new Map<number, number>();

  for (let i = 0; i < verts.length; i++) {
    if (referencedVerts.has(i)) {
      const newIdx = nextVerts.length;
      nextVerts.push(verts[i].clone());
      nextUVs.push(uvs[i] ? uvs[i].clone() : Vector2.zero);
      indexMapping.set(i, newIdx);
    }
  }

  const finalTriangles: number[] = [];
  for (const idx of nextTriangles) {
    finalTriangles.push(indexMapping.get(idx)!);
  }

  editMode.targetEntity.mesh.triangles = finalTriangles;
  editMode.targetEntity.mesh.create(nextVerts, nextUVs, finalTriangles);

  editMode.selectedUniqueVerts.clear();
  editMode.selectedEdges.clear();
  editMode.selectedFaces.clear();

  editMode.buildUniqueVertices();
  editMode.rebuildHandles();
}

export function mergeVertices(editMode: any) {
  if (!editMode.targetEntity || !editMode.active) return;
  if (editMode.selectedUniqueVerts.size < 2) return;

  const verts = editMode.targetEntity.mesh.verts;
  const uvs = editMode.targetEntity.mesh.uvs;
  const triangles = editMode.targetEntity.mesh.triangles;

  // Calculate center point
  let centerPos = Vector3.zero;
  for (const uIdx of editMode.selectedUniqueVerts) {
    centerPos = centerPos.add(editMode.uniquePositions[uIdx]);
  }
  centerPos = centerPos.multiply(1 / editMode.selectedUniqueVerts.size);

  // Pick first unique index as representative
  const repUniqIdx = Array.from(editMode.selectedUniqueVerts)[0] as number;
  let repMeshIdx = -1;
  for (let i = 0; i < verts.length; i++) {
    if (editMode.uniqueIdMap[i] === repUniqIdx) {
      repMeshIdx = i;
      break;
    }
  }
  if (repMeshIdx === -1) return;

  verts[repMeshIdx] = centerPos.clone();

  const mergedMeshIndices = new Set<number>();
  for (let i = 0; i < verts.length; i++) {
    const uniq = editMode.uniqueIdMap[i];
    if (editMode.selectedUniqueVerts.has(uniq) && uniq !== repUniqIdx) {
      mergedMeshIndices.add(i);
      verts[i] = centerPos.clone();
    }
  }

  const nextTriangles: number[] = [];
  for (let i = 0; i < triangles.length; i += 3) {
    let tA = triangles[i];
    let tB = triangles[i + 1];
    let tC = triangles[i + 2];

    if (mergedMeshIndices.has(tA)) tA = repMeshIdx;
    if (mergedMeshIndices.has(tB)) tB = repMeshIdx;
    if (mergedMeshIndices.has(tC)) tC = repMeshIdx;

    // Skip degenerate triangles
    if (tA !== tB && tB !== tC && tC !== tA) {
      nextTriangles.push(tA, tB, tC);
    }
  }

  editMode.targetEntity.mesh.triangles = nextTriangles;
  editMode.targetEntity.mesh.create(verts, uvs, nextTriangles);

  editMode.selectedUniqueVerts.clear();
  editMode.selectedUniqueVerts.add(repUniqIdx);

  editMode.buildUniqueVertices();
  editMode.rebuildHandles();
}

export function subdivide(editMode: any) {
  if (!editMode.targetEntity || !editMode.active) return;
  const verts = editMode.targetEntity.mesh.verts;
  const uvs = editMode.targetEntity.mesh.uvs;
  const triangles = editMode.targetEntity.mesh.triangles;

  if (editMode.selectionMode === 'Face') {
    if (editMode.selectedFaces.size === 0) return;

    const edgeMidpoints = new Map<string, number>();

    const getOrAddMidpoint = (idxA: number, idxB: number): number => {
      const u = editMode.uniqueIdMap[idxA];
      const v = editMode.uniqueIdMap[idxB];
      const key = u < v ? `${u},${v}` : `${v},${u}`;

      if (edgeMidpoints.has(key)) {
        return edgeMidpoints.get(key)!;
      }

      const midPos = verts[idxA].add(verts[idxB]).multiply(0.5);
      const uvA = uvs[idxA] || new Vector2(0.5, 0.5);
      const uvB = uvs[idxB] || new Vector2(0.5, 0.5);
      const midUV = new Vector2((uvA.x + uvB.x) * 0.5, (uvA.y + uvB.y) * 0.5);

      const midIdx = verts.length;
      verts.push(midPos);
      uvs.push(midUV);

      edgeMidpoints.set(key, midIdx);
      return midIdx;
    };

    const newTriangles: number[] = [];
    const subdividedFaceIndices = new Set<number>();

    for (let tIdx = 0; tIdx < triangles.length / 3; tIdx++) {
      const idxA = triangles[3 * tIdx];
      const idxB = triangles[3 * tIdx + 1];
      const idxC = triangles[3 * tIdx + 2];

      if (editMode.selectedFaces.has(tIdx)) {
        const midAB = getOrAddMidpoint(idxA, idxB);
        const midBC = getOrAddMidpoint(idxB, idxC);
        const midCA = getOrAddMidpoint(idxC, idxA);

        // CCW 4 triangles:
        newTriangles.push(idxA, midAB, midCA);
        newTriangles.push(idxB, midBC, midAB);
        newTriangles.push(idxC, midCA, midBC);
        newTriangles.push(midAB, midBC, midCA);

        const baseIdx = newTriangles.length / 3 - 4;
        subdividedFaceIndices.add(baseIdx);
        subdividedFaceIndices.add(baseIdx + 1);
        subdividedFaceIndices.add(baseIdx + 2);
        subdividedFaceIndices.add(baseIdx + 3);
      } else {
        newTriangles.push(idxA, idxB, idxC);
      }
    }

    editMode.targetEntity.mesh.triangles = newTriangles;
    editMode.targetEntity.mesh.create(verts, uvs, newTriangles);

    editMode.selectedFaces = subdividedFaceIndices;
    editMode.buildUniqueVertices();
    editMode.rebuildHandles();
  }
}

export function createFace(editMode: any) {
  if (!editMode.targetEntity || !editMode.active) return;
  const verts = editMode.targetEntity.mesh.verts;
  const uvs = editMode.targetEntity.mesh.uvs;
  const triangles = editMode.targetEntity.mesh.triangles;

  if (editMode.selectedUniqueVerts.size < 3) return;

  const selectedList = Array.from(editMode.selectedUniqueVerts) as number[];
  const N = selectedList.length;

  const meshIndices: number[] = [];
  for (const uVal of selectedList) {
    let foundIdx = -1;
    for (let i = 0; i < verts.length; i++) {
      if (editMode.uniqueIdMap[i] === uVal) {
        foundIdx = i;
        break;
      }
    }
    if (foundIdx !== -1) {
      meshIndices.push(foundIdx);
    }
  }

  if (meshIndices.length < 3) return;

  // Compute center
  let center = Vector3.zero;
  for (const idx of meshIndices) {
    center = center.add(verts[idx]);
  }
  center = center.multiply(1 / N);

  // Compute approximate normal
  const v0 = verts[meshIndices[0]];
  const v1 = verts[meshIndices[1]];
  const v2 = verts[meshIndices[2]];
  let normal = v1.subtract(v0).cross(v2.subtract(v0));
  if (normal.magnitude() < 0.001) {
    normal = Vector3.up;
  } else {
    normal = normal.normalize();
  }

  // Define 2D basis vectors on the plane
  const uBasis = v1.subtract(v0).normalize();
  const vBasis = normal.cross(uBasis).normalize();

  // Sort mesh indices by angle around center to maintain consistent CCW/CW loop
  const sortedIndices = meshIndices.map(idx => {
    const rel = verts[idx].subtract(center);
    const x = rel.dot(uBasis);
    const y = rel.dot(vBasis);
    const angle = Math.atan2(y, x);
    return { idx, angle };
  });

  sortedIndices.sort((a, b) => a.angle - b.angle);

  // Add triangles (polygon fan)
  const baseIdx = triangles.length / 3;
  const nextSelectedFaces = new Set<number>();

  for (let i = 1; i < N - 1; i++) {
    triangles.push(sortedIndices[0].idx, sortedIndices[i].idx, sortedIndices[i + 1].idx);
    nextSelectedFaces.add(baseIdx + i - 1);
  }

  // Rebuild mesh and collider
  editMode.targetEntity.mesh.create(verts, uvs, triangles);
  editMode.targetEntity.collider.createFromMeshNode(editMode.targetEntity.mesh.nodeID!, 'Convex');

  // Select the new face
  editMode.selectionMode = 'Face';
  editMode.selectedFaces = nextSelectedFaces;
  editMode.selectedUniqueVerts.clear();
  editMode.selectedEdges.clear();

  editMode.buildUniqueVertices();
  editMode.rebuildHandles();
}

export function duplicateSelected(editMode: any) {
  if (!editMode.targetEntity || !editMode.active) return;
  const verts = editMode.targetEntity.mesh.verts;
  const uvs = editMode.targetEntity.mesh.uvs;
  const triangles = editMode.targetEntity.mesh.triangles;

  if (editMode.selectionMode !== 'Vertex' || editMode.selectedUniqueVerts.size === 0) return;

  const selectedList = Array.from(editMode.selectedUniqueVerts) as number[];
  const indicesToDuplicate = [];
  for (const uVal of selectedList) {
    for (let i = 0; i < verts.length; i++) {
      if (editMode.uniqueIdMap[i] === uVal) {
        indicesToDuplicate.push(i);
      }
    }
  }

  if (indicesToDuplicate.length === 0) return;

  const originalCount = verts.length;

  for (const idx of indicesToDuplicate) {
    const newPos = verts[idx].add(new Vector3(0.1, 0.1, 0));
    verts.push(newPos);
    uvs.push(uvs[idx] ? uvs[idx].clone() : new Vector2(0.5, 0.5));
  }

  editMode.targetEntity.mesh.create(verts, uvs, triangles);
  editMode.targetEntity.collider.createFromMeshNode(editMode.targetEntity.mesh.nodeID!, 'Convex');

  editMode.buildUniqueVertices();

  editMode.selectedUniqueVerts.clear();
  for (let i = originalCount; i < verts.length; i++) {
    editMode.selectedUniqueVerts.add(editMode.uniqueIdMap[i]);
  }

  editMode.rebuildHandles();
}

export function translateSelected(editMode: any, offset: Vector3) {
  if (!editMode.targetEntity || !editMode.active) return;
  const vertsToMove = editMode.getSelectedUniqueVertexIndices();
  if (vertsToMove.size === 0) return;

  for (const vIdx of vertsToMove) {
    editMode.uniquePositions[vIdx] = editMode.uniquePositions[vIdx].add(offset);
  }

  editMode.rebuildMeshFromUniquePositions();
}

export function rotateSelected(editMode: any, eulerOffset: Vector3) {
  if (!editMode.targetEntity || !editMode.active) return;
  const vertsToMove = editMode.getSelectedUniqueVertexIndices();
  if (vertsToMove.size === 0) return;

  const center = editMode.getSelectedVerticesCenter();
  const q = Quaternion.fromEuler(eulerOffset);

  for (const vIdx of vertsToMove) {
    const relPos = editMode.uniquePositions[vIdx].subtract(center);
    const rotatedRel = rotateVector(relPos, q);
    editMode.uniquePositions[vIdx] = center.add(rotatedRel);
  }

  editMode.rebuildMeshFromUniquePositions();
}

export function scaleSelected(editMode: any, delta: Vector3) {
  if (!editMode.targetEntity || !editMode.active) return;
  const vertsToMove = editMode.getSelectedUniqueVertexIndices();
  if (vertsToMove.size === 0) return;

  const center = editMode.getSelectedVerticesCenter();

  for (const vIdx of vertsToMove) {
    const relPos = editMode.uniquePositions[vIdx].subtract(center);
    const scaledRel = new Vector3(
      relPos.x * (1 + delta.x),
      relPos.y * (1 + delta.y),
      relPos.z * (1 + delta.z)
    );
    editMode.uniquePositions[vIdx] = center.add(scaledRel);
  }

  editMode.rebuildMeshFromUniquePositions();
}

export function handleKeyboardInput(editMode: any, target: string, value: number) {
  if (!editMode.targetEntity || !editMode.active) return;
  const vertsToMove = editMode.getSelectedUniqueVertexIndices();
  if (vertsToMove.size === 0) return;

  const center = editMode.getSelectedVerticesCenter();

  if (target === 'PosX') {
    const deltaX = value - center.x;
    translateSelected(editMode, new Vector3(deltaX, 0, 0));
  } else if (target === 'PosY') {
    const deltaY = value - center.y;
    translateSelected(editMode, new Vector3(0, deltaY, 0));
  } else if (target === 'PosZ') {
    const deltaZ = value - center.z;
    translateSelected(editMode, new Vector3(0, 0, deltaZ));
  } else if (target === 'ScaleX') {
    for (const vIdx of vertsToMove) {
      const relPos = editMode.uniquePositions[vIdx].subtract(center);
      editMode.uniquePositions[vIdx] = new Vector3(center.x + relPos.x * value, editMode.uniquePositions[vIdx].y, editMode.uniquePositions[vIdx].z);
    }
    editMode.rebuildMeshFromUniquePositions();
  } else if (target === 'ScaleY') {
    for (const vIdx of vertsToMove) {
      const relPos = editMode.uniquePositions[vIdx].subtract(center);
      editMode.uniquePositions[vIdx] = new Vector3(editMode.uniquePositions[vIdx].x, center.y + relPos.y * value, editMode.uniquePositions[vIdx].z);
    }
    editMode.rebuildMeshFromUniquePositions();
  } else if (target === 'ScaleZ') {
    for (const vIdx of vertsToMove) {
      const relPos = editMode.uniquePositions[vIdx].subtract(center);
      editMode.uniquePositions[vIdx] = new Vector3(editMode.uniquePositions[vIdx].x, editMode.uniquePositions[vIdx].y, center.z + relPos.z * value);
    }
    editMode.rebuildMeshFromUniquePositions();
  } else if (target.startsWith('Rot')) {
    const rad = value * (Math.PI / 180);
    let rotationQuat = Quaternion.one;
    if (target === 'RotX') rotationQuat = Quaternion.fromEuler(new Vector3(rad, 0, 0));
    else if (target === 'RotY') rotationQuat = Quaternion.fromEuler(new Vector3(0, rad, 0));
    else if (target === 'RotZ') rotationQuat = Quaternion.fromEuler(new Vector3(0, 0, rad));

    for (const vIdx of vertsToMove) {
      const relPos = editMode.uniquePositions[vIdx].subtract(center);
      const rotatedRel = rotateVector(relPos, rotationQuat);
      editMode.uniquePositions[vIdx] = center.add(rotatedRel);
    }
    editMode.rebuildMeshFromUniquePositions();
  }
}
