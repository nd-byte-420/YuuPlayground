import { Entity } from "../../Yuu API/Entity";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Color } from "../../Yuu API/Basic Types/Color";
import { LayoutContext, MenuComponent } from "./MenuComponent";
import { createMenuButton } from "./MenuButton";
import { ModelingTool } from "../Core/ModelingTool";

export class CreatePanel implements MenuComponent {
  render(parent: Entity, context: LayoutContext): Entity[] {
    const elements: Entity[] = [];
    const buttonSize = new Vector3(0.15, 0.05, 0.01);
    
    const primitives: { label: string; mode: 'SpawnCube' | 'SpawnSphere' | 'SpawnPlane' | 'SpawnCone' }[] = [
      { label: 'Add Cube', mode: 'SpawnCube' },
      { label: 'Add Sphere', mode: 'SpawnSphere' },
      { label: 'Add Plane', mode: 'SpawnPlane' },
      { label: 'Add Cone', mode: 'SpawnCone' }
    ];

    for (const p of primitives) {
      const pos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
      const btn = createMenuButton(parent, p.label, pos, buttonSize, new Color(0.2, 0.2, 0.2), () => {
        ModelingTool.setMode(p.mode);
        ModelingTool.spawnFromMode();
      });
      elements.push(btn);
      context.yPos -= context.ySpacing;
    }

    return elements;
  }
}
