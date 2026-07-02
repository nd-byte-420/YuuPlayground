import { Entity } from "../../Yuu API/Entity";

export interface SceneNode {
  id: number;
  name: string;
  entity: Entity;
  parentId: number | undefined;
  childIds: number[];
}

let nextId = 1;
// Counters for auto-naming primitives
const typeCounters: Record<string, number> = {};

function generateName(baseName: string): string {
  if (!(baseName in typeCounters)) {
    typeCounters[baseName] = 0;
  }
  typeCounters[baseName]++;
  return `${baseName}_${typeCounters[baseName]}`;
}

export const SceneManager = {
  nodes: new Map<number, SceneNode>(),
  selectedId: undefined as number | undefined,
  onChange: [] as (() => void)[],

  /**
   * Register a new entity in the scene.
   * @param entity the Entity to track
   * @param baseName base display name (e.g. 'Cube', 'Sphere', filename). Gets auto-numbered.
   * @param parentId optional scene node ID to nest under
   * @returns the created SceneNode
   */
  addObject(entity: Entity, baseName: string, parentId?: number): SceneNode {
    const id = nextId++;
    const name = generateName(baseName);

    const node: SceneNode = {
      id,
      name,
      entity,
      parentId,
      childIds: [],
    };

    this.nodes.set(id, node);

    // Register as child of parent
    if (parentId !== undefined) {
      const parent = this.nodes.get(parentId);
      if (parent) {
        parent.childIds.push(id);
      }
    }

    this._notify();
    return node;
  },

  /**
   * Register a new entity with an exact name (used when restoring from a saved scene).
   */
  addObjectWithName(entity: Entity, exactName: string, parentId?: number): SceneNode {
    const id = nextId++;

    const node: SceneNode = {
      id,
      name: exactName,
      entity,
      parentId,
      childIds: [],
    };

    this.nodes.set(id, node);

    if (parentId !== undefined) {
      const parent = this.nodes.get(parentId);
      if (parent) {
        parent.childIds.push(id);
      }
    }

    this._notify();
    return node;
  },

  /**
   * Remove a node (and recursively its children) from the scene.
   */
  removeObject(id: number): void {
    const node = this.nodes.get(id);
    if (!node) return;

    // Recurse into children first
    for (const childId of [...node.childIds]) {
      this.removeObject(childId);
    }

    // Detach from parent's child list
    if (node.parentId !== undefined) {
      const parent = this.nodes.get(node.parentId);
      if (parent) {
        const idx = parent.childIds.indexOf(id);
        if (idx !== -1) parent.childIds.splice(idx, 1);
      }
    }

    if (this.selectedId === id) {
      this.selectedId = undefined;
    }

    this.nodes.delete(id);
    this._notify();
  },

  /**
   * Find the scene node ID for a given entity, or undefined if not tracked.
   */
  findByEntity(entity: Entity): SceneNode | undefined {
    for (const node of this.nodes.values()) {
      if (node.entity === entity) return node;
    }
    return undefined;
  },

  /**
   * Set the selected node by ID. Pass undefined to deselect.
   */
  selectObject(id: number | undefined): void {
    this.selectedId = id;
    this._notify();
  },

  /**
   * Returns all root-level nodes (no parent).
   */
  getRoots(): SceneNode[] {
    const roots: SceneNode[] = [];
    for (const node of this.nodes.values()) {
      if (node.parentId === undefined) {
        roots.push(node);
      }
    }
    return roots;
  },

  /**
   * Remove all nodes without firing onChange for each one (used by scene load).
   * Call _notify() once after clearing.
   */
  clearAll(): void {
    this.nodes.clear();
    this.selectedId = undefined;
  },

  getNode(id: number): SceneNode | undefined {
    return this.nodes.get(id);
  },

  _notify() {
    for (const cb of this.onChange) cb();
  },
};
