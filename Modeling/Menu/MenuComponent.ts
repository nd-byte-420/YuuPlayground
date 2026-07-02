import { Entity } from "../../Yuu API/Entity";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";

export interface LayoutContext {
  offset: Vector3;
  yPos: number;
  ySpacing: number;
  keyboardTarget?: string;
  setKeyboardTarget?: (target: string | undefined) => void;
}

export interface MenuComponent {
  render(parent: Entity, context: LayoutContext): Entity[];
  update?(deltaTime: number): void;
}
