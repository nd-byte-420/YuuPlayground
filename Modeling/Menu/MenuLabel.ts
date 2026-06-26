import { Color } from "../../Yuu API/Basic Types/Color";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Entity } from "../../Yuu API/Entity";

export function createMenuLabel(
  parent: Entity,
  text: string,
  pos: Vector3,
  fontSize: number,
  color: Color
): Entity {
  const labelEntity = new Entity(
    pos,
    Quaternion.one,
    Vector3.one,
    parent,
    'Static'
  );
  labelEntity.text.create(text, fontSize, 0);
  labelEntity.text.doubleSided.set(false);
  labelEntity.text.color.set(color);
  return labelEntity;
}
