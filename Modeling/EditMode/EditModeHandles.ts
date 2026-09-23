import { Color } from "../../Yuu API/Basic Types/Color";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Entity } from "../../Yuu API/Entity";
import { spawnPrimitive } from "../../Yuu API/SpawnPrimitive";

// ─── Handle building ─────────────────────────────────────────────────────────

/**
 * Spawns all selection handles for the current EditMode state and populates
 * the editMode.handles array and editMode.handleMapping map.
 *
 * Call after clearing existing handles via clearHandles().
 */
export function buildHandles(editMode: any): void {
  if (!editMode.targetEntity || !editMode.active) return;

  const parentScale = editMode.targetEntity.scale;
  const sx = Math.max(0.001, parentScale.x);
  const sy = Math.max(0.001, parentScale.y);
  const sz = Math.max(0.001, parentScale.z);

  const handleScale    = new Vector3(0.025 / sx, 0.025 / sy, 0.025 / sz);
  const edgeHandleScale = new Vector3(0.02  / sx, 0.02  / sy, 0.02  / sz);
  const faceHandleScale = new Vector3(0.03  / sx, 0.03  / sy, 0.03  / sz);

  if (editMode.selectionMode === 'Vertex') {
    for (let j = 0; j < editMode.uniquePositions.length; j++) {
      const localPos  = editMode.uniquePositions[j];
      const isSelected = editMode.selectedUniqueVerts.has(j);
      const color     = isSelected ? new Color(1.0, 0.7, 0.0) : new Color(0.2, 0.6, 1.0);

      const handle = spawnPrimitive.sphere(
        8, 8, localPos, 1, Quaternion.one, color, 0.9,
        'Sphere', 'Static', editMode.targetEntity
      );
      handle.scale = handleScale;
      handle.rayClick.initialize(false);
      handle.rayClick.setClickFunction((hit: any) => editMode.onHandleClick(handle, hit));
      handle.rayClick.setHeldFunction((hit: any) => editMode.onHandleHeld(handle, hit));

      if (handle.nodeID) {
        editMode.handles.push(handle);
        editMode.handleMapping.set(handle.nodeID, { type: 'vertex', id: j });
      }
    }
  } else if (editMode.selectionMode === 'Edge') {
    const edges = editMode.getUniqueEdges();
    for (const edge of edges) {
      const pA = editMode.uniquePositions[edge.u];
      const pB = editMode.uniquePositions[edge.v];
      const midpoint = pA.add(pB).multiply(0.5);

      const isSelected = editMode.selectedEdges.has(edge.key);
      const color = isSelected ? new Color(1.0, 0.5, 0.0) : new Color(0.3, 0.3, 0.4);

      const handle = spawnPrimitive.sphere(
        8, 8, midpoint, 1, Quaternion.one, color, 0.9,
        'Sphere', 'Static', editMode.targetEntity
      );
      handle.scale = edgeHandleScale;
      handle.rayClick.initialize(false);
      handle.rayClick.setClickFunction((hit: any) => editMode.onHandleClick(handle, hit));
      handle.rayClick.setHeldFunction((hit: any) => editMode.onHandleHeld(handle, hit));

      if (handle.nodeID) {
        editMode.handles.push(handle);
        editMode.handleMapping.set(handle.nodeID, { type: 'edge', id: edge.key });
      }
    }
  } else if (editMode.selectionMode === 'Face') {
    const tris = editMode.targetEntity.mesh.triangles;
    for (let tIdx = 0; tIdx < tris.length / 3; tIdx++) {
      const u1 = editMode.uniqueIdMap[tris[3 * tIdx]];
      const u2 = editMode.uniqueIdMap[tris[3 * tIdx + 1]];
      const u3 = editMode.uniqueIdMap[tris[3 * tIdx + 2]];

      const p1 = editMode.uniquePositions[u1];
      const p2 = editMode.uniquePositions[u2];
      const p3 = editMode.uniquePositions[u3];
      const center = p1.add(p2).add(p3).multiply(1 / 3);

      const isSelected = editMode.selectedFaces.has(tIdx);
      const color = isSelected ? new Color(1.0, 0.8, 0.2) : new Color(0.0, 0.8, 0.5);

      const handle = spawnPrimitive.sphere(
        8, 8, center, 1, Quaternion.one, color, 0.9,
        'Sphere', 'Static', editMode.targetEntity
      );
      handle.scale = faceHandleScale;
      handle.rayClick.initialize(false);
      handle.rayClick.setClickFunction((hit: any) => editMode.onHandleClick(handle, hit));
      handle.rayClick.setHeldFunction((hit: any) => editMode.onHandleHeld(handle, hit));

      if (handle.nodeID) {
        editMode.handles.push(handle);
        editMode.handleMapping.set(handle.nodeID, { type: 'face', id: tIdx });
      }
    }
  }
}

/**
 * Destroys all spawned handles and resets state arrays.
 */
export function clearHandles(editMode: any): void {
  for (const h of editMode.handles) {
    h.destroy();
  }
  editMode.handles = [];
  editMode.handleMapping.clear();
}

/**
 * Full rebuild: clear existing handles, then respawn based on current selection.
 */
export function rebuildHandles(editMode: any): void {
  clearHandles(editMode);
  buildHandles(editMode);
}

/**
 * Update the local positions of existing handles to match current geometry,
 * without destroying and respawning them (cheaper than a full rebuild).
 */
export function updateHandleVisualPositions(editMode: any): void {
  if (!editMode.targetEntity || !editMode.active) return;

  for (const h of editMode.handles) {
    if (!h.nodeID) continue;
    const info = editMode.handleMapping.get(h.nodeID);
    if (!info) continue;

    if (info.type === 'vertex') {
      h.pos = editMode.uniquePositions[info.id];
    } else if (info.type === 'edge') {
      const parts = info.id.split(',').map(Number);
      const pA = editMode.uniquePositions[parts[0]];
      const pB = editMode.uniquePositions[parts[1]];
      h.pos = pA.add(pB).multiply(0.5);
    } else if (info.type === 'face') {
      const tris = editMode.targetEntity.mesh.triangles;
      const u1 = editMode.uniqueIdMap[tris[3 * info.id]];
      const u2 = editMode.uniqueIdMap[tris[3 * info.id + 1]];
      const u3 = editMode.uniqueIdMap[tris[3 * info.id + 2]];

      const p1 = editMode.uniquePositions[u1];
      const p2 = editMode.uniquePositions[u2];
      const p3 = editMode.uniquePositions[u3];
      h.pos = p1.add(p2).add(p3).multiply(1 / 3);
    }
  }
}
