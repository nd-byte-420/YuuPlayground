import { Color } from "../../Yuu API/Basic Types/Color";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Entity } from "../../Yuu API/Entity";
import { createUIElement } from "../../Yuu API/CreateUIElement";

export function createMenuButton(
  parent: Entity,
  label: string,
  posOffset: Vector3,
  size: Vector3,
  bgColor: Color,
  action: () => void
): Entity {
  const btn = createUIElement.button(
    posOffset,
    size,
    Quaternion.one,
    label,
    Color.white,
    2,
    bgColor,
    parent
  );
  btn.rayClick.setClickFunction(action);
  return btn;
}
