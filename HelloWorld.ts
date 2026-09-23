import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { inWorldConsole } from "./Yuu API/Console";
import { registerStart } from "./Yuu API/RegisterStart";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { loadPNGToTexture } from "./Yuu API/images/index";
import { ModelingMenu } from "./Modeling/Menu/ModelingMenu";
import { Gizmo } from "./Modeling/Gizmo/Gizmo";
import { SelectionTools } from "./Modeling/SelectionTools";
import { ModelingTool } from "./Modeling/Core/ModelingTool";
import { SceneManager } from "./Modeling/Core/SceneManager";
import { getTextureSettings } from "./Modeling/Core/TextureEditor";

registerStart(start);
async function start() {
  // Initialize modeling system components
  ModelingMenu.init();
  Gizmo.init();
  SelectionTools.init();

  inWorldConsole.visible(true, new Vector3(0, 1.5, -1.5));
  console.log('Modeling System and Texture Editor active!');

  // Spawn the initial cube at Vector3(0, 1.5, -4.5)
  const cube = spawnPrimitive.cube(
    new Vector3(0, 1.5, -4.5), 
    new Vector3(1, 1, 1), 
    Quaternion.one, 
    Color.white, 
    1, 
    true, 
    'Static', 
    undefined
  );

  // Setup click & drag handlers for modeling interaction
  cube.rayClick.initialize(false);
  cube.rayClick.setClickFunction((hit) => ModelingTool.handleEntityClick(cube, hit));
  cube.rayClick.setHeldFunction((hit) => ModelingTool.handleEntityHeld(cube, hit));

  // Find and load bedrock texture
  let foundBase: 'user://templates' | 'user://worlds' | 'vm' | null = null;
  let foundSub: string = '';

  try {
    const vmPath = Godot.files.folder.getVMPath();
    const vmFiles = Godot.files.folder.getContents(vmPath, true) || [];
    for (const f of vmFiles) {
      if (f[1].toLowerCase() === 'bedrock_png' && f[2].toLowerCase() === 'txt') {
        foundBase = 'vm';
        foundSub = f[0].substring(vmPath.length);
        break;
      }
    }
  } catch (e: any) {
    console.log("Failed listing VM files: " + e.message);
  }

  if (!foundBase) {
    try {
      const templates = Godot.files.folder.getContents('user://templates', true) || [];
      for (const f of templates) {
        if (f[1].toLowerCase() === 'bedrock_png' && f[2].toLowerCase() === 'txt') {
          foundBase = 'user://templates';
          foundSub = f[0].substring('user://templates'.length);
          break;
        }
      }
    } catch (e: any) {
      console.log("Failed listing templates: " + e.message);
    }
  }

  if (!foundBase) {
    try {
      const worlds = Godot.files.folder.getContents('user://worlds', true) || [];
      for (const f of worlds) {
        if (f[1].toLowerCase() === 'bedrock_png' && f[2].toLowerCase() === 'txt') {
          foundBase = 'user://worlds';
          foundSub = f[0].substring('user://worlds'.length);
          break;
        }
      }
    } catch (e: any) {
      console.log("Failed listing worlds: " + e.message);
    }
  }

  const texture = loadPNGToTexture((foundBase || 'vm') as any, foundSub, 'bedrock_png');
  if (texture) {
    cube.mesh.texture.set(texture, false);
    const settings = getTextureSettings(cube);
    settings.selectedPNGName = 'bedrock_png';
  } else {
    console.log("Failed to dynamically load bedrock.png texture");
  }

  // Register in SceneManager so it shows up in Modeling UI
  SceneManager.addObject(cube, 'Cube');
}