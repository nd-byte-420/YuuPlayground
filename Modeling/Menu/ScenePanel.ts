import { Entity } from "../../Yuu API/Entity";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Color } from "../../Yuu API/Basic Types/Color";
import { LayoutContext, MenuComponent } from "./MenuComponent";
import { createMenuButton } from "./MenuButton";
import { createMenuLabel } from "./MenuLabel";
import { SceneManager, SceneNode } from "../Core/SceneManager";
import { ModelingTool } from "../Core/ModelingTool";
import { EditMode } from "../EditMode/EditMode";
import { SceneIOPanel } from "./SceneIOPanel";

// ── Persistent sub-tab & expand state ─────────────────────────────────────────
const expandedIds = new Set<number>();
let activeSubTab: 'Objects' | 'SaveLoad' = 'Objects';

export class ScenePanel implements MenuComponent {
  constructor(private rebuild?: () => void) {}

  render(parent: Entity, context: LayoutContext): Entity[] {
    const elements: Entity[] = [];

    // ── Sub-tab row ────────────────────────────────────────────────────────────
    const tabWidth  = 0.072;
    const tabHeight = 0.03;
    const subTabs: { label: string; tab: 'Objects' | 'SaveLoad' }[] = [
      { label: 'Objects',   tab: 'Objects'  },
      { label: 'Save/Load', tab: 'SaveLoad' },
    ];
    let xPosTab = context.offset.x - 0.036;
    for (const st of subTabs) {
      const isActive = activeSubTab === st.tab;
      const color    = isActive ? new Color(0.35, 0.35, 0.35) : new Color(0.18, 0.18, 0.18);
      const tabPos   = new Vector3(xPosTab, context.yPos + context.offset.y, context.offset.z);
      const capturedTab = st.tab;
      const tabBtn = createMenuButton(parent, st.label, tabPos, new Vector3(tabWidth, tabHeight, 0.01), color, () => {
        activeSubTab = capturedTab;
        this.rebuild?.();
      });
      elements.push(tabBtn);
      xPosTab += tabWidth + 0.005;
    }
    context.yPos -= context.ySpacing;

    // ── Content ────────────────────────────────────────────────────────────────
    if (activeSubTab === 'SaveLoad') {
      const ioPanel   = new SceneIOPanel(this.rebuild);
      const ioElements = ioPanel.render(parent, context);
      elements.push(...ioElements);
    } else {
      this.renderObjectsTab(parent, context, elements);
    }

    return elements;
  }

  private renderObjectsTab(parent: Entity, context: LayoutContext, elements: Entity[]): void {
    const roots = SceneManager.getRoots();

    if (roots.length === 0) {
      const emptyPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
      elements.push(createMenuLabel(parent, 'No objects in scene', emptyPos, 1.0, new Color(0.5, 0.5, 0.5)));
      context.yPos -= context.ySpacing;
      return;
    }

    for (const root of roots) {
      this.renderNode(root, 0, parent, context, elements);
    }

    // ── Selected-object actions ────────────────────────────────────────────────
    const selectedId = SceneManager.selectedId;
    if (selectedId !== undefined) {
      const node = SceneManager.getNode(selectedId);
      if (node) {
        context.yPos -= 0.01;
        this.renderNodeActions(node, parent, context, elements);
      }
    }
  }

  private renderNode(node: SceneNode, depth: number, parent: Entity, context: LayoutContext, elements: Entity[]): void {
    const hasChildren = node.childIds.length > 0;
    const isExpanded  = expandedIds.has(node.id);
    const isSelected  = SceneManager.selectedId === node.id;

    const indent      = depth * 0.015;
    const arrowPrefix = hasChildren ? (isExpanded ? 'v ' : '> ') : '  ';
    const label       = arrowPrefix + node.name;

    const bgColor = isSelected
      ? new Color(0.2, 0.45, 0.2)
      : depth === 0
      ? new Color(0.22, 0.22, 0.22)
      : new Color(0.16, 0.16, 0.16);

    const xPos    = context.offset.x + indent;
    const rowWidth = 0.15 - indent;
    const pos  = new Vector3(xPos, context.yPos + context.offset.y, context.offset.z);
    const size = new Vector3(Math.max(rowWidth, 0.05), 0.04, 0.01);

    const capturedNode = node;
    const btn = createMenuButton(parent, label, pos, size, bgColor, () => {
      if (hasChildren && SceneManager.selectedId === capturedNode.id) {
        if (expandedIds.has(capturedNode.id)) {
          expandedIds.delete(capturedNode.id);
        } else {
          expandedIds.add(capturedNode.id);
        }
        this.rebuild?.();
      } else {
        if (hasChildren) expandedIds.add(capturedNode.id);
        this.selectNode(capturedNode);
      }
    });

    elements.push(btn);
    context.yPos -= 0.045;

    if (hasChildren && isExpanded) {
      for (const childId of node.childIds) {
        const childNode = SceneManager.getNode(childId);
        if (childNode) {
          this.renderNode(childNode, depth + 1, parent, context, elements);
        }
      }
    }
  }

  /** Render Rename / Duplicate / Delete action buttons for the selected node. */
  private renderNodeActions(node: SceneNode, parent: Entity, context: LayoutContext, elements: Entity[]): void {
    const actionBtnSize = new Vector3(0.046, 0.033, 0.01);
    const labels = ['Rename', 'Dupl.', 'Delete'];
    const colors  = [
      new Color(0.2, 0.35, 0.5),  // blue-ish – rename
      new Color(0.3, 0.5, 0.2),   // green-ish – duplicate
      new Color(0.5, 0.15, 0.15), // red-ish – delete
    ];
    const xOffsets = [-0.05, 0.0, 0.05];

    // Section label
    const actionLabelPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
    elements.push(createMenuLabel(parent, 'Object:', actionLabelPos, 1.0, new Color(0.6, 0.6, 0.6)));

    labels.forEach((label, i) => {
      const btnPos = new Vector3(context.offset.x + xOffsets[i], context.yPos + context.offset.y, context.offset.z);
      const btn = createMenuButton(parent, label, btnPos, actionBtnSize, colors[i], () => {
        if (label === 'Rename') {
          this.renameNode(node);
        } else if (label === 'Dupl.') {
          this.duplicateNode(node);
        } else if (label === 'Delete') {
          this.deleteNode(node);
        }
      });
      elements.push(btn);
    });
    context.yPos -= 0.045;
  }

  private selectNode(node: SceneNode): void {
    SceneManager.selectObject(node.id);

    if (EditMode.active && EditMode.targetEntity !== node.entity) {
      EditMode.exit();
    }

    ModelingTool.selectEntity(node.entity);
  }

  private renameNode(node: SceneNode): void {
    // Cycle through a simple set of suffix names on each press
    const baseName = node.name.replace(/_\d+$/, '');
    const suffixes = ['_A', '_B', '_C', '_copy', ''];
    const currentSuffix = node.name.slice(baseName.length);
    const nextIdx = (suffixes.indexOf(currentSuffix) + 1) % suffixes.length;
    node.name = baseName + suffixes[nextIdx];
    SceneManager._notify();
  }

  private duplicateNode(node: SceneNode): void {
    ModelingTool.selectEntity(node.entity);
    ModelingTool.duplicateSelected();
  }

  private deleteNode(node: SceneNode): void {
    ModelingTool.deleteEntity(node.entity);
  }
}
