import { Entity } from "../../Yuu API/Entity";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Color } from "../../Yuu API/Basic Types/Color";
import { LayoutContext, MenuComponent } from "./MenuComponent";
import { createMenuButton } from "./MenuButton";
import { createMenuLabel } from "./MenuLabel";
import { ModelingTool } from "../Core/ModelingTool";
import { Shaders } from "../Shaders";

const COLORS: { label: string; color: Color }[] = [
  { label: 'Red',    color: new Color(1.0, 0.15, 0.15) },
  { label: 'Grn',    color: new Color(0.1, 0.9, 0.15)  },
  { label: 'Blu',    color: new Color(0.15, 0.3, 1.0)  },
  { label: 'Yel',    color: new Color(1.0, 0.9, 0.05)  },
  { label: 'Org',    color: new Color(1.0, 0.5, 0.05)  },
  { label: 'Cyn',    color: new Color(0.1, 0.9, 0.9)   },
  { label: 'Pur',    color: new Color(0.7, 0.1, 0.9)   },
  { label: 'Pnk',    color: new Color(1.0, 0.3, 0.6)   },
  { label: 'Wht',    color: new Color(1.0, 1.0, 1.0)   },
  { label: 'Gry',    color: new Color(0.5, 0.5, 0.5)   },
  { label: 'Blk',    color: new Color(0.05, 0.05, 0.05)},
];

const ALPHA_STEPS = [0.1, 0.25, 0.5, 0.75, 1.0];
let currentAlpha = 1.0;

export class MaterialPanel implements MenuComponent {
  render(parent: Entity, context: LayoutContext): Entity[] {
    const elements: Entity[] = [];
    const smallBtnSize = new Vector3(0.045, 0.045, 0.01);
    const buttonSize   = new Vector3(0.15, 0.05, 0.01);
    const colsPerRow   = 4;

    // ── Colors Section ────────────────────────────────────────────────────────
    const colLabelPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
    elements.push(createMenuLabel(parent, 'Colors', colLabelPos, 1.5, Color.white));
    context.yPos -= 0.03;

    // Render color swatches in rows of colsPerRow
    for (let i = 0; i < COLORS.length; i++) {
      const col = i % colsPerRow;
      if (col === 0 && i > 0) {
        context.yPos -= 0.052;
      }
      const xOff = (col - (colsPerRow / 2 - 0.5)) * 0.052;
      const pos  = new Vector3(context.offset.x + xOff, context.yPos + context.offset.y, context.offset.z);
      const { label, color } = COLORS[i];
      const btn = createMenuButton(parent, label, pos, smallBtnSize, color, () => {
        ModelingTool.setMaterialColor(color);
      });
      elements.push(btn);
    }
    context.yPos -= 0.065;

    // ── Alpha Row ─────────────────────────────────────────────────────────────
    const alphaLabelPos = new Vector3(context.offset.x - 0.07, context.yPos + context.offset.y, context.offset.z);
    elements.push(createMenuLabel(parent, 'Alpha:', alphaLabelPos, 1.2, Color.white));

    for (let i = 0; i < ALPHA_STEPS.length; i++) {
      const a     = ALPHA_STEPS[i];
      const xOff  = (i - 2) * 0.038;
      const isActive = Math.abs(currentAlpha - a) < 0.01;
      const btnColor = isActive ? new Color(0.35, 0.55, 0.35) : new Color(0.2, 0.2, 0.2);
      const pos   = new Vector3(context.offset.x + xOff + 0.02, context.yPos + context.offset.y, context.offset.z);
      const label = `${Math.round(a * 100)}%`;
      const btn = createMenuButton(parent, label, pos, new Vector3(0.034, 0.03, 0.01), btnColor, () => {
        currentAlpha = a;
        const ent = ModelingTool.selectedEntity;
        if (ent) {
          ModelingTool.setMaterialColorAlpha(ent.customColor, a);
        }
      });
      elements.push(btn);
    }
    context.yPos -= 0.05;

    // ── Shaders Section ───────────────────────────────────────────────────────
    const shadLabelPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
    elements.push(createMenuLabel(parent, 'Shaders', shadLabelPos, 1.5, Color.white));
    context.yPos -= 0.03;

    const createBtn = (label: string, action: () => void) => {
      const pos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
      const btn = createMenuButton(parent, label, pos, buttonSize, new Color(0.2, 0.2, 0.2), action);
      elements.push(btn);
      context.yPos -= context.ySpacing;
    };

    createBtn('Clear Shader', () => ModelingTool.setMaterialShader(undefined));
    createBtn('Pulse',        () => ModelingTool.setMaterialShader(Shaders.Pulse));
    createBtn('Hologram',     () => ModelingTool.setMaterialShader(Shaders.Hologram));
    createBtn('Wobble',       () => ModelingTool.setMaterialShader(Shaders.Wobble));

    return elements;
  }
}
