import { Color } from "../../Yuu API/Basic Types/Color";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Entity } from "../../Yuu API/Entity";
import { spawnPrimitive } from "../../Yuu API/SpawnPrimitive";
import { RayHit } from "../../Yuu API/Raycast";
import { arrayUtils } from "../../Yuu API/ArrayUtils";
import { Player } from "../../Yuu API/Player";
import { EditMode } from "../EditMode/EditMode";
import { SceneManager } from "./SceneManager";

export type ModelingMode = 'Select' | 'BoxSelect' | 'BrushSelect' | 'Move' | 'Delete' | 'SpawnCube' | 'SpawnSphere' | 'SpawnPlane' | 'SpawnCone' | 'VertexSelect' | 'EditMode';

export const ModelingTool = {
  currentMode: 'Select' as ModelingMode,
  selectedEntity: undefined as Entity | undefined,
  spawnedEntities: [] as Entity[],
  initialMoveDistance: 2,
  onModeOrSelectionChanged: [] as (() => void)[],

  // Grid Snapping settings
  gridSnappingEnabled: false,
  gridResolution: 0.1,

  setMode(mode: ModelingMode) {
    this.currentMode = mode;
    if (mode === 'EditMode') {
      if (this.selectedEntity) {
        EditMode.enter(this.selectedEntity);
      }
    } else {
      if (EditMode.active) {
        EditMode.exit();
      }
    }
    this.onModeOrSelectionChanged.forEach(cb => cb());
  },

  handleEntityClick(entity: Entity, hit: RayHit) {
    if (this.currentMode === 'Select') {
      this.selectEntity(entity);
    } else if (this.currentMode === 'Delete') {
      this.deleteEntity(entity);
    } else if (this.currentMode === 'Move') {
      this.selectEntity(entity);
      const rightHandPos = Player.rightHand.position.get() ?? Player.head.position.get();
      if (rightHandPos) {
        this.initialMoveDistance = rightHandPos.distanceTo(entity.pos);
      }
    }
  },

  handleEntityHeld(entity: Entity, hit: RayHit) {
    if (this.currentMode === 'Move' && this.selectedEntity === entity) {
      const rightHandPos = Player.rightHand.position.get() ?? Player.head.position.get();
      const rightHandFwd = Player.rightHand.forward.get() ?? Player.head.forward.get();
      
      if (rightHandPos && rightHandFwd) {
        let targetPos = rightHandPos.add(rightHandFwd.multiply(this.initialMoveDistance));
        if (this.gridSnappingEnabled) {
          targetPos = new Vector3(
            Math.round(targetPos.x / this.gridResolution) * this.gridResolution,
            Math.round(targetPos.y / this.gridResolution) * this.gridResolution,
            Math.round(targetPos.z / this.gridResolution) * this.gridResolution
          );
        }
        entity.pos = targetPos;
      }
    }
  },

  spawnFromMode() {
    let type: 'Cube' | 'Sphere' | 'Plane' | 'Cone' | undefined;
    if (this.currentMode === 'SpawnCube') type = 'Cube';
    else if (this.currentMode === 'SpawnSphere') type = 'Sphere';
    else if (this.currentMode === 'SpawnPlane') type = 'Plane';
    else if (this.currentMode === 'SpawnCone') type = 'Cone';

    if (type) {
      this.spawn(type);
    }
  },

  spawn(type: 'Cube' | 'Sphere' | 'Plane' | 'Cone') {
    const headPos = Player.head.position.get() ?? Vector3.zero;
    const forward = Player.head.forward.get() ?? new Vector3(0, 0, -1);
    const spawnPos = headPos.add(forward.multiply(2));

    // Determine parent scene node (spawn as child of selected object)
    const parentSceneNode = this.selectedEntity
      ? SceneManager.findByEntity(this.selectedEntity)
      : undefined;

    // Resolve parent Entity for Godot node hierarchy (if selected object is a scene node)
    const parentEntity = parentSceneNode ? parentSceneNode.entity : undefined;

    let entity: Entity | undefined;
    switch (type) {
      case 'Cube':
        entity = spawnPrimitive.cube(spawnPos, new Vector3(0.5, 0.5, 0.5), Quaternion.one, Color.white, 1, true, 'Static', parentEntity);
        break;
      case 'Sphere':
        entity = spawnPrimitive.sphere(16, 16, spawnPos, 0.5, Quaternion.one, Color.white, 1, 'Convex', 'Static', parentEntity);
        break;
      case 'Plane':
        entity = spawnPrimitive.plane('Both', spawnPos, new Vector3(0.5, 0.5, 0.5), Quaternion.one, Color.white, 1, 'Convex', 'Static', parentEntity);
        break;
      case 'Cone':
        entity = spawnPrimitive.cone(16, spawnPos, 0.5, Quaternion.one, Color.white, 1, 'Convex', 'Static', parentEntity);
        break;
    }

    if (entity) {
      this.spawnedEntities.push(entity);
      entity.rayClick.initialize(false);
      entity.rayClick.setClickFunction((hit) => this.handleEntityClick(entity!, hit));
      entity.rayClick.setHeldFunction((hit) => this.handleEntityHeld(entity!, hit));
      // Register in scene graph
      SceneManager.addObject(entity, type, parentSceneNode?.id);
      this.selectEntity(entity);
    }
  },

  refreshEntityVisuals(entity: Entity) {
    if (!entity.mesh.nodeID) return;

    const isSelected = this.selectedEntity === entity;
    const inEditMode = EditMode.active && EditMode.targetEntity === entity;

    if (inEditMode) {
      entity.mesh.color.set(new Color(0.7, 0.7, 0.7), 0.4);
      Godot.shader.removeFromMesh(entity.mesh.nodeID);
    } else if (isSelected) {
      if (entity.customShader) {
        Godot.shader.applyToMesh(entity.mesh.nodeID, entity.customShader);
      } else {
        Godot.shader.removeFromMesh(entity.mesh.nodeID);
      }
      entity.mesh.color.set(Color.green, 1);
    } else {
      entity.mesh.color.set(entity.customColor, entity.customAlpha);
      if (entity.customShader) {
        Godot.shader.applyToMesh(entity.mesh.nodeID, entity.customShader);
      } else {
        Godot.shader.removeFromMesh(entity.mesh.nodeID);
      }
    }
  },

  selectEntity(entity: Entity) {
    const prev = this.selectedEntity;
    this.selectedEntity = entity;
    if (prev) {
      this.refreshEntityVisuals(prev);
    }
    this.refreshEntityVisuals(entity);

    if (this.currentMode === 'EditMode') {
      EditMode.enter(entity);
    }
    // Sync selection to SceneManager (if not already in sync)
    const sceneNode = SceneManager.findByEntity(entity);
    if (sceneNode && SceneManager.selectedId !== sceneNode.id) {
      SceneManager.selectObject(sceneNode.id);
    }
    this.onModeOrSelectionChanged.forEach(cb => cb());
  },

  deleteEntity(entity: Entity) {
    if (EditMode.active && EditMode.targetEntity === entity) {
      EditMode.exit();
    }
    if (this.selectedEntity === entity) {
      this.selectedEntity = undefined;
    }
    // Remove from scene graph before destroying
    const sceneNode = SceneManager.findByEntity(entity);
    if (sceneNode) {
      SceneManager.removeObject(sceneNode.id);
    }
    arrayUtils.removeItemFromArray(this.spawnedEntities, entity);
    entity.destroy();
    this.onModeOrSelectionChanged.forEach(cb => cb());
  },

  translateSelected(offset: Vector3) {
    if (EditMode.active) {
      EditMode.translateSelected(offset);
    } else if (this.selectedEntity) {
      this.selectedEntity.pos = this.selectedEntity.pos.add(offset);
    }
  },

  rotateSelected(eulerOffset: Vector3) {
    if (EditMode.active) {
      EditMode.rotateSelected(eulerOffset);
    } else if (this.selectedEntity) {
      const offsetQuat = Quaternion.fromEuler(eulerOffset);
      this.selectedEntity.rot = this.selectedEntity.rot.multiply(offsetQuat);
    }
  },

  scaleSelected(delta: Vector3) {
    if (EditMode.active) {
      EditMode.scaleSelected(delta);
    } else if (this.selectedEntity) {
      const currentScale = this.selectedEntity.scale;
      this.selectedEntity.scale = new Vector3(
        Math.max(0.01, currentScale.x + delta.x),
        Math.max(0.01, currentScale.y + delta.y),
        Math.max(0.01, currentScale.z + delta.z)
      );
    }
  },

  setMaterialColor(color: Color) {
    if (this.selectedEntity) {
      this.selectedEntity.customColor = color;
      this.selectedEntity.customAlpha = 1.0;
      this.selectedEntity.mesh.color.set(color, 1.0);
    }
  },

  setMaterialColorAlpha(color: Color, alpha: number) {
    if (this.selectedEntity) {
      this.selectedEntity.customColor = color;
      this.selectedEntity.customAlpha = alpha;
      this.selectedEntity.mesh.color.set(color, alpha);
    }
  },

  setMaterialShader(shaderCode: string | undefined) {
    if (this.selectedEntity && this.selectedEntity.mesh.nodeID) {
      this.selectedEntity.customShader = shaderCode;
      if (shaderCode) {
        Godot.shader.applyToMesh(this.selectedEntity.mesh.nodeID, shaderCode);
      } else {
        Godot.shader.removeFromMesh(this.selectedEntity.mesh.nodeID);
      }
    }
  },

  /** Duplicate the currently selected object in Object mode. */
  duplicateSelected(): Entity | undefined {
    if (!this.selectedEntity) return undefined;
    const src = this.selectedEntity;
    const srcNode = SceneManager.findByEntity(src);

    const newEntity = spawnPrimitive.cube(
      src.pos.add(new Vector3(0.1, 0.1, 0)),
      src.scale,
      src.rot,
      Color.white,
      1,
      true,
      'Static',
      undefined
    );

    // Copy mesh data
    const verts = src.mesh.verts.map(v => v.clone());
    const uvs = src.mesh.uvs.map(uv => uv.clone());
    const triangles = [...src.mesh.triangles];
    newEntity.mesh.create(verts, uvs, triangles);

    // Copy custom visual properties
    newEntity.customColor = src.customColor;
    newEntity.customAlpha = src.customAlpha;
    newEntity.customShader = src.customShader;

    // Apply color and shader to the new entity
    newEntity.mesh.color.set(src.customColor, src.customAlpha);
    if (src.customShader && newEntity.mesh.nodeID) {
      Godot.shader.applyToMesh(newEntity.mesh.nodeID, src.customShader);
    }

    newEntity.rayClick.initialize(false);
    newEntity.rayClick.setClickFunction((hit) => this.handleEntityClick(newEntity, hit));
    newEntity.rayClick.setHeldFunction((hit) => this.handleEntityHeld(newEntity, hit));

    this.spawnedEntities.push(newEntity);
    const baseName = srcNode?.name ?? 'Object';
    SceneManager.addObject(newEntity, baseName);
    this.selectEntity(newEntity);
    return newEntity;
  },
}
