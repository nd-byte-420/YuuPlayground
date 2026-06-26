import { Color } from "../Yuu API/Basic Types/Color";
import { Quaternion } from "../Yuu API/Basic Types/Quaternion";
import { Vector3 } from "../Yuu API/Basic Types/Vector3";
import { Entity } from "../Yuu API/Entity";
import { spawnPrimitive } from "../Yuu API/SpawnPrimitive";
import { Raycast, RayHit } from "../Yuu API/Raycast";
import { Player } from "../Yuu API/Player";
import { Controller } from "../Yuu API/Controller";
import { ModelingTool } from "./Core/ModelingTool";
import { EditMode } from "./EditMode/EditMode";

export const SelectionTools = {
  // Visual indicators
  selectionBox: undefined as Entity | undefined,
  brushSphere: undefined as Entity | undefined,

  // Drag states
  boxStartPos: Vector3.zero,
  brushRadius: 0.15,

  init() {
    Controller.subscribe('rightTrigger', 'Pressed', this.onTriggerPressed.bind(this));
    Controller.subscribe('rightTrigger', 'Update', this.onTriggerUpdate.bind(this));
    Controller.subscribe('rightTrigger', 'Released', this.onTriggerReleased.bind(this));
  },

  getActiveSelectionTool(): 'Select' | 'BoxSelect' | 'BrushSelect' | 'Move' | undefined {
    if (EditMode.active) {
      return EditMode.tool;
    } else {
      if (ModelingTool.currentMode === 'BoxSelect') return 'BoxSelect';
      if (ModelingTool.currentMode === 'BrushSelect') return 'BrushSelect';
      if (ModelingTool.currentMode === 'Select') return 'Select';
      if (ModelingTool.currentMode === 'Move') return 'Move';
    }
    return undefined;
  },

  getPointerHitPos(): Vector3 {
    const handPos = Player.rightHand.position.get() ?? Player.head.position.get() ?? Vector3.zero;
    const handFwd = Player.rightHand.forward.get() ?? Player.head.forward.get() ?? new Vector3(0, 0, -1);
    
    // We raycast to find the 3D position in the world
    const rayHit = Raycast.directional(handPos, handFwd, 5);
    return rayHit ? rayHit.pos : handPos.add(handFwd.multiply(2));
  },

  onTriggerPressed() {
    const activeTool = this.getActiveSelectionTool();
    if (!activeTool) return;

    const hitPos = this.getPointerHitPos();

    if (activeTool === 'BoxSelect') {
      this.boxStartPos = hitPos.clone();
      if (this.selectionBox) {
        this.selectionBox.destroy();
      }
      // Create Cyan semi-transparent cube
      this.selectionBox = spawnPrimitive.cube(
        this.boxStartPos,
        new Vector3(0.01, 0.01, 0.01),
        Quaternion.one,
        new Color(0.2, 0.6, 1.0),
        0.25,
        false,
        'Empty',
        undefined
      );
    } else if (activeTool === 'BrushSelect') {
      if (this.brushSphere) {
        this.brushSphere.destroy();
      }
      // Create Cyan semi-transparent sphere
      this.brushSphere = spawnPrimitive.sphere(
        8, 8,
        hitPos,
        this.brushRadius * 2,
        Quaternion.one,
        new Color(0.2, 0.6, 1.0),
        0.25,
        'None',
        'Empty',
        undefined
      );
      this.performBrushSelection(hitPos);
    }
  },

  onTriggerUpdate() {
    const activeTool = this.getActiveSelectionTool();
    if (!activeTool) return;

    const hitPos = this.getPointerHitPos();

    if (activeTool === 'BoxSelect' && this.selectionBox) {
      const center = this.boxStartPos.add(hitPos).multiply(0.5);
      const size = new Vector3(
        Math.abs(this.boxStartPos.x - hitPos.x),
        Math.abs(this.boxStartPos.y - hitPos.y),
        Math.abs(this.boxStartPos.z - hitPos.z)
      );

      this.selectionBox.pos = center;
      this.selectionBox.scale = new Vector3(
        Math.max(0.01, size.x),
        Math.max(0.01, size.y),
        Math.max(0.01, size.z)
      );
    } else if (activeTool === 'BrushSelect' && this.brushSphere) {
      this.brushSphere.pos = hitPos;
      this.performBrushSelection(hitPos);
    }
  },

  onTriggerReleased() {
    const activeTool = this.getActiveSelectionTool();

    if (this.selectionBox) {
      const center = this.selectionBox.pos;
      const size = this.selectionBox.scale;

      this.performBoxSelection(center, size);

      this.selectionBox.destroy();
      this.selectionBox = undefined;
    }

    if (this.brushSphere) {
      this.brushSphere.destroy();
      this.brushSphere = undefined;
    }
  },

  isPointInBox(point: Vector3, center: Vector3, size: Vector3): boolean {
    const halfSize = size.multiply(0.5);
    const eps = 0.02; // Selection buffer
    return Math.abs(point.x - center.x) <= halfSize.x + eps &&
           Math.abs(point.y - center.y) <= halfSize.y + eps &&
           Math.abs(point.z - center.z) <= halfSize.z + eps;
  },

  performBoxSelection(center: Vector3, size: Vector3) {
    if (EditMode.active) {
      if (!EditMode.isMultiselect) {
        EditMode.selectedUniqueVerts.clear();
        EditMode.selectedEdges.clear();
        EditMode.selectedFaces.clear();
      }

      if (EditMode.selectionMode === 'Vertex') {
        for (let i = 0; i < EditMode.uniquePositions.length; i++) {
          const worldPos = EditMode.localToWorld(EditMode.uniquePositions[i]);
          if (this.isPointInBox(worldPos, center, size)) {
            EditMode.selectedUniqueVerts.add(i);
          }
        }
      } else if (EditMode.selectionMode === 'Edge') {
        const edges = EditMode.getUniqueEdges();
        for (const edge of edges) {
          const pA = EditMode.localToWorld(EditMode.uniquePositions[edge.u]);
          const pB = EditMode.localToWorld(EditMode.uniquePositions[edge.v]);
          const midpoint = pA.add(pB).multiply(0.5);
          if (this.isPointInBox(midpoint, center, size)) {
            EditMode.selectedEdges.add(edge.key);
          }
        }
      } else if (EditMode.selectionMode === 'Face') {
        const tris = EditMode.targetEntity!.mesh.triangles;
        for (let tIdx = 0; tIdx < tris.length / 3; tIdx++) {
          const u1 = EditMode.uniqueIdMap[tris[3 * tIdx]];
          const u2 = EditMode.uniqueIdMap[tris[3 * tIdx + 1]];
          const u3 = EditMode.uniqueIdMap[tris[3 * tIdx + 2]];
          const p1 = EditMode.localToWorld(EditMode.uniquePositions[u1]);
          const p2 = EditMode.localToWorld(EditMode.uniquePositions[u2]);
          const p3 = EditMode.localToWorld(EditMode.uniquePositions[u3]);
          const faceCenter = p1.add(p2).add(p3).multiply(1 / 3);
          if (this.isPointInBox(faceCenter, center, size)) {
            EditMode.selectedFaces.add(tIdx);
          }
        }
      }

      EditMode.rebuildHandles();
    } else {
      // Object selection
      let firstSelected: Entity | undefined;
      for (const ent of ModelingTool.spawnedEntities) {
        if (this.isPointInBox(ent.pos, center, size)) {
          firstSelected = ent;
          break; // Select first object in box
        }
      }
      if (firstSelected) {
        ModelingTool.selectEntity(firstSelected);
      }
    }
  },

  performBrushSelection(brushCenter: Vector3) {
    if (EditMode.active) {
      if (EditMode.selectionMode === 'Vertex') {
        for (let i = 0; i < EditMode.uniquePositions.length; i++) {
          const worldPos = EditMode.localToWorld(EditMode.uniquePositions[i]);
          if (worldPos.distanceTo(brushCenter) <= this.brushRadius) {
            EditMode.selectedUniqueVerts.add(i);
          }
        }
      } else if (EditMode.selectionMode === 'Edge') {
        const edges = EditMode.getUniqueEdges();
        for (const edge of edges) {
          const pA = EditMode.localToWorld(EditMode.uniquePositions[edge.u]);
          const pB = EditMode.localToWorld(EditMode.uniquePositions[edge.v]);
          const midpoint = pA.add(pB).multiply(0.5);
          if (midpoint.distanceTo(brushCenter) <= this.brushRadius) {
            EditMode.selectedEdges.add(edge.key);
          }
        }
      } else if (EditMode.selectionMode === 'Face') {
        const tris = EditMode.targetEntity!.mesh.triangles;
        for (let tIdx = 0; tIdx < tris.length / 3; tIdx++) {
          const u1 = EditMode.uniqueIdMap[tris[3 * tIdx]];
          const u2 = EditMode.uniqueIdMap[tris[3 * tIdx + 1]];
          const u3 = EditMode.uniqueIdMap[tris[3 * tIdx + 2]];
          const p1 = EditMode.localToWorld(EditMode.uniquePositions[u1]);
          const p2 = EditMode.localToWorld(EditMode.uniquePositions[u2]);
          const p3 = EditMode.localToWorld(EditMode.uniquePositions[u3]);
          const faceCenter = p1.add(p2).add(p3).multiply(1 / 3);
          if (faceCenter.distanceTo(brushCenter) <= this.brushRadius) {
            EditMode.selectedFaces.add(tIdx);
          }
        }
      }

      EditMode.rebuildHandles();
    } else {
      // Object selection
      for (const ent of ModelingTool.spawnedEntities) {
        if (ent.pos.distanceTo(brushCenter) <= this.brushRadius) {
          ModelingTool.selectEntity(ent);
          break; // Select first object in brush range
        }
      }
    }
  }
};
