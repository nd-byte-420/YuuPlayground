import { Color } from "../../Yuu API/Basic Types/Color";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Entity } from "../../Yuu API/Entity";
import { spawnPrimitive } from "../../Yuu API/SpawnPrimitive";
import { RayHit } from "../../Yuu API/Raycast";
import { Player } from "../../Yuu API/Player";
import { Events } from "../../Yuu API/Events";
import { Controller } from "../../Yuu API/Controller";
import { snap, snapVector, conjugate, rotateVector } from "../Core/MathUtils";
import { ModelingTool } from "../Core/ModelingTool";
import { EditMode } from "../EditMode/EditMode";
import { createArrow } from "./GizmoArrow";

export const Gizmo = {
  arrows: [] as Entity[],
  centerCube: undefined as Entity | undefined,
  visible: false,
  center: Vector3.zero,

  // Arrow-axis drag states
  activeAxis: undefined as 'X' | 'Y' | 'Z' | undefined,
  dragStartParam: 0,
  dragStartPos: Vector3.zero,
  dragStartEntityPos: Vector3.zero,
  dragStartVertPositions: new Map<number, Vector3>(),

  // Center cube free-move drag state
  centerDragging: false,
  centerDragDistance: 0,
  centerDragStartEntityPos: Vector3.zero,
  centerDragStartVertPositions: new Map<number, Vector3>(),
  centerDragInitialLocalDragPos: Vector3.zero,

  init() {
    Events.onPhysicsUpdate(this.update.bind(this));
    // Drive gizmo drag from trigger events so movement persists even when
    // the ray leaves the arrow / center cube.
    Controller.subscribe('rightTrigger', 'Update', () => {
      if (this.activeAxis) {
        this.applyAxisDrag(this.activeAxis);
      } else if (this.centerDragging) {
        this.applyCenterDrag();
      }
    });
    Controller.subscribe('rightTrigger', 'Released', () => {
      this.activeAxis = undefined;
      this.centerDragging = false;
    });
  },

  destroyArrows() {
    for (const arrow of this.arrows) {
      arrow.destroy();
    }
    this.arrows = [];
    if (this.centerCube) {
      this.centerCube.destroy();
      this.centerCube = undefined;
    }
  },

  rebuildArrows() {
    this.destroyArrows();
    if (!this.visible) return;

    const xArrow = createArrow(
      this.center, 'X', new Color(0.9, 0.1, 0.1),
      (axis, hit) => this.onArrowClick(axis, hit),
      (axis, hit) => this.onArrowHeld(axis, hit)
    );
    const yArrow = createArrow(
      this.center, 'Y', new Color(0.1, 0.9, 0.1),
      (axis, hit) => this.onArrowClick(axis, hit),
      (axis, hit) => this.onArrowHeld(axis, hit)
    );
    const zArrow = createArrow(
      this.center, 'Z', new Color(0.1, 0.1, 0.9),
      (axis, hit) => this.onArrowClick(axis, hit),
      (axis, hit) => this.onArrowHeld(axis, hit)
    );

    // Dark blue center cube for free-move
    const darkBlue = new Color(0.05, 0.1, 0.5);
    this.centerCube = spawnPrimitive.cube(
      this.center,
      new Vector3(0.04, 0.04, 0.04),
      Quaternion.one,
      darkBlue,
      1.0,
      true,
      'Static',
      undefined
    );
    this.centerCube.rayClick.initialize(false);
    this.centerCube.rayClick.setClickFunction((hit) => this.onCenterClick(hit));
    this.centerCube.rayClick.setHeldFunction((hit) => this.onCenterHeld(hit));

    this.arrows = [xArrow, yArrow, zArrow];
    this.updateArrowPositions();
  },

  updateArrowPositions() {
    for (const arrow of this.arrows) {
      arrow.pos = this.center;
    }
    if (this.centerCube) {
      this.centerCube.pos = this.center;
    }
  },

  onArrowClick(axis: 'X' | 'Y' | 'Z', hit: RayHit) {
    this.activeAxis = axis;
    this.dragStartPos = this.center.clone();

    const handPos = Player.rightHand.position.get() ?? Player.head.position.get();
    const handFwd = Player.rightHand.forward.get() ?? Player.head.forward.get();

    if (handPos && handFwd) {
      const axisDir = this.getAxisDirection(axis);
      this.dragStartParam = this.getClosestPointOnAxis(this.dragStartPos, axisDir, handPos, handFwd);
    }

    if (EditMode.active) {
      this.dragStartVertPositions.clear();
      const vertsToMove = EditMode.getSelectedUniqueVertexIndices();
      for (const vIdx of vertsToMove) {
        this.dragStartVertPositions.set(vIdx, EditMode.uniquePositions[vIdx].clone());
      }
    } else if (ModelingTool.selectedEntity) {
      this.dragStartEntityPos = ModelingTool.selectedEntity.pos.clone();
    }
  },

  onCenterClick(hit: RayHit) {
    this.centerDragging = true;
    const handPos = Player.rightHand.position.get() ?? Player.head.position.get();
    if (handPos) {
      this.centerDragDistance = handPos.distanceTo(this.center);
    }

    if (EditMode.active) {
      this.centerDragStartVertPositions.clear();
      this.centerDragInitialLocalDragPos = EditMode.worldToLocal(this.center);
      const vertsToMove = EditMode.getSelectedUniqueVertexIndices();
      for (const vIdx of vertsToMove) {
        this.centerDragStartVertPositions.set(vIdx, EditMode.uniquePositions[vIdx].clone());
      }
    } else if (ModelingTool.selectedEntity) {
      this.centerDragStartEntityPos = ModelingTool.selectedEntity.pos.clone();
    }
  },

  // No-ops: actual drag is handled by the trigger Update subscription in init()
  onCenterHeld(_hit: RayHit) {},
  onArrowHeld(_axis: 'X' | 'Y' | 'Z', _hit: RayHit) {},

  applyCenterDrag() {
    const handPos = Player.rightHand.position.get() ?? Player.head.position.get();
    const handFwd = Player.rightHand.forward.get() ?? Player.head.forward.get();

    if (handPos && handFwd) {
      let newWorldPos = handPos.add(handFwd.multiply(this.centerDragDistance));
      if (ModelingTool.gridSnappingEnabled) {
        newWorldPos = snapVector(newWorldPos, ModelingTool.gridResolution);
      }

      if (EditMode.active) {
        const newLocalPos = EditMode.worldToLocal(newWorldPos);
        const localDelta = newLocalPos.subtract(this.centerDragInitialLocalDragPos);
        this.centerDragStartVertPositions.forEach((startLocalPos, vIdx) => {
          EditMode.uniquePositions[vIdx] = startLocalPos.add(localDelta);
        });
        EditMode.rebuildMeshFromUniquePositions();
      } else if (ModelingTool.selectedEntity) {
        ModelingTool.selectedEntity.pos = newWorldPos;
      }

      this.updateCenter();
      this.updateArrowPositions();
    }
  },

  applyAxisDrag(axis: 'X' | 'Y' | 'Z') {
    const handPos = Player.rightHand.position.get() ?? Player.head.position.get();
    const handFwd = Player.rightHand.forward.get() ?? Player.head.forward.get();

    if (handPos && handFwd) {
      const axisDir = this.getAxisDirection(axis);
      const currentParam = this.getClosestPointOnAxis(this.dragStartPos, axisDir, handPos, handFwd);

      const deltaVal = currentParam - this.dragStartParam;
      let worldOffset = axisDir.multiply(deltaVal);

      if (ModelingTool.gridSnappingEnabled) {
        const targetPos = this.dragStartPos.add(worldOffset);
        const snappedPos = snapVector(targetPos, ModelingTool.gridResolution);
        worldOffset = snappedPos.subtract(this.dragStartPos);
      }

      if (EditMode.active) {
        const localOffset = this.worldToLocalOffset(worldOffset);
        this.dragStartVertPositions.forEach((startPos, vIdx) => {
          EditMode.uniquePositions[vIdx] = startPos.add(localOffset);
        });
        EditMode.rebuildMeshFromUniquePositions();
      } else if (ModelingTool.selectedEntity) {
        ModelingTool.selectedEntity.pos = this.dragStartEntityPos.add(worldOffset);
      }

      this.updateCenter();
      this.updateArrowPositions();
    }
  },

  getAxisDirection(axis: 'X' | 'Y' | 'Z'): Vector3 {
    if (axis === 'X') return new Vector3(1, 0, 0);
    if (axis === 'Y') return new Vector3(0, 1, 0);
    return new Vector3(0, 0, 1);
  },

  getClosestPointOnAxis(axisStart: Vector3, axisDir: Vector3, rayStart: Vector3, rayDir: Vector3): number {
    const u = axisDir;
    const w = rayDir.normalize();
    const d = axisStart.subtract(rayStart);

    const b = u.dot(w);
    const denom = 1.0 - b * b;

    if (Math.abs(denom) < 0.0001) {
      return -d.dot(u);
    }

    const dVal = u.dot(d);
    const e = w.dot(d);

    return (b * e - dVal) / denom;
  },

  worldToLocalOffset(worldOffset: Vector3): Vector3 {
    if (!EditMode.targetEntity) return worldOffset;
    const rotConj = conjugate(EditMode.targetEntity.rot);
    const rotated = rotateVector(worldOffset, rotConj);
    const sx = Math.max(0.001, EditMode.targetEntity.scale.x);
    const sy = Math.max(0.001, EditMode.targetEntity.scale.y);
    const sz = Math.max(0.001, EditMode.targetEntity.scale.z);
    return new Vector3(rotated.x / sx, rotated.y / sy, rotated.z / sz);
  },

  updateCenter() {
    if (EditMode.active) {
      const localCenter = EditMode.getSelectedVerticesCenter();
      this.center = EditMode.localToWorld(localCenter);
    } else if (ModelingTool.selectedEntity) {
      this.center = ModelingTool.selectedEntity.pos;
    } else {
      this.center = Vector3.zero;
    }
  },

  update(_deltaTime: number) {
    // Determine visibility
    let shouldBeVisible = false;
    if (EditMode.active) {
      const hasSelection = EditMode.getSelectedUniqueVertexIndices().size > 0;
      shouldBeVisible = EditMode.tool === 'Move' && hasSelection;
    } else {
      shouldBeVisible = ModelingTool.currentMode === 'Move' && ModelingTool.selectedEntity !== undefined;
    }

    if (shouldBeVisible !== this.visible) {
      this.visible = shouldBeVisible;
      this.rebuildArrows();
    }

    if (this.visible) {
      this.updateCenter();
      this.updateArrowPositions();
    }
  }
};
