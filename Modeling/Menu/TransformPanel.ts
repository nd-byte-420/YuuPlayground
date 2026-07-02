import { Entity } from "../../Yuu API/Entity";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Color } from "../../Yuu API/Basic Types/Color";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { Keyboard } from "../../Yuu API/Keyboard";
import { LayoutContext, MenuComponent } from "./MenuComponent";
import { createMenuButton } from "./MenuButton";
import { createMenuLabel } from "./MenuLabel";
import { ModelingTool } from "../Core/ModelingTool";
import { EditMode } from "../EditMode/EditMode";
import { quatToEulerDegrees } from "../Core/MathUtils";

export class TransformPanel implements MenuComponent {
  private locationLabel?: Entity;
  private rotationLabel?: Entity;
  private scaleLabel?: Entity;
  private editableLabels: Record<string, Entity> = {};

  render(parent: Entity, context: LayoutContext): Entity[] {
    const elements: Entity[] = [];
    const smallBtnSize = new Vector3(0.035, 0.035, 0.01);
    const inputBtnSize = new Vector3(0.07, 0.035, 0.01);

    const createTransformRow = (label: string, idPrefix: string, yPosArg: number, onMinus: () => void, onPlus: () => void, getCurrent: () => string) => {
      const labelPos = new Vector3(context.offset.x - 0.08, yPosArg + context.offset.y, context.offset.z);
      const rowLabel = createMenuLabel(parent, label, labelPos, 1.2, Color.white);
      elements.push(rowLabel);

      const minusPos = new Vector3(context.offset.x - 0.04, yPosArg + context.offset.y, context.offset.z);
      const minusBtn = createMenuButton(parent, '-', minusPos, smallBtnSize, new Color(0.5, 0.2, 0.2), onMinus);
      elements.push(minusBtn);

      const inputPos = new Vector3(context.offset.x + 0.02, yPosArg + context.offset.y, context.offset.z);
      const inputBtn = createMenuButton(parent, '0.00', inputPos, inputBtnSize, new Color(0.2, 0.2, 0.2), () => {
        if (context.setKeyboardTarget) {
          context.setKeyboardTarget(idPrefix);
        }
        Keyboard.show(getCurrent());
      });
      elements.push(inputBtn);
      this.editableLabels[idPrefix] = inputBtn;

      const plusPos = new Vector3(context.offset.x + 0.08, yPosArg + context.offset.y, context.offset.z);
      const plusBtn = createMenuButton(parent, '+', plusPos, smallBtnSize, new Color(0.2, 0.5, 0.2), onPlus);
      elements.push(plusBtn);
    };

    // ── Location ──────────────────────────────────────────────────────────────
    const locPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
    this.locationLabel = createMenuLabel(parent, 'Location', locPos, 1.2, new Color(0.7, 0.7, 0.7));
    elements.push(this.locationLabel);
    context.yPos -= 0.04;

    createTransformRow('X:', 'PosX', context.yPos,
      () => ModelingTool.translateSelected(new Vector3(-0.1, 0, 0)),
      () => ModelingTool.translateSelected(new Vector3(0.1, 0, 0)),
      () => {
        if (EditMode.active) return EditMode.getSelectedVerticesCenter().x.toString();
        return ModelingTool.selectedEntity?.pos.x.toString() || '';
      }
    );
    context.yPos -= 0.04;

    createTransformRow('Y:', 'PosY', context.yPos,
      () => ModelingTool.translateSelected(new Vector3(0, -0.1, 0)),
      () => ModelingTool.translateSelected(new Vector3(0, 0.1, 0)),
      () => {
        if (EditMode.active) return EditMode.getSelectedVerticesCenter().y.toString();
        return ModelingTool.selectedEntity?.pos.y.toString() || '';
      }
    );
    context.yPos -= 0.04;

    createTransformRow('Z:', 'PosZ', context.yPos,
      () => ModelingTool.translateSelected(new Vector3(0, 0, -0.1)),
      () => ModelingTool.translateSelected(new Vector3(0, 0, 0.1)),
      () => {
        if (EditMode.active) return EditMode.getSelectedVerticesCenter().z.toString();
        return ModelingTool.selectedEntity?.pos.z.toString() || '';
      }
    );
    context.yPos -= 0.06;

    // ── Rotation ──────────────────────────────────────────────────────────────
    const rotPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
    this.rotationLabel = createMenuLabel(parent, 'Rotation (Deg)', rotPos, 1.2, new Color(0.7, 0.7, 0.7));
    elements.push(this.rotationLabel);
    context.yPos -= 0.04;

    const rotStep = 15 * (Math.PI / 180);
    createTransformRow('X:', 'RotX', context.yPos,
      () => ModelingTool.rotateSelected(new Vector3(-rotStep, 0, 0)),
      () => ModelingTool.rotateSelected(new Vector3(rotStep, 0, 0)),
      () => {
        if (EditMode.active) return '0.0';
        return ModelingTool.selectedEntity ? quatToEulerDegrees(ModelingTool.selectedEntity.rot).x.toString() : '';
      }
    );
    context.yPos -= 0.04;

    createTransformRow('Y:', 'RotY', context.yPos,
      () => ModelingTool.rotateSelected(new Vector3(0, -rotStep, 0)),
      () => ModelingTool.rotateSelected(new Vector3(0, rotStep, 0)),
      () => {
        if (EditMode.active) return '0.0';
        return ModelingTool.selectedEntity ? quatToEulerDegrees(ModelingTool.selectedEntity.rot).y.toString() : '';
      }
    );
    context.yPos -= 0.04;

    createTransformRow('Z:', 'RotZ', context.yPos,
      () => ModelingTool.rotateSelected(new Vector3(0, 0, -rotStep)),
      () => ModelingTool.rotateSelected(new Vector3(0, 0, rotStep)),
      () => {
        if (EditMode.active) return '0.0';
        return ModelingTool.selectedEntity ? quatToEulerDegrees(ModelingTool.selectedEntity.rot).z.toString() : '';
      }
    );
    context.yPos -= 0.06;

    // ── Scale ─────────────────────────────────────────────────────────────────
    const scalePos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
    this.scaleLabel = createMenuLabel(parent, 'Scale', scalePos, 1.2, new Color(0.7, 0.7, 0.7));
    elements.push(this.scaleLabel);
    context.yPos -= 0.04;

    createTransformRow('X:', 'ScaleX', context.yPos,
      () => ModelingTool.scaleSelected(new Vector3(-0.1, 0, 0)),
      () => ModelingTool.scaleSelected(new Vector3(0.1, 0, 0)),
      () => {
        if (EditMode.active) return '1.00';
        return ModelingTool.selectedEntity?.scale.x.toString() || '';
      }
    );
    context.yPos -= 0.04;

    createTransformRow('Y:', 'ScaleY', context.yPos,
      () => ModelingTool.scaleSelected(new Vector3(0, -0.1, 0)),
      () => ModelingTool.scaleSelected(new Vector3(0, 0.1, 0)),
      () => {
        if (EditMode.active) return '1.00';
        return ModelingTool.selectedEntity?.scale.y.toString() || '';
      }
    );
    context.yPos -= 0.04;

    createTransformRow('Z:', 'ScaleZ', context.yPos,
      () => ModelingTool.scaleSelected(new Vector3(0, 0, -0.1)),
      () => ModelingTool.scaleSelected(new Vector3(0, 0, 0.1)),
      () => {
        if (EditMode.active) return '1.00';
        return ModelingTool.selectedEntity?.scale.z.toString() || '';
      }
    );
    context.yPos -= 0.04;

    return elements;
  }

