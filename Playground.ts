import { Async } from "./Yuu API/Async";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector2 } from "./Yuu API/Basic Types/Vector2";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Entity } from "./Yuu API/Entity";
import { Paint } from "./Yuu API/Paint";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Texture, loadPNGToTexture } from "./Yuu API/images/index";
import { Events } from "./Yuu API/Events";
import { Player } from "./Yuu API/Player";
import { createUIElement } from "./Yuu API/CreateUIElement";
import { Raycast } from "./Yuu API/Raycast";
import type { DirectoryBasePaths } from "./Yuu API/files/index";

export const playgroundDemos = {
  colorPicker,
  canvas,
  spawnPaintableSphere,
  spawnCube
}


let colorPickerPlane: Entity | undefined;

async function colorPicker(pos: Vector3, rot: Quaternion, scale: Vector3) {
  colorPickerPlane = spawnPrimitive.plane('Front', pos, scale, rot, Color.white, 0.05, 'Concave', 'Static', undefined);

  const width = 128;
  const height = Math.floor(width * (scale.y / scale.x));

  const texture = new Texture(width, height);
  texture.fillWithColor(Color.white, 0);
  const queue: [Vector2, Color][] = [];

  // This causes 1 frame of head lock, could be moved into a while loop with a brief await
  // Alternatively just save the file into the default app
  const hueHeight = height * 0.975;

  let y = 0;
  while (y < height) {
    const hue = y / hueHeight;

    for (let x = 1; x < width - 1; x++) {
      let xPercent = x / width;

      if (xPercent < 0.65) {
        xPercent *= 0.76923;
      }
      else {
        xPercent -= 0.15;
      }

      const value = Math.min(1, y > hueHeight ? xPercent : (xPercent * 2));
      let saturation = 0;
      if (y <= hueHeight) {
        saturation = 1 - (Math.max(0, xPercent - 0.5) * 2);
      }

      queue.push([new Vector2(x, y), Color.fromHSV(hue, saturation, value)]);
    }

    if (y % 50 === 0) {
      await Async.wait(15);
    }
    y++;
  }

  let count = 0;

  while (queue.length > 0) {
    count++;
    const current = queue.pop();

    if (current) {
      texture.setPixelsColor([current[0]], current[1], 1);
    }

    if (count > 3_000) {
      count = 0;
      await Async.wait(15);
    }
  }

  colorPickerPlane.rayClick.initialize(true);
  colorPickerPlane.rayClick.setHeldFunction((rayHit) => {
    if (rayHit.uv) {
      const colorPicked = colorPickerPlane?.mesh.texture.get()?.getUVColor(rayHit.uv);

      if (colorPicked) {
        Paint.properties.color.set(colorPicked.color);
      }
    }
  });

  colorPickerPlane.mesh.texture.set(texture, true);
  colorPickerPlane.mesh.texture.setDrawMode('NearestNeighbor');

  texture.updateTexture();
  texture.updateMipMaps();
}

let canvasPlane: Entity | undefined;

