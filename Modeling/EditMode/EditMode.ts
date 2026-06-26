import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Vector2 } from "../../Yuu API/Basic Types/Vector2";
import { Color } from "../../Yuu API/Basic Types/Color";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { Entity } from "../../Yuu API/Entity";
import { RayHit } from "../../Yuu API/Raycast";
import { Player } from "../../Yuu API/Player";
import { Events } from "../../Yuu API/Events";
import { ModelingTool } from "../Core/ModelingTool";
import { conjugate, rotateVector } from "../Core/MathUtils";
import * as Handles from "./EditModeHandles";
import * as Laser from "./EditModeLaser";
import * as Operators from "./EditModeOperators";

export const EditMode = {
  active: false,
  targetEntity: undefined as Entity | undefined,
  selectionMode: 'Vertex' as 'Vertex' | 'Edge' | 'Face',
  isMultiselect: false,
  tool: 'Select' as 'Select' | 'BoxSelect' | 'BrushSelect' | 'Move',

  // Geometry tracking
  uniqueIdMap: [] as number[],
  uniquePositions: [] as Vector3[],

  // Selected components
  selectedUniqueVerts: new Set<number>(),
  selectedEdges: new Set<string>(), // Key: "u,v" where u < v
  selectedFaces: new Set<number>(),  // Triangle indices

  // Handles
  handles: [] as Entity[],
  handleMapping: new Map<number, { type: 'vertex' | 'edge' | 'face', id: any }>(),

  // Drag states
  initialDistance: 0,
  initialPositions: new Map<number, Vector3>(), // Maps uniqueVertID -> position
  initialLocalDragPos: Vector3.zero,

  // Laser Pointer UI
  guideLine: undefined as Entity | undefined,
  cursorDot: undefined as Entity | undefined,
  updateSubscription: undefined as number | undefined,

  enter(entity: Entity) {
    if (this.active) this.exit();

    this.targetEntity = entity;
    this.active = true;

    // Disable target collider while editing so it doesn't block handle raycasts
    if (this.targetEntity.collider.nodeID) {
      Godot.node.collidable.set(this.targetEntity.collider.nodeID, false);
    }

    // Change target color to semi-transparent to distinguish edit mode (handled by refreshEntityVisuals)
    ModelingTool.refreshEntityVisuals(entity);

    this.selectedUniqueVerts.clear();
    this.selectedEdges.clear();
    this.selectedFaces.clear();

    this.buildUniqueVertices();
    this.rebuildHandles();

    // Spawn laser pointer
    const laser = Laser.spawnLaser();
    this.guideLine = laser.guideLine;
    this.cursorDot = laser.cursorDot;

    this.updateSubscription = Events.onPhysicsUpdate(this.update.bind(this));
  },

  exit() {
    this.active = false;
    this.clearHandles();

    if (this.updateSubscription !== undefined) {
      Events.unsubscribe(this.updateSubscription);
      this.updateSubscription = undefined;
    }

    Laser.destroyLaser(this.guideLine, this.cursorDot);
    this.guideLine = undefined;
    this.cursorDot = undefined;

    if (this.targetEntity) {
      // Rebuild the final collider now that editing is complete
      if (this.targetEntity.mesh.nodeID && this.targetEntity.mesh.triangles.length > 0) {
        this.targetEntity.collider.createFromMeshNode(this.targetEntity.mesh.nodeID, 'Convex');
      } else {
        this.targetEntity.collider.destroy();
      }

      // Restore normal collision
      if (this.targetEntity.collider.nodeID) {
        Godot.node.collidable.set(this.targetEntity.collider.nodeID, true);
      }

      const prevTarget = this.targetEntity;
      this.targetEntity = undefined;
      ModelingTool.refreshEntityVisuals(prevTarget);
    }

    this.selectedUniqueVerts.clear();
    this.selectedEdges.clear();
    this.selectedFaces.clear();
  },

  buildUniqueVertices() {
    if (!this.targetEntity) return;
    const verts = this.targetEntity.mesh.verts;

    this.uniqueIdMap = [];
    this.uniquePositions = [];

    for (let i = 0; i < verts.length; i++) {
      const v = verts[i];
      let foundIdx = -1;
      for (let j = 0; j < this.uniquePositions.length; j++) {
        if (this.uniquePositions[j].equals(v, 0.001)) {
          foundIdx = j;
          break;
        }
      }
      if (foundIdx === -1) {
        foundIdx = this.uniquePositions.length;
        this.uniquePositions.push(v.clone());
      }
      this.uniqueIdMap[i] = foundIdx;
    }
  },

  clearHandles() { Handles.clearHandles(this); },
  rebuildHandles() { Handles.rebuildHandles(this); },
  updateHandleVisualPositions() { Handles.updateHandleVisualPositions(this); },

  getUniqueEdges(): { u: number, v: number, key: string }[] {
    if (!this.targetEntity) return [];
    const tris = this.targetEntity.mesh.triangles;
    const edgeSet = new Set<string>();
    const edges: { u: number, v: number, key: string }[] = [];

    for (let i = 0; i < tris.length; i += 3) {
      const u1 = this.uniqueIdMap[tris[i]];
      const u2 = this.uniqueIdMap[tris[i + 1]];
      const u3 = this.uniqueIdMap[tris[i + 2]];

      const triEdges = [
        [u1, u2],
        [u2, u3],
        [u3, u1]
      ];

      for (const [a, b] of triEdges) {
        const minVal = Math.min(a, b);
        const maxVal = Math.max(a, b);
        const key = `${minVal},${maxVal}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ u: minVal, v: maxVal, key });
        }
      }
    }
    return edges;
  },

  getSelectedUniqueVertexIndices(): Set<number> {
    const indices = new Set<number>();
    if (this.selectionMode === 'Vertex') {
      for (const v of this.selectedUniqueVerts) {
        indices.add(v);
      }
    } else if (this.selectionMode === 'Edge') {
      for (const edgeKey of this.selectedEdges) {
        const parts = edgeKey.split(',').map(Number);
        indices.add(parts[0]);
        indices.add(parts[1]);
      }
    } else if (this.selectionMode === 'Face') {
      if (this.targetEntity) {
        const tris = this.targetEntity.mesh.triangles;
        for (const tIdx of this.selectedFaces) {
          indices.add(this.uniqueIdMap[tris[3 * tIdx]]);
          indices.add(this.uniqueIdMap[tris[3 * tIdx + 1]]);
          indices.add(this.uniqueIdMap[tris[3 * tIdx + 2]]);
        }
      }
    }
    return indices;
  },

  onHandleClick(handle: Entity, hit: RayHit) {
    if (!this.targetEntity || !handle.nodeID) return;
    const info = this.handleMapping.get(handle.nodeID);
    if (!info) return;

    if (this.tool !== 'Select' && this.tool !== 'Move') return;

    if (!this.isMultiselect) {
      let alreadySelected = false;
      if (info.type === 'vertex') alreadySelected = this.selectedUniqueVerts.has(info.id);
      else if (info.type === 'edge') alreadySelected = this.selectedEdges.has(info.id);
      else if (info.type === 'face') alreadySelected = this.selectedFaces.has(info.id);

      if (!alreadySelected) {
        this.selectedUniqueVerts.clear();
        this.selectedEdges.clear();
        this.selectedFaces.clear();
      }
    }

    if (info.type === 'vertex') {
      if (this.isMultiselect && this.selectedUniqueVerts.has(info.id)) {
        this.selectedUniqueVerts.delete(info.id);
      } else {
        this.selectedUniqueVerts.add(info.id);
      }
    } else if (info.type === 'edge') {
      if (this.isMultiselect && this.selectedEdges.has(info.id)) {
        this.selectedEdges.delete(info.id);
      } else {
        this.selectedEdges.add(info.id);
      }
    } else if (info.type === 'face') {
      if (this.isMultiselect && this.selectedFaces.has(info.id)) {
        this.selectedFaces.delete(info.id);
      } else {
        this.selectedFaces.add(info.id);
      }
    }

    this.rebuildHandles();

    const handPos = Player.rightHand.position.get() ?? Player.head.position.get() ?? Vector3.zero;
    const handleWorldPos = this.localToWorld(handle.pos);
    this.initialDistance = handPos.distanceTo(handleWorldPos);

    this.initialLocalDragPos = handle.pos.clone();

    this.initialPositions.clear();
    const vertsToMove = this.getSelectedUniqueVertexIndices();
    for (const vIdx of vertsToMove) {
      this.initialPositions.set(vIdx, this.uniquePositions[vIdx].clone());
    }
  },

  onHandleHeld(handle: Entity, hit: RayHit) {
    if (!this.targetEntity) return;
    if (this.tool !== 'Select' && this.tool !== 'Move') return;

    const handPos = Player.rightHand.position.get() ?? Player.head.position.get();
    const handFwd = Player.rightHand.forward.get() ?? Player.head.forward.get();

    if (handPos && handFwd) {
      const newWorldPos = handPos.add(handFwd.multiply(this.initialDistance));
      let snappedWorldPos = newWorldPos;
      if (ModelingTool.gridSnappingEnabled) {
        snappedWorldPos = new Vector3(
          Math.round(newWorldPos.x / ModelingTool.gridResolution) * ModelingTool.gridResolution,
          Math.round(newWorldPos.y / ModelingTool.gridResolution) * ModelingTool.gridResolution,
          Math.round(newWorldPos.z / ModelingTool.gridResolution) * ModelingTool.gridResolution
        );
      }
      const newLocalPos = this.worldToLocal(snappedWorldPos);

      const localDelta = newLocalPos.subtract(this.initialLocalDragPos);

      this.initialPositions.forEach((startLocalPos, vIdx) => {
        this.uniquePositions[vIdx] = startLocalPos.add(localDelta);
      });

      const verts = this.targetEntity.mesh.verts;
      const uvs = this.targetEntity.mesh.uvs;
      const triangles = this.targetEntity.mesh.triangles;

      for (let i = 0; i < verts.length; i++) {
        verts[i] = this.uniquePositions[this.uniqueIdMap[i]].clone();
      }

      this.targetEntity.mesh.create(verts, uvs, triangles);
      this.updateHandleVisualPositions();
    }
  },

  worldToLocal(worldPos: Vector3): Vector3 {
    if (!this.targetEntity) return worldPos;
    const diff = worldPos.subtract(this.targetEntity.pos);
    const rotConj = conjugate(this.targetEntity.rot);
    const rotated = rotateVector(diff, rotConj);

    const sx = Math.max(0.001, this.targetEntity.scale.x);
    const sy = Math.max(0.001, this.targetEntity.scale.y);
    const sz = Math.max(0.001, this.targetEntity.scale.z);

    return new Vector3(rotated.x / sx, rotated.y / sy, rotated.z / sz);
  },

  localToWorld(localPos: Vector3): Vector3 {
    if (!this.targetEntity) return localPos;
    const scaled = new Vector3(
      localPos.x * this.targetEntity.scale.x,
      localPos.y * this.targetEntity.scale.y,
      localPos.z * this.targetEntity.scale.z
    );
    const rotated = rotateVector(scaled, this.targetEntity.rot);
    return this.targetEntity.pos.add(rotated);
  },

  update(_deltaTime: number) {
    if (!this.active) return;
    Laser.updateLaser(this.guideLine, this.cursorDot);
  },

  getSelectedVerticesCenter(): Vector3 {
    const vertsToMove = this.getSelectedUniqueVertexIndices();
    if (vertsToMove.size === 0) return Vector3.zero;
    let sum = Vector3.zero;
    for (const idx of vertsToMove) {
      sum = sum.add(this.uniquePositions[idx]);
    }
    return sum.multiply(1 / vertsToMove.size);
  },

  rebuildMeshFromUniquePositions() {
    if (!this.targetEntity) return;
    const verts = this.targetEntity.mesh.verts;
    const uvs = this.targetEntity.mesh.uvs;
    const triangles = this.targetEntity.mesh.triangles;

    for (let i = 0; i < verts.length; i++) {
      verts[i] = this.uniquePositions[this.uniqueIdMap[i]].clone();
    }

    this.targetEntity.mesh.create(verts, uvs, triangles);
    this.updateHandleVisualPositions();
  },

  // Operator delegates
  extrude()             { Operators.extrude(this); },
  deleteSelected()      { Operators.deleteSelected(this); },
  mergeVertices()       { Operators.mergeVertices(this); },
  subdivide()           { Operators.subdivide(this); },
  createFace()          { Operators.createFace(this); },
  duplicateSelected()   { Operators.duplicateSelected(this); },

  translateSelected(offset: Vector3)    { Operators.translateSelected(this, offset); },
  rotateSelected(eulerOffset: Vector3)  { Operators.rotateSelected(this, eulerOffset); },
  scaleSelected(delta: Vector3)         { Operators.scaleSelected(this, delta); },

  handleKeyboardInput(target: string, value: number) {
    Operators.handleKeyboardInput(this, target, value);
  }
};
