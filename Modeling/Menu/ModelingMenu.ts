import { Color } from "../../Yuu API/Basic Types/Color";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Entity } from "../../Yuu API/Entity";
import { Events } from "../../Yuu API/Events";
import { Player } from "../../Yuu API/Player";
import { Keyboard } from "../../Yuu API/Keyboard";
import { ModelingTool } from "../Core/ModelingTool";
import { EditMode } from "../EditMode/EditMode";
import { SceneManager } from "../Core/SceneManager";
import { quatToEulerDegrees } from "../Core/MathUtils";
import { LayoutContext, MenuComponent } from "./MenuComponent";
import { MenuTab, MenuTabs } from "./MenuTabs";
import { ToolsPanel } from "./ToolsPanel";
import { CreatePanel } from "./CreatePanel";
import { TransformPanel } from "./TransformPanel";
import { MaterialPanel } from "./MaterialPanel";
import { ImportPanel } from "./ImportPanel";
import { ScenePanel } from "./ScenePanel";
import { SceneIOPanel } from "./SceneIOPanel";

export const ModelingMenu = {
  menuContainer: undefined as Entity | undefined,
  activeTab: 'Create' as MenuTab,
  menuElements: [] as Entity[],
  activeComponents: [] as MenuComponent[],
  keyboardTarget: undefined as string | undefined,

  init() {
    this.menuContainer = new Entity(Vector3.zero, Quaternion.one, Vector3.one, undefined, 'Static');

    Keyboard.onKeyboardInput((input: string) => {
      this.handleKeyboardInput(input);
    });

    ModelingTool.onModeOrSelectionChanged.push(() => this.renderMenu());
    // Re-render when scene graph changes (nodes added/removed/selected)
    SceneManager.onChange.push(() => this.renderMenu());

    this.renderMenu();
    Events.onPhysicsUpdate(this.update.bind(this));
  },

  handleKeyboardInput(input: string) {
    if (!this.keyboardTarget) return;

    if (this.keyboardTarget === 'GridResolution') {
      const value = parseFloat(input);
      if (!isNaN(value) && value > 0) {
        ModelingTool.gridResolution = value;
      }
      this.renderMenu();
      return;
    }

    if (this.keyboardTarget === 'SceneName') {
      const cleanInput = input.trim().replace(/[^a-zA-Z0-9_\-]/g, '');
      if (cleanInput.length > 0) {
        SceneIOPanel.sceneName = cleanInput;
      }
      this.renderMenu();
      return;
    }

    if (!ModelingTool.selectedEntity) return;

    const value = parseFloat(input);
    if (isNaN(value)) return;

    if (EditMode.active) {
      EditMode.handleKeyboardInput(this.keyboardTarget, value);
      return;
    }

    const ent = ModelingTool.selectedEntity;

    if (this.keyboardTarget === 'PosX') ent.pos = new Vector3(value, ent.pos.y, ent.pos.z);
    else if (this.keyboardTarget === 'PosY') ent.pos = new Vector3(ent.pos.x, value, ent.pos.z);
    else if (this.keyboardTarget === 'PosZ') ent.pos = new Vector3(ent.pos.x, ent.pos.y, value);

    else if (this.keyboardTarget === 'ScaleX') ent.scale = new Vector3(value, ent.scale.y, ent.scale.z);
    else if (this.keyboardTarget === 'ScaleY') ent.scale = new Vector3(ent.scale.x, value, ent.scale.z);
    else if (this.keyboardTarget === 'ScaleZ') ent.scale = new Vector3(ent.scale.x, ent.scale.y, value);

    else if (this.keyboardTarget.startsWith('Rot')) {
      const currentEuler = quatToEulerDegrees(ent.rot);
      if (this.keyboardTarget === 'RotX') currentEuler.x = value;
      else if (this.keyboardTarget === 'RotY') currentEuler.y = value;
      else if (this.keyboardTarget === 'RotZ') currentEuler.z = value;

      const degToRad = Math.PI / 180;
      ent.rot = Quaternion.fromEuler(new Vector3(
        currentEuler.x * degToRad,
        currentEuler.y * degToRad,
        currentEuler.z * degToRad
      ));
    }
  },

  renderMenu() {
    for (const el of this.menuElements) {
      el.destroy();
    }
    this.menuElements = [];
    this.activeComponents = [];

    const context: LayoutContext = {
      offset: new Vector3(0.1, 0.1, 0),
      yPos: 0.35,
      ySpacing: 0.06,
      keyboardTarget: this.keyboardTarget,
      setKeyboardTarget: (target: string | undefined) => {
        this.keyboardTarget = target;
      }
    };

    const tabs = new MenuTabs(this.activeTab, (tab) => {
      this.activeTab = tab;
      this.renderMenu();
    });
    const tabEls = tabs.render(this.menuContainer!, context);
    this.menuElements.push(...tabEls);
    this.activeComponents.push(tabs);

    let panel: MenuComponent;
    switch (this.activeTab) {
      case 'Tools':
        panel = new ToolsPanel(() => this.renderMenu());
        break;
      case 'Create':
        panel = new CreatePanel();
        break;
      case 'Transform':
        panel = new TransformPanel();
        break;
      case 'Material':
        panel = new MaterialPanel();
        break;
      case 'Import':
        panel = new ImportPanel(() => this.renderMenu());
        break;
      case 'Scene':
        panel = new ScenePanel(() => this.renderMenu());
        break;
    }

    const panelEls = panel.render(this.menuContainer!, context);
    this.menuElements.push(...panelEls);
    this.activeComponents.push(panel);
  },

  update(deltaTime: number) {
    if (this.menuContainer) {
      const leftPos = Player.leftHand.position.get();
      const leftRot = Player.leftHand.rotation.get();

      if (leftPos && leftRot) {
        this.menuContainer.pos = leftPos;
        this.menuContainer.rot = leftRot;
      } else {
        const headPos = Player.head.position.get();
        const headRot = Player.head.rotation.get();
        if (headPos && headRot) {
          const forward = Player.head.forward.get() ?? new Vector3(0, 0, -1);
          const right   = Player.head.right.get()   ?? new Vector3(1, 0, 0);
          this.menuContainer.pos = headPos.add(forward.multiply(1)).add(right.multiply(-0.5));
          this.menuContainer.rot = headRot;
        }
      }

      for (const comp of this.activeComponents) {
        if (comp.update) {
          comp.update(deltaTime);
        }
      }
    }
  }
};