function canvas(pos: Vector3, rot: Quaternion, scale: Vector3) {
  const easel = new Entity(pos, rot, scale, undefined, 'Static');

  const woodColor = new Color(0.85, 0.75, 0.65);

  spawnPrimitive.cube(new Vector3(0, -0.1, -0.65), new Vector3(0.05, 2.25, 0.05), Quaternion.fromEuler(new Vector3((Math.PI / 6), 0, 0)), woodColor, 1, true, 'Static', easel);
  spawnPrimitive.cube(new Vector3(-0.5, 0, 0.5), new Vector3(0.05, 2.55, 0.02), Quaternion.fromEuler(new Vector3((-Math.PI / 6), 0, -(Math.PI / 6))), woodColor, 1, true, 'Static', easel);
  spawnPrimitive.cube(new Vector3(0.5, 0, 0.5), new Vector3(0.05, 2.55, 0.04), Quaternion.fromEuler(new Vector3((-Math.PI / 6), 0, (Math.PI / 6))), woodColor, 1, true, 'Static', easel);
  spawnPrimitive.cube(new Vector3(0, 0, 0.55), new Vector3(0.05, 1.5, 0.02), Quaternion.fromEuler(new Vector3(0, (-Math.PI / 4), (Math.PI / 2))), woodColor, 1, false, 'Static', easel);

  const canvasPos = new Vector3(0, 0.525, 0.185);
  const canvasScale = new Vector3(1.25, 1.25, 0.01);
  canvasPlane = spawnPrimitive.plane('Front', canvasPos, canvasScale, Quaternion.fromEuler(new Vector3(0, (-Math.PI / 5.35), (-Math.PI / 2))), Color.white, 1, 'Concave', 'Static', easel);
  spawnPrimitive.cube(canvasPos, canvasScale, Quaternion.fromEuler(new Vector3(0, (-Math.PI / 5.35), (-Math.PI / 2))), Color.white, 0, false, 'Static', easel);
  spawnPrimitive.plane('Back', new Vector3(0, 0.525, 0.185), new Vector3(1.25, 1.25, 0.01), Quaternion.fromEuler(new Vector3(0, (-Math.PI / 5.35), (-Math.PI / 2))), Color.white, 1, 'None', 'Static', easel);

  canvasPlane.mesh.texture.set(new Texture(2048, 2048), false);
  canvasPlane.mesh.texture.isPaintable.set(true);


  const brushTexture = Paint.getBrushTexture();

  const brushPreview = spawnPrimitive.plane('Front', pos.add(new Vector3(0, 1.35, -0.25)), new Vector3(0.5, 0.5, 0.5), Quaternion.one, Color.white, 0.5, 'None', 'Static', undefined);

  brushPreview.mesh.texture.set(brushTexture, false);
}

let paintableSphere: Entity | undefined;

function spawnPaintableSphere(pos: Vector3) {
  paintableSphere = spawnPrimitive.sphere(16, 16, pos, 1, Quaternion.fromEuler(new Vector3(0, Math.PI, 0)), Color.white, 1, 'Concave', 'Static', undefined);

  paintableSphere.mesh.texture.set(new Texture(2048, 2048), false);
  paintableSphere.mesh.texture.setMipMaps(false);

  paintableSphere.mesh.texture.isPaintable.set(true);
}

function dumpObject(obj: any, name: string): void {
  try {
    if (obj === null || obj === undefined) {
      console.log(`DEBUG: ${name} is ${typeof obj}`);
      return;
    }
    const keys = Object.keys(obj);
    console.log(`DEBUG: ${name} keys: ${keys.join(', ')}`);
    for (const key of keys) {
      try {
        const val = obj[key];
        console.log(`DEBUG: ${name}.${key} is of type ${typeof val}`);
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          const subKeys = Object.keys(val);
          console.log(`DEBUG: ${name}.${key} keys: ${subKeys.join(', ')}`);
          for (const sk of subKeys) {
             console.log(`DEBUG: ${name}.${key}.${sk} is of type ${typeof val[sk]}`);
          }
        }
      } catch (e: any) {
        console.log(`DEBUG: error reading ${name}.${key}: ${e.message}`);
      }
    }
  } catch (e: any) {
    console.log(`DEBUG: dumpObject failed for ${name}: ${e.message}`);
  }
}

let activeCube: Entity | undefined;
let selectedPNGName: string = 'bedrock_png';

type LoadablePNG = {
  base: DirectoryBasePaths;
  sub: string;
  name: string; // e.g. 'bedrock_png'
  displayName: string; // e.g. 'bedrock.png'
};

function findLoadablePNGs(): LoadablePNG[] {
  const list: LoadablePNG[] = [];
  const searchBases: DirectoryBasePaths[] = ['vm', 'user://templates', 'user://worlds'];
  
  for (const base of searchBases) {
    try {
      const basePath = base === 'vm' ? Godot.files.folder.getVMPath() : base;
      const files = Godot.files.folder.getContents(basePath, true) || [];
      for (const f of files) {
        const dirPath = f[0];
        const name = f[1];
        const ext = f[2];
        if (ext.toLowerCase() === 'txt' && name.toLowerCase().endsWith('_png')) {
          let sub = '';
          if (base === 'vm') {
            sub = dirPath.substring(basePath.length);
          } else {
            sub = dirPath.substring(base.length);
          }
          
          let cleanName = name.substring(0, name.length - 4); // Remove '_png'
          list.push({
            base,
            sub,
            name,
            displayName: `${cleanName}.png`
          });
        }
      }
    } catch (e: any) {
      console.log(`Failed listing files in ${base}: ${e.message}`);
    }
  }
  return list;
}

