import { Entity } from "../../Yuu API/Entity";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Color } from "../../Yuu API/Basic Types/Color";
import { LayoutContext, MenuComponent } from "./MenuComponent";
import { createMenuButton } from "./MenuButton";

export type MenuTab = 'Tools' | 'Create' | 'Transform' | 'Material' | 'Import' | 'Scene';

export class MenuTabs implements MenuComponent {
  constructor(
    private activeTab: MenuTab,
    private onTabChange: (tab: MenuTab) => void
  ) {}

  render(parent: Entity, context: LayoutContext): Entity[] {
    const elements: Entity[] = [];
    const tabWidth = 0.038;
    const tabHeight = 0.03;
    const tabs: { label: string; tab: MenuTab }[] = [
      { label: 'Tools', tab: 'Tools' },
      { label: 'Create', tab: 'Create' },
      { label: 'Transf', tab: 'Transform' },
      { label: 'Mat', tab: 'Material' },
      { label: 'Import', tab: 'Import' },
      { label: 'Scene', tab: 'Scene' }
    ];

    let xPosTab = -0.09;
    for (const t of tabs) {
      const isActive = this.activeTab === t.tab;
      const color = isActive ? new Color(0.4, 0.4, 0.4) : new Color(0.2, 0.2, 0.2);
      const pos = new Vector3(context.offset.x + xPosTab, context.yPos + context.offset.y, context.offset.z);

      const btn = createMenuButton(
        parent,
        t.label,
        pos,
        new Vector3(tabWidth, tabHeight, 0.01),
        color,
        () => this.onTabChange(t.tab)
      );
      elements.push(btn);
      xPosTab += tabWidth + 0.005;
    }

    context.yPos -= context.ySpacing;
    return elements;
  }
}
