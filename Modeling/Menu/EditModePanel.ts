import { Entity } from "../../Yuu API/Entity";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Color } from "../../Yuu API/Basic Types/Color";
import { LayoutContext, MenuComponent } from "./MenuComponent";
import { createMenuButton } from "./MenuButton";
import { createMenuLabel } from "./MenuLabel";
import { EditMode } from "../EditMode/EditMode";

/**
 * Renders the full Edit Mode toolbar:
 * - Tool selector (Sel / Box / Brush / Move)
 * - Selection mode (Vert / Edge / Face)
 * - Multiselect toggle
 * - Operator buttons (Extrude, Delete, Merge, Make Face, Subdivide, Duplicate)
 */
export class EditModePanel implements MenuComponent {
  constructor(private rebuild: () => void) {}

  render(parent: Entity, context: LayoutContext): Entity[] {
    const elements: Entity[] = []
    const buttonSize = new Vector3(0.15, 0.05, 0.01);

    const createBtn = (label: string, action: () => void, color: Color = new Color(0.2, 0.2, 0.2)) => {
      const pos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
      const btn = createMenuButton(parent, label, pos, buttonSize, color, action);
      elements.push(btn);
      context.yPos -= context.ySpacing;
    };

    // ── Tool selector ──────────────────────────────────────────────────────────
    const toolBtnWidth  = 0.035;
    const toolBtnSize   = new Vector3(toolBtnWidth, 0.035, 0.01);

    const toolLabelPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
    elements.push(createMenuLabel(parent, 'Tool:', toolLabelPos, 1.2, Color.white));

    const tools: ('Select' | 'BoxSelect' | 'BrushSelect' | 'Move')[] = ['Select', 'BoxSelect', 'BrushSelect', 'Move'];
    const toolLabels = ['Sel', 'Box', 'Brush', 'Move'];

    tools.forEach((t, i) => {
      const isSel = EditMode.tool === t;
      const color = isSel ? new Color(0.35, 0.55, 0.35) : new Color(0.2, 0.2, 0.2);
      const btnPos = new Vector3(context.offset.x - 0.03 + (i * 0.04), context.yPos + context.offset.y, context.offset.z);
      const btn = createMenuButton(parent, toolLabels[i], btnPos, toolBtnSize, color, () => {
        EditMode.tool = t;
        EditMode.rebuildHandles();
        this.rebuild();
      });
      elements.push(btn);
    });
    context.yPos -= 0.05;

    // ── Selection mode ─────────────────────────────────────────────────────────
    const modeBtnWidth = 0.045;
    const modeBtnSize  = new Vector3(modeBtnWidth, 0.035, 0.01);
    context.yPos -= 0.01;

    const selLabelPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
    elements.push(createMenuLabel(parent, 'Select:', selLabelPos, 1.2, Color.white));

    const selModes: ('Vertex' | 'Edge' | 'Face')[] = ['Vertex', 'Edge', 'Face'];
    const selLabels = ['Vert', 'Edge', 'Face'];
    const xOffsets  = [-0.03, 0.02, 0.07];

    selModes.forEach((m, i) => {
      const isActive = EditMode.selectionMode === m;
      const color    = isActive ? new Color(0.35, 0.55, 0.35) : new Color(0.2, 0.2, 0.2);
      const btnPos   = new Vector3(context.offset.x + xOffsets[i], context.yPos + context.offset.y, context.offset.z);
      elements.push(createMenuButton(parent, selLabels[i], btnPos, modeBtnSize, color, () => {
        EditMode.selectionMode = m;
        EditMode.rebuildHandles();
        this.rebuild();
      }));
    });
    context.yPos -= 0.05;

    // ── Multiselect toggle ─────────────────────────────────────────────────────
    const msText  = EditMode.isMultiselect ? 'Multi: ON' : 'Multi: OFF';
    const msColor = EditMode.isMultiselect ? new Color(0.2, 0.55, 0.2) : new Color(0.2, 0.2, 0.2);
    createBtn(msText, () => {
      EditMode.isMultiselect = !EditMode.isMultiselect;
      this.rebuild();
    }, msColor);

    // ── Operators ──────────────────────────────────────────────────────────────
    createBtn('Extrude', () => { EditMode.extrude(); });

    createBtn('Delete Selected', () => {
      EditMode.deleteSelected();
      this.rebuild();
    });

    if (EditMode.selectionMode === 'Vertex') {
      createBtn('Merge Verts', () => {
        EditMode.mergeVertices();
        this.rebuild();
      });
      createBtn('Make Face', () => {
        EditMode.createFace();
        this.rebuild();
      });
      createBtn('Duplicate', () => {
        EditMode.duplicateSelected();
        this.rebuild();
      });
    } else if (EditMode.selectionMode === 'Face') {
      createBtn('Subdivide', () => {
        EditMode.subdivide();
        this.rebuild();
      });
    }

    return elements;
  }
}