let uiBorder: Entity | undefined;
let uiPanelRoot: Entity | undefined;
let uiButtons: { button: Entity; pngName: string }[] = [];
let loadablePNGs: LoadablePNG[] = [];
let textureMappingMode: 'wrap' | 'face' = 'wrap';
let textureRotation: 0 | 90 | 180 | 270 = 0;
let wrapModeButton: Entity | undefined;
let faceModeButton: Entity | undefined;
let rotCWButton: Entity | undefined;
let rotCCWButton: Entity | undefined;

function updateHandUI(deltaTime: number) {
  const handPos = Player.leftHand.position.get();
  const handRot = Player.leftHand.rotation.get();
  const handForward = Player.leftHand.forward.get();
  const handUp = Player.leftHand.up.get();
  
  if (handPos && handRot && handForward && handUp) {
    // Lazy load the PNG list if empty
    if (loadablePNGs.length === 0) {
      loadablePNGs = findLoadablePNGs();
    }
    
    // Create UI Panel if not initialized
    if (!uiPanelRoot) {
      const width = 0.28;
      const height = 0.51;
      
      // Spawns outline border backing plane ( Indigo background )
      uiBorder = spawnPrimitive.plane(
        'Front',
        handPos,
        new Vector3(width + 0.01, height + 0.01, 0.005),
        handRot,
        new Color(0.4, 0.2, 0.9), // electric indigo
        1,
        'None',
        'Static',
        undefined
      );
      
      // Spawns main dark panel (Rich Obsidian)
      uiPanelRoot = spawnPrimitive.plane(
        'Front',
        new Vector3(0, 0, 0.001),
        new Vector3(width, height, 0.005),
        Quaternion.one,
        new Color(0.08, 0.08, 0.1),
        0.95,
        'None',
        'Static',
        uiBorder
      );
      
      // Text Title
      const titleText = new Entity(
        new Vector3(0, height / 2 - 0.04, 0.002),
        Quaternion.one,
        Vector3.one,
        uiPanelRoot,
        'Static'
      );
      titleText.text.create('TEXTURES', 1, 1);
      titleText.text.doubleSided.set(false);
      titleText.text.color.set(new Color(1, 1, 1));
      titleText.text.outline.color.set(new Color(0.4, 0.2, 0.9));
      
      // Button Generation
      const maxButtons = 5;
      const displayPNGs = loadablePNGs.slice(0, maxButtons);
      const btnWidth = width - 0.04;
      const btnHeight = 0.045;
      const btnSpacing = 0.055;
      const startY = height / 2 - 0.10;
      
      uiButtons = [];
      
      for (let i = 0; i < displayPNGs.length; i++) {
        const png = displayPNGs[i];
        const btnY = startY - i * btnSpacing;
        
        const btn = createUIElement.button(
          new Vector3(0, btnY, 0.002),
          new Vector3(btnWidth, btnHeight, 0.005),
          Quaternion.one,
          png.displayName,
          new Color(0.7, 0.7, 0.7),
          3,
          new Color(0.14, 0.14, 0.16),
          uiPanelRoot
        );
        
        btn.rayClick.initialize(false);
        btn.rayClick.setClickFunction(() => {
          console.log(`Texture selected: ${png.displayName}`);
          const texture = loadPNGToTexture(png.base, png.sub, png.name);
          if (texture && activeCube) {
            activeCube.mesh.texture.set(texture, false);
            selectedPNGName = png.name;
          }
        });
        
        uiButtons.push({
          button: btn,
          pngName: png.name
        });
      }

      // Wrap Mode Button
      wrapModeButton = createUIElement.button(
        new Vector3(-0.06, -0.155, 0.002),
        new Vector3(0.11, 0.04, 0.005),
        Quaternion.one,
        'Wrap',
        new Color(0.7, 0.7, 0.7),
        2,
        new Color(0.14, 0.14, 0.16),
        uiPanelRoot
      );
      
      wrapModeButton.rayClick.initialize(false);
      wrapModeButton.rayClick.setClickFunction(() => {
        if (textureMappingMode !== 'wrap') {
          textureMappingMode = 'wrap';
          console.log(`Texture mapping mode set to wrap`);
          updateCubeMesh();
        }
      });

      // Face Mode Button
      faceModeButton = createUIElement.button(
        new Vector3(0.06, -0.155, 0.002),
        new Vector3(0.11, 0.04, 0.005),
        Quaternion.one,
        'Face',
        new Color(0.7, 0.7, 0.7),
        2,
        new Color(0.14, 0.14, 0.16),
        uiPanelRoot
      );
      
      faceModeButton.rayClick.initialize(false);
      faceModeButton.rayClick.setClickFunction(() => {
        if (textureMappingMode !== 'face') {
          textureMappingMode = 'face';
          console.log(`Texture mapping mode set to face`);
          updateCubeMesh();
        }
      });

      // Rotate CW Button
      rotCWButton = createUIElement.button(
        new Vector3(-0.06, -0.21, 0.002),
        new Vector3(0.11, 0.04, 0.005),
        Quaternion.one,
        'Rot CW',
        new Color(0.7, 0.7, 0.7),
        2,
        new Color(0.14, 0.14, 0.16),
        uiPanelRoot
      );
      
      rotCWButton.rayClick.initialize(false);
      rotCWButton.rayClick.setClickFunction(() => {
        textureRotation = ((textureRotation + 90) % 360) as any;
        console.log(`Texture rotation set to ${textureRotation}`);
        updateCubeMesh();
      });

      // Rotate CCW Button
      rotCCWButton = createUIElement.button(
        new Vector3(0.06, -0.21, 0.002),
        new Vector3(0.11, 0.04, 0.005),
        Quaternion.one,
        'Rot CCW',
        new Color(0.7, 0.7, 0.7),
        2,
        new Color(0.14, 0.14, 0.16),
        uiPanelRoot
      );
      
      rotCCWButton.rayClick.initialize(false);
      rotCCWButton.rayClick.setClickFunction(() => {
        textureRotation = ((textureRotation + 270) % 360) as any;
        console.log(`Texture rotation set to ${textureRotation}`);
        updateCubeMesh();
      });
    }
    
    // Position/orient UI to follow left hand
    const offset = handUp.multiply(0.15).add(handForward.multiply(0.08));
    if (uiBorder) {
      uiBorder.pos = handPos.add(offset);
      uiBorder.rot = handRot;
      uiBorder.visible.set(true);
    }
    
    // Check hover states from right hand pointer
    const rightHandPos = Player.rightHand.position.get();
    const rightHandForward = Player.rightHand.forward.get();
    let hoveredNodeID: number | undefined;
    
    if (rightHandPos && rightHandForward) {
      const hit = Raycast.directional(rightHandPos, rightHandForward, 5, { getEntity: true });
      if (hit && hit.entity) {
        hoveredNodeID = hit.entity.nodeID;
      }
    }
    
    // Color styling update
    for (const item of uiButtons) {
      const isSelected = item.pngName === selectedPNGName;
      const isHovered = item.button.nodeID === hoveredNodeID;
      const bg = item.button;
      const textEnt = bg.childEntities[0];
      
      if (isSelected) {
        bg.mesh.color.set(new Color(0.4, 0.2, 0.9), 1.0);
        if (textEnt) textEnt.text.color.set(new Color(1, 1, 1));
      } else if (isHovered) {
        bg.mesh.color.set(new Color(0.24, 0.24, 0.28), 1.0);
        if (textEnt) textEnt.text.color.set(new Color(0.95, 0.95, 0.95));
      } else {
        bg.mesh.color.set(new Color(0.14, 0.14, 0.16), 1.0);
        if (textEnt) textEnt.text.color.set(new Color(0.7, 0.7, 0.7));
      }
    }
    
    if (wrapModeButton && faceModeButton) {
      const modeItems = [
        { button: wrapModeButton, isSelected: textureMappingMode === 'wrap' },
        { button: faceModeButton, isSelected: textureMappingMode === 'face' }
      ];
      for (const item of modeItems) {
        const isHovered = item.button.nodeID === hoveredNodeID;
        const bg = item.button;
        const textEnt = bg.childEntities[0];
        
        if (item.isSelected) {
          bg.mesh.color.set(new Color(0.4, 0.2, 0.9), 1.0);
          if (textEnt) textEnt.text.color.set(new Color(1, 1, 1));
        } else if (isHovered) {
          bg.mesh.color.set(new Color(0.24, 0.24, 0.28), 1.0);
          if (textEnt) textEnt.text.color.set(new Color(0.95, 0.95, 0.95));
        } else {
          bg.mesh.color.set(new Color(0.14, 0.14, 0.16), 1.0);
          if (textEnt) textEnt.text.color.set(new Color(0.7, 0.7, 0.7));
        }
      }
    }

    if (rotCWButton && rotCCWButton) {
      const actionButtons = [rotCWButton, rotCCWButton];
      for (const btn of actionButtons) {
        const isHovered = btn.nodeID === hoveredNodeID;
        const bg = btn;
        const textEnt = bg.childEntities[0];
        
        if (isHovered) {
          bg.mesh.color.set(new Color(0.24, 0.24, 0.28), 1.0);
          if (textEnt) textEnt.text.color.set(new Color(0.95, 0.95, 0.95));
        } else {
          bg.mesh.color.set(new Color(0.14, 0.14, 0.16), 1.0);
          if (textEnt) textEnt.text.color.set(new Color(0.7, 0.7, 0.7));
        }
      }
    }
  } else {
    // Hide panel if hand tracking is lost
    if (uiBorder) {
      uiBorder.visible.set(false);
    }
  }
}

