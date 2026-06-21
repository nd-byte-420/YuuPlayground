import { Entity } from "../Yuu API/Entity";

export type EditorMode = 'Edit' | 'Play';

class ModeManagerClass {
  public currentMode: EditorMode = 'Edit';

  public setMode(mode: EditorMode) {
    if (this.currentMode === mode) return;
    this.currentMode = mode;

    const isFrozen = mode === 'Edit';

    // Traverse all entities and freeze/unfreeze physics objects
    Entity.entityMap.forEach((entity, id) => {
      if (entity.type === 'Physics') {
        Godot.node.physics.setFreeze(id, isFrozen);
      }
    });
  }
}

export const ModeManager = new ModeManagerClass();
