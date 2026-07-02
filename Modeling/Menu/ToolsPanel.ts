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
import { Gizmo } from "../Gizmo/Gizmo";
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

        // Gizmo Drag Mode
        const gizmoLabelPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, 'Gizmo Drag:', gizmoLabelPos, 1.1, Color.white));
        
        const gizmoModeSize = new Vector3(0.055, 0.03, 0.01);
        const offsetDragPos = new Vector3(context.offset.x + 0.015, context.yPos + context.offset.y, context.offset.z);
        const offsetDragColor = Gizmo.textureGizmoMode === 'Offset' ? new Color(0.3, 0.5, 0.3) : new Color(0.2, 0.2, 0.2);
        elements.push(createMenuButton(parent, 'Offset', offsetDragPos, gizmoModeSize, offsetDragColor, () => {
          Gizmo.textureGizmoMode = 'Offset';
          this.rebuild();
        }));

        const tileDragPos = new Vector3(context.offset.x + 0.075, context.yPos + context.offset.y, context.offset.z);
        const tileDragColor = Gizmo.textureGizmoMode === 'Tile' ? new Color(0.3, 0.5, 0.3) : new Color(0.2, 0.2, 0.2);
        elements.push(createMenuButton(parent, 'Tile', tileDragPos, gizmoModeSize, tileDragColor, () => {
          Gizmo.textureGizmoMode = 'Tile';
          this.rebuild();
        }));
        context.yPos -= 0.04;

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

        // Projection mapping - Row 2 (X, Y, Z planes)
        const row2BtnSize = new Vector3(0.045, 0.032, 0.01);
        const planarXPos = new Vector3(context.offset.x - 0.05, context.yPos + context.offset.y, context.offset.z);
        const planarXColor = settings.mappingMode === 'planar-x' ? new Color(0.3, 0.5, 0.3) : new Color(0.2, 0.2, 0.2);
        const planarXBtn = createMenuButton(parent, 'Proj X', planarXPos, row2BtnSize, planarXColor, () => {
          settings.mappingMode = 'planar-x';
          updateEntityMeshTexture(ent);
          this.rebuild();
        });
        elements.push(planarXBtn);

        const planarYPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
        const planarYColor = settings.mappingMode === 'planar-y' ? new Color(0.3, 0.5, 0.3) : new Color(0.2, 0.2, 0.2);
        const planarYBtn = createMenuButton(parent, 'Proj Y', planarYPos, row2BtnSize, planarYColor, () => {
          settings.mappingMode = 'planar-y';
          updateEntityMeshTexture(ent);
          this.rebuild();
        });
        elements.push(planarYBtn);

        const planarZPos = new Vector3(context.offset.x + 0.05, context.yPos + context.offset.y, context.offset.z);
        const planarZColor = settings.mappingMode === 'planar-z' ? new Color(0.3, 0.5, 0.3) : new Color(0.2, 0.2, 0.2);
        const planarZBtn = createMenuButton(parent, 'Proj Z', planarZPos, row2BtnSize, planarZColor, () => {
          settings.mappingMode = 'planar-z';
          updateEntityMeshTexture(ent);
          this.rebuild();
        });
        elements.push(planarZBtn);

        context.yPos -= 0.04;

        // Projection mapping - Row 3 (Triplanar, Spherical, Cylindrical)
        const triplanarPos = new Vector3(context.offset.x - 0.05, context.yPos + context.offset.y, context.offset.z);
        const triplanarColor = settings.mappingMode === 'triplanar' ? new Color(0.3, 0.5, 0.3) : new Color(0.2, 0.2, 0.2);
        const triplanarBtn = createMenuButton(parent, 'Tripln', triplanarPos, row2BtnSize, triplanarColor, () => {
          settings.mappingMode = 'triplanar';
          updateEntityMeshTexture(ent);
          this.rebuild();
        });
        elements.push(triplanarBtn);

        const sphericalPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
        const sphericalColor = settings.mappingMode === 'spherical' ? new Color(0.3, 0.5, 0.3) : new Color(0.2, 0.2, 0.2);
        const sphericalBtn = createMenuButton(parent, 'Sphere', sphericalPos, row2BtnSize, sphericalColor, () => {
          settings.mappingMode = 'spherical';
          updateEntityMeshTexture(ent);
          this.rebuild();
        });
        elements.push(sphericalBtn);

        const cylindricalPos = new Vector3(context.offset.x + 0.05, context.yPos + context.offset.y, context.offset.z);
        const cylindricalColor = settings.mappingMode === 'cylindrical' ? new Color(0.3, 0.5, 0.3) : new Color(0.2, 0.2, 0.2);
        const cylindricalBtn = createMenuButton(parent, 'Cylndr', cylindricalPos, row2BtnSize, cylindricalColor, () => {
          settings.mappingMode = 'cylindrical';
          updateEntityMeshTexture(ent);
          this.rebuild();
        });
        elements.push(cylindricalBtn);

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
        
        context.yPos -= 0.04;

        // Tiling / Scale Section
        const scaleLabelPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, 'Tiling (Scale):', scaleLabelPos, 1.1, Color.white));
        context.yPos -= 0.035;

        const tileBtnSize = new Vector3(0.03, 0.03, 0.01);

        // U Scale Row
        const uScaleLblPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, 'U:', uScaleLblPos, 1.0, new Color(0.8, 0.8, 0.8)));

        const uScaleMinusPos = new Vector3(context.offset.x - 0.04, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuButton(parent, '-', uScaleMinusPos, tileBtnSize, new Color(0.25, 0.25, 0.25), () => {
          settings.scale.x = Math.max(0.1, settings.scale.x - 0.25);
          updateEntityMeshTexture(ent);
          this.rebuild();
        }));

        const uScaleValPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, settings.scale.x.toFixed(2), uScaleValPos, 1.0, Color.white));

        const uScalePlusPos = new Vector3(context.offset.x + 0.04, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuButton(parent, '+', uScalePlusPos, tileBtnSize, new Color(0.25, 0.25, 0.25), () => {
          settings.scale.x += 0.25;
          updateEntityMeshTexture(ent);
          this.rebuild();
        }));
        context.yPos -= 0.04;

        // V Scale Row
        const vScaleLblPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, 'V:', vScaleLblPos, 1.0, new Color(0.8, 0.8, 0.8)));

        const vScaleMinusPos = new Vector3(context.offset.x - 0.04, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuButton(parent, '-', vScaleMinusPos, tileBtnSize, new Color(0.25, 0.25, 0.25), () => {
          settings.scale.y = Math.max(0.1, settings.scale.y - 0.25);
          updateEntityMeshTexture(ent);
          this.rebuild();
        }));

        const vScaleValPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, settings.scale.y.toFixed(2), vScaleValPos, 1.0, Color.white));

        const vScalePlusPos = new Vector3(context.offset.x + 0.04, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuButton(parent, '+', vScalePlusPos, tileBtnSize, new Color(0.25, 0.25, 0.25), () => {
          settings.scale.y += 0.25;
          updateEntityMeshTexture(ent);
          this.rebuild();
        }));
        context.yPos -= 0.04;

        // Offset Section
        const offsetLabelPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, 'Offset:', offsetLabelPos, 1.1, Color.white));
        context.yPos -= 0.035;

        // U Offset Row
        const uOffsetLblPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, 'U:', uOffsetLblPos, 1.0, new Color(0.8, 0.8, 0.8)));

        const uOffsetMinusPos = new Vector3(context.offset.x - 0.04, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuButton(parent, '<', uOffsetMinusPos, tileBtnSize, new Color(0.25, 0.25, 0.25), () => {
          settings.offset.x -= 0.05;
          updateEntityMeshTexture(ent);
          this.rebuild();
        }));

        const uOffsetValPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, settings.offset.x.toFixed(2), uOffsetValPos, 1.0, Color.white));

        const uOffsetPlusPos = new Vector3(context.offset.x + 0.04, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuButton(parent, '>', uOffsetPlusPos, tileBtnSize, new Color(0.25, 0.25, 0.25), () => {
          settings.offset.x += 0.05;
          updateEntityMeshTexture(ent);
          this.rebuild();
        }));
        context.yPos -= 0.04;

        // V Offset Row
        const vOffsetLblPos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, 'V:', vOffsetLblPos, 1.0, new Color(0.8, 0.8, 0.8)));

        const vOffsetMinusPos = new Vector3(context.offset.x - 0.04, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuButton(parent, '<', vOffsetMinusPos, tileBtnSize, new Color(0.25, 0.25, 0.25), () => {
          settings.offset.y -= 0.05;
          updateEntityMeshTexture(ent);
          this.rebuild();
        }));

        const vOffsetValPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuLabel(parent, settings.offset.y.toFixed(2), vOffsetValPos, 1.0, Color.white));

        const vOffsetPlusPos = new Vector3(context.offset.x + 0.04, context.yPos + context.offset.y, context.offset.z);
        elements.push(createMenuButton(parent, '>', vOffsetPlusPos, tileBtnSize, new Color(0.25, 0.25, 0.25), () => {
          settings.offset.y += 0.05;
          updateEntityMeshTexture(ent);
          this.rebuild();
        }));
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