function getRotatedUVs(baseUVs: Vector2[], rotationAngle: 0 | 90 | 180 | 270): Vector2[] {
  if (rotationAngle === 0) {
    return baseUVs;
  }
  
  const rotated = baseUVs.map(uv => new Vector2(uv.x, uv.y));
  const numFaces = Math.floor(baseUVs.length / 4);
  const steps = rotationAngle / 90;
  
  for (let step = 0; step < steps; step++) {
    for (let face = 0; face < numFaces; face++) {
      const idxs = [4 * face, 4 * face + 1, 4 * face + 2, 4 * face + 3];
      
      // Calculate center of this face's UVs
      let sumX = 0;
      let sumY = 0;
      for (const i of idxs) {
        sumX += rotated[i].x;
        sumY += rotated[i].y;
      }
      const centerX = sumX / 4;
      const centerY = sumY / 4;
      
      // Rotate 90 deg CW
      const orig = idxs.map(i => new Vector2(rotated[i].x, rotated[i].y));
      for (let k = 0; k < 4; k++) {
        const i = idxs[k];
        const u = orig[k].x;
        const v = orig[k].y;
        rotated[i].x = centerX - (v - centerY);
        rotated[i].y = centerY + (u - centerX);
      }
    }
  }
  
  return rotated;
}

