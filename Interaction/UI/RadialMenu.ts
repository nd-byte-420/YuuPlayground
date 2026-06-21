import { Entity } from "../../Yuu API/Entity";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { Color } from "../../Yuu API/Basic Types/Color";
import { createUIElement } from "../../Yuu API/CreateUIElement";
import { GrabType } from "../States/GrabState";

export class RadialMenu {
  private container: Entity;
  private buttons: { entity: Entity, type: GrabType, defaultColor: Color, highlightColor: Color }[] = [];
  public currentSelection: GrabType = GrabType.FreeMove;
  private isActive: boolean = false;

  constructor(private handType: 'left' | 'right') {
    this.container = new Entity(Vector3.zero, Quaternion.one, Vector3.one, undefined, 'Empty');
    
    const size = new Vector3(0.04, 0.04, 0.04);
    const dist = 0.08;

    this.buttons.push({
      entity: createUIElement.button(new Vector3(0, dist, 0), size, Quaternion.one, "Free", Color.white, 30, Color.gray, this.container),
      type: GrabType.FreeMove,
      defaultColor: Color.gray,
      highlightColor: Color.green
    });
    this.buttons.push({
      entity: createUIElement.button(new Vector3(dist, 0, 0), size, Quaternion.one, "Axis", Color.white, 30, Color.gray, this.container),
      type: GrabType.AxisMove,
      defaultColor: Color.gray,
      highlightColor: Color.green
    });
    this.buttons.push({
      entity: createUIElement.button(new Vector3(0, -dist, 0), size, Quaternion.one, "Rot", Color.white, 30, Color.gray, this.container),
      type: GrabType.Rotate,
      defaultColor: Color.gray,
      highlightColor: Color.green
    });
    this.buttons.push({
      entity: createUIElement.button(new Vector3(-dist, 0, 0), size, Quaternion.one, "Scale", Color.white, 30, Color.gray, this.container),
      type: GrabType.Scale,
      defaultColor: Color.gray,
      highlightColor: Color.green
    });

    this.setVisible(false);
  }

  public setVisible(visible: boolean) {
    this.isActive = visible;
    this.container.visible = visible;
  }

  public update(handPos: Vector3, handRot: Quaternion, thumbstick: { x: number, y: number } | undefined): GrabType | undefined {
    this.container.pos = handPos;
    this.container.rot = handRot;

    if (!thumbstick) return undefined;

    const mag = Math.sqrt(thumbstick.x * thumbstick.x + thumbstick.y * thumbstick.y);
    
    if (mag > 0.5) {
      if (!this.isActive) this.setVisible(true);

      const angle = Math.atan2(thumbstick.y, thumbstick.x);
      
      let highlightedType = GrabType.FreeMove;
      
      if (angle >= -Math.PI / 4 && angle <= Math.PI / 4) {
        highlightedType = GrabType.AxisMove;
      } else if (angle > Math.PI / 4 && angle < 3 * Math.PI / 4) {
        highlightedType = GrabType.FreeMove;
      } else if (angle >= 3 * Math.PI / 4 || angle <= -3 * Math.PI / 4) {
        highlightedType = GrabType.Scale;
      } else {
        highlightedType = GrabType.Rotate;
      }

      this.currentSelection = highlightedType;

      for (const btn of this.buttons) {
        if (btn.type === highlightedType) {
          btn.entity.mesh.color.set(btn.highlightColor);
        } else {
          btn.entity.mesh.color.set(btn.defaultColor);
        }
      }
      return undefined;
    } else {
      if (this.isActive) {
        this.setVisible(false);
        return this.currentSelection;
      }
      return undefined;
    }
  }
}
