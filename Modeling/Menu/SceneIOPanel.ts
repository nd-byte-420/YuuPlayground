import { Entity } from "../../Yuu API/Entity";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Color } from "../../Yuu API/Basic Types/Color";
import { LayoutContext, MenuComponent } from "./MenuComponent";
import { createMenuButton } from "./MenuButton";
import { createMenuLabel } from "./MenuLabel";
import { saveScene, loadScene, listSavedScenes } from "../Core/SceneSerialization";
import { SceneManager } from "../Core/SceneManager";
import { Keyboard } from "../../Yuu API/Keyboard";

const DEFAULT_SCENE_NAME = 'scene';

export class SceneIOPanel implements MenuComponent {
  private static selectedFile: string | undefined = undefined;
  public static sceneName: string = 'scene';

  constructor(private rebuild?: () => void) {}

  render(parent: Entity, context: LayoutContext): Entity[] {
    const elements: Entity[] = [];
    const buttonSize = new Vector3(0.15, 0.04, 0.01);

    // ── Save section ──────────────────────────────
    const saveLabelPos = new Vector3(
      context.offset.x - 0.07,
      context.yPos + context.offset.y,
      context.offset.z
    );
    elements.push(createMenuLabel(parent, 'Save Scene', saveLabelPos, 1.2, Color.white));
    context.yPos -= 0.045;

    // Filename input row
    const fileLabelPos = new Vector3(
      context.offset.x - 0.065,
      context.yPos + context.offset.y,
      context.offset.z
    );
    elements.push(createMenuLabel(parent, 'Name:', fileLabelPos, 1.0, Color.white));

    const nameBtnPos = new Vector3(
      context.offset.x + 0.02,
      context.yPos + context.offset.y,
      context.offset.z
    );
    const nameBtn = createMenuButton(
      parent,
      SceneIOPanel.sceneName,
      nameBtnPos,
      new Vector3(0.09, 0.035, 0.01),
      new Color(0.2, 0.2, 0.2),
      () => {
        if (context.setKeyboardTarget) context.setKeyboardTarget('SceneName');
        Keyboard.show(SceneIOPanel.sceneName);
      }
    );
    elements.push(nameBtn);
    context.yPos -= 0.045;

    const savePos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
    const saveBtn = createMenuButton(
      parent,
      `Save ${SceneIOPanel.sceneName}.json`,
      savePos,
      buttonSize,
      new Color(0.15, 0.4, 0.15),
      () => {
        saveScene(SceneIOPanel.sceneName);
        SceneManager._notify();
      }
    );
    elements.push(saveBtn);
    context.yPos -= context.ySpacing;

    // ── Load section ──────────────────────────────
    context.yPos -= 0.02;
    const loadLabelPos = new Vector3(
      context.offset.x - 0.07,
      context.yPos + context.offset.y,
      context.offset.z
    );
    elements.push(createMenuLabel(parent, 'Load Scene', loadLabelPos, 1.2, Color.white));
    context.yPos -= 0.05;

    const savedScenes = listSavedScenes();

    if (savedScenes.length === 0) {
      const nonePos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
      elements.push(createMenuLabel(parent, 'No scenes saved yet', nonePos, 1.0, new Color(0.5, 0.5, 0.5)));
      context.yPos -= context.ySpacing;
    } else {
      for (const fileName of savedScenes) {
        const isSelected = SceneIOPanel.selectedFile === fileName;
        const bgColor = isSelected ? new Color(0.35, 0.35, 0.35) : new Color(0.2, 0.2, 0.2);
        const filePos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
        const fileBtn = createMenuButton(parent, `${fileName}.json`, filePos, buttonSize, bgColor, () => {
          SceneIOPanel.selectedFile = fileName;
          SceneManager._notify();
        });
        elements.push(fileBtn);
        context.yPos -= 0.045;
      }

      context.yPos -= 0.01;
      const loadBtnColor = SceneIOPanel.selectedFile
        ? new Color(0.15, 0.35, 0.5)
        : new Color(0.1, 0.2, 0.3);
      const loadPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
      const loadBtn = createMenuButton(
        parent,
        SceneIOPanel.selectedFile ? 'Load Selected' : 'Select a scene',
        loadPos,
        buttonSize,
        loadBtnColor,
        () => {
          if (SceneIOPanel.selectedFile) {
            loadScene(SceneIOPanel.selectedFile);
            SceneIOPanel.selectedFile = undefined;
            SceneManager._notify();
          }
        }
      );
      elements.push(loadBtn);
      context.yPos -= context.ySpacing;
    }

    return elements;
  }
}