function updateCubeMesh() {
  if (!activeCube) return;
  
  const currentTexture = activeCube.mesh.texture.get();
  
  const baseMesh = textureMappingMode === 'face' 
    ? spawnPrimitive.getShadeSmoothFaceUVCube()
    : spawnPrimitive.getShadeSmoothStretchedUVCube();
    
  const rotatedUVs = getRotatedUVs(baseMesh[1], textureRotation);
  
  activeCube.mesh.create(baseMesh[0], rotatedUVs, baseMesh[2]);
  
  if (currentTexture) {
    activeCube.mesh.texture.set(currentTexture, false);
  }
}

function spawnCube(pos: Vector3) {
  const cube = spawnPrimitive.cube(pos, new Vector3(1,1,1), Quaternion.one, Color.white, 1, true, 'Static', undefined);
  activeCube = cube;
  
  if (textureMappingMode === 'face' || textureRotation !== 0) {
    updateCubeMesh();
  }
  
  let foundBase: 'user://templates' | 'user://worlds' | 'vm' | null = null;
  let foundSub: string = '';

  try {
    const vmPath = Godot.files.folder.getVMPath();
    const vmFiles = Godot.files.folder.getContents(vmPath, true) || [];
    for (const f of vmFiles) {
      if (f[1].toLowerCase() === 'bedrock_png' && f[2].toLowerCase() === 'txt') {
        foundBase = 'vm';
        foundSub = f[0].substring(vmPath.length);
        console.log(`Found bedrock_png.txt in VM path: ${f[0]}/${f[1]}`);
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
          console.log(`Found bedrock_png.txt in templates: ${f[0]}/${f[1]}`);
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
          console.log(`Found bedrock_png.txt in worlds: ${f[0]}/${f[1]}`);
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
  } else {
    console.log("Failed to dynamically load bedrock.png texture");
  }

  // Register hand UI loop
  Events.onPhysicsUpdate(updateHandUI);
}






