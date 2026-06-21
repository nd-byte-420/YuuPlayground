import { Entity } from "../Yuu API/Entity";

class SelectionManagerClass {
  public selectedObjects: Entity[] = [];

  public select(entity: Entity, multiSelect: boolean = false) {
    if (!multiSelect) {
      this.clearSelection();
    }
    
    if (!this.selectedObjects.includes(entity)) {
      this.selectedObjects.push(entity);
      this.onSelectionChanged();
    }
  }

  public deselect(entity: Entity) {
    const index = this.selectedObjects.indexOf(entity);
    if (index !== -1) {
      this.selectedObjects.splice(index, 1);
      this.onSelectionChanged();
    }
  }

  public clearSelection() {
    this.selectedObjects = [];
    this.onSelectionChanged();
  }

  private onSelectionChanged() {
    // TODO: Spawn / destroy gizmos for the selected objects
    // If a gizmo exists, update its target or destroy it and recreate
  }
}

export const SelectionManager = new SelectionManagerClass();
