import { Entity } from "../../Yuu API/Entity";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Color } from "../../Yuu API/Basic Types/Color";
import { Keyboard } from "../../Yuu API/Keyboard";
import { LayoutContext, MenuComponent } from "./MenuComponent";
import { createMenuButton } from "./MenuButton";
import { createMenuLabel } from "./MenuLabel";
import { ModelingTool, ModelingMode } from "../Core/ModelingTool";
import { EditMode } from "../EditMode/EditMode";
import { EditModePanel } from "./EditModePanel";
import { 
  findLoadablePNGs, 
  getTextureSettings, 
  updateEntityMeshTexture, 
  applyTextureToEntity 
} from "../Core/TextureEditor";

export class ToolsPanel implements MenuComponent {
  constructor(private rebuild: () => void) {}

  render(parent: Entity, context: LayoutContext): Entity[] {
    const elements: Entity[] = [];
    const buttonSize = new Vector3(0.15, 0.05, 0.01);

    const createMenuBtn = (label: string, action: () => void, color: Color = new Color(0.2, 0.2, 0.2)) => {
      const pos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
      const btn = createMenuButton(parent, label, pos, buttonSize, color, action);
      elements.push(btn);
      context.yPos -= context.ySpacing;
    };

    if (ModelingTool.currentMode === 'EditMode') {
      // Exit button
      createMenuBtn('Exit Edit Mode', () => {
        ModelingTool.setMode('Select');
        this.rebuild();
      }, new Color(0.45, 0.15, 0.15));

      // Delegate full edit-mode toolbar to EditModePanel
      const editPanel = new EditModePanel(this.rebuild);
      const editEls   = editPanel.render(parent, context);
      elements.push(...editEls);
    } else if (ModelingTool.currentMode === 'Texture') {
      // Exit button
      createMenuBtn('Exit Texture Ed', () => {
        ModelingTool.setMode('Select');
        this.rebuild();
      }, new Color(0.45, 0.15, 0.15));

      const ent = ModelingTool.selectedEntity;
      if (!ent) {
        const labelPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, 'Select obj to texture', labelPos, 1.1, Color.white));
        context.yPos -= context.ySpacing;
      } else {
        const settings = getTextureSettings(ent);
        const loadablePNGs = findLoadablePNGs();

        // Title Label for textures
        const texLabelPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, 'Textures:', texLabelPos, 1.0, Color.white));
        context.yPos -= 0.035;

        // Render texture list
        const maxButtons = 4;
        const displayPNGs = loadablePNGs.slice(0, maxButtons);
        const textBtnSize = new Vector3(0.15, 0.035, 0.01);
        for (const png of displayPNGs) {
          const isSelected = settings.selectedPNGName === png.name;
          const color = isSelected ? new Color(0.3, 0.5, 0.3) : new Color(0.2, 0.2, 0.2);
          
          const pos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
          const btn = createMenuButton(parent, png.displayName, pos, textBtnSize, color, () => {
            applyTextureToEntity(ent, png);
            this.rebuild();
          });
          elements.push(btn);
          context.yPos -= 0.042;
        }

        context.yPos -= 0.01;

        // Mapping Mode (Wrap / Face) side-by-side
        const modeBtnSize = new Vector3(0.07, 0.032, 0.01);
        
        const wrapPos = new Vector3(context.offset.x - 0.04, context.yPos + context.offset.y, context.offset.z);
        const wrapColor = settings.mappingMode === 'wrap' ? new Color(0.3, 0.5, 0.3) : new Color(0.2, 0.2, 0.2);
        const wrapBtn = createMenuButton(parent, 'Wrap', wrapPos, modeBtnSize, wrapColor, () => {
          if (settings.mappingMode !== 'wrap') {
            settings.mappingMode = 'wrap';
            updateEntityMeshTexture(ent);
            this.rebuild();
          }
        });
        elements.push(wrapBtn);

        const facePos = new Vector3(context.offset.x + 0.04, context.yPos + context.offset.y, context.offset.z);
        const faceColor = settings.mappingMode === 'face' ? new Color(0.3, 0.5, 0.3) : new Color(0.2, 0.2, 0.2);
        const faceBtn = createMenuButton(parent, 'Face', facePos, modeBtnSize, faceColor, () => {
          if (settings.mappingMode !== 'face') {
            settings.mappingMode = 'face';
            updateEntityMeshTexture(ent);
            this.rebuild();
          }
        });
        elements.push(faceBtn);

        context.yPos -= 0.04;

        // Rotations side-by-side
        const rotPosCW = new Vector3(context.offset.x - 0.04, context.yPos + context.offset.y, context.offset.z);
        const rotBtnCW = createMenuButton(parent, 'Rot CW', rotPosCW, modeBtnSize, new Color(0.2, 0.2, 0.2), () => {
          settings.rotation = ((settings.rotation + 90) % 360) as any;
          updateEntityMeshTexture(ent);
          this.rebuild();
        });
        elements.push(rotBtnCW);

        const rotPosCCW = new Vector3(context.offset.x + 0.04, context.yPos + context.offset.y, context.offset.z);
        const rotBtnCCW = createMenuButton(parent, 'Rot CCW', rotPosCCW, modeBtnSize, new Color(0.2, 0.2, 0.2), () => {
          settings.rotation = ((settings.rotation + 270) % 360) as any;
          updateEntityMeshTexture(ent);
          this.rebuild();
        });
        elements.push(rotBtnCCW);
        
        context.yPos -= 0.045;
      }
    } else {
      // Object-mode tools
      const objectModes: { label: string; mode: ModelingMode }[] = [
        { label: 'Select',      mode: 'Select' },
        { label: 'Box Select',  mode: 'BoxSelect' },
        { label: 'Brush Select',mode: 'BrushSelect' },
        { label: 'Move',        mode: 'Move' },
        { label: 'Delete',      mode: 'Delete' },
        { label: 'Edit Mode',   mode: 'EditMode' },
        { label: 'Texture Ed',  mode: 'Texture' },
      ];

      for (const { label, mode } of objectModes) {
        const isActive = ModelingTool.currentMode === mode;
        const color = isActive ? new Color(0.3, 0.5, 0.3) : new Color(0.2, 0.2, 0.2);
        createMenuBtn(label, () => {
          ModelingTool.setMode(mode);
          this.rebuild();
        }, color);
      }
    }

    // ── Grid Snapping (always at bottom) ──────────────────────────────────────
    context.yPos -= 0.02;
    const snapLabelPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
    elements.push(createMenuLabel(parent, 'Grid Snap:', snapLabelPos, 1.2, Color.white));

    const snapText  = ModelingTool.gridSnappingEnabled ? 'ON' : 'OFF';
    const snapColor = ModelingTool.gridSnappingEnabled ? new Color(0.2, 0.6, 0.2) : new Color(0.2, 0.2, 0.2);
    const snapBtnPos = new Vector3(context.offset.x - 0.01, context.yPos + context.offset.y, context.offset.z);
    elements.push(createMenuButton(parent, snapText, snapBtnPos, new Vector3(0.04, 0.035, 0.01), snapColor, () => {
      ModelingTool.gridSnappingEnabled = !ModelingTool.gridSnappingEnabled;
      this.rebuild();
    }));

    const resText   = ModelingTool.gridResolution.toFixed(3);
    const resBtnPos = new Vector3(context.offset.x + 0.05, context.yPos + context.offset.y, context.offset.z);
    elements.push(createMenuButton(parent, resText, resBtnPos, new Vector3(0.06, 0.035, 0.01), new Color(0.2, 0.2, 0.2), () => {
      if (context.setKeyboardTarget) context.setKeyboardTarget('GridResolution');
      Keyboard.show(ModelingTool.gridResolution.toString());
    }));
    context.yPos -= 0.05;

    return elements;
  }
}