  update(_deltaTime: number): void {
    const ent = ModelingTool.selectedEntity;
    if (ent) {
      if (EditMode.active) {
        const p = EditMode.getSelectedVerticesCenter();
        const selectedCount = EditMode.getSelectedUniqueVertexIndices().size;

        if (this.locationLabel) this.locationLabel.text.set(`Pos: ${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}`);
        if (this.rotationLabel) this.rotationLabel.text.set(`Selected: ${selectedCount} verts`);
        if (this.scaleLabel)    this.scaleLabel.text.set(`Scl: 1.00, 1.00, 1.00`);

        if (this.editableLabels['PosX']) this.editableLabels['PosX'].childEntities[0].text.set(p.x.toFixed(2));
        if (this.editableLabels['PosY']) this.editableLabels['PosY'].childEntities[0].text.set(p.y.toFixed(2));
        if (this.editableLabels['PosZ']) this.editableLabels['PosZ'].childEntities[0].text.set(p.z.toFixed(2));

        if (this.editableLabels['RotX']) this.editableLabels['RotX'].childEntities[0].text.set('0.0');
        if (this.editableLabels['RotY']) this.editableLabels['RotY'].childEntities[0].text.set('0.0');
        if (this.editableLabels['RotZ']) this.editableLabels['RotZ'].childEntities[0].text.set('0.0');

        if (this.editableLabels['ScaleX']) this.editableLabels['ScaleX'].childEntities[0].text.set('1.00');
        if (this.editableLabels['ScaleY']) this.editableLabels['ScaleY'].childEntities[0].text.set('1.00');
        if (this.editableLabels['ScaleZ']) this.editableLabels['ScaleZ'].childEntities[0].text.set('1.00');
      } else {
        const p = ent.pos;
        const euler = quatToEulerDegrees(ent.rot);
        const s = ent.scale;

        if (this.locationLabel) this.locationLabel.text.set(`Pos: ${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}`);
        if (this.rotationLabel) this.rotationLabel.text.set(`Rot: ${euler.x.toFixed(1)}, ${euler.y.toFixed(1)}, ${euler.z.toFixed(1)}`);
        if (this.scaleLabel)    this.scaleLabel.text.set(`Scl: ${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)}`);

        if (this.editableLabels['PosX']) this.editableLabels['PosX'].childEntities[0].text.set(p.x.toFixed(2));
        if (this.editableLabels['PosY']) this.editableLabels['PosY'].childEntities[0].text.set(p.y.toFixed(2));
        if (this.editableLabels['PosZ']) this.editableLabels['PosZ'].childEntities[0].text.set(p.z.toFixed(2));

        if (this.editableLabels['RotX']) this.editableLabels['RotX'].childEntities[0].text.set(euler.x.toFixed(1));
        if (this.editableLabels['RotY']) this.editableLabels['RotY'].childEntities[0].text.set(euler.y.toFixed(1));
        if (this.editableLabels['RotZ']) this.editableLabels['RotZ'].childEntities[0].text.set(euler.z.toFixed(1));

        if (this.editableLabels['ScaleX']) this.editableLabels['ScaleX'].childEntities[0].text.set(s.x.toFixed(2));
        if (this.editableLabels['ScaleY']) this.editableLabels['ScaleY'].childEntities[0].text.set(s.y.toFixed(2));
        if (this.editableLabels['ScaleZ']) this.editableLabels['ScaleZ'].childEntities[0].text.set(s.z.toFixed(2));
      }
    } else {
      if (this.locationLabel) this.locationLabel.text.set(`Location`);
      if (this.rotationLabel) this.rotationLabel.text.set(`Rotation`);
      if (this.scaleLabel)    this.scaleLabel.text.set(`Scale`);

      for (const key in this.editableLabels) {
        this.editableLabels[key].childEntities[0].text.set('0.00');
      }
    }
  }
}
