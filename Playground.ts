import { Async } from "./Yuu API/Async";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector2 } from "./Yuu API/Basic Types/Vector2";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Entity } from "./Yuu API/Entity";
import { Paint } from "./Yuu API/Paint";
import { Player } from "./Yuu API/Player";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Texture } from "./Yuu API/Texture";
import { loadPNGToTexture } from "./Yuu API/PNGParser";
import { Files } from "./Yuu API/Files";





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

function spawnCube(pos: Vector3) {
  const cube = spawnPrimitive.cube(pos, new Vector3(0.05, 2.25, 0.05), Quaternion.fromEuler(new Vector3((Math.PI / 6), 0, 0)), Color.white, 1, true, 'Static', undefined);
  
  console.log("--- VM PROBE START ---");
  
  let foundPath: string | null = null;
  let foundBase: 'user://templates' | 'user://worlds' | 'vm' | null = null;
  let foundSub: string = '';

  // 1. Search 'user://templates'
  try {
    const templates = Godot.files.folder.getContents('user://templates', true);
    console.log("DEBUG: templates count = " + templates.length);
    for (const f of templates) {
      console.log(`DEBUG: template file = ${f[0]} / ${f[1]} . ${f[2]}`);
      if (f[1].toLowerCase() === 'bedrock' && f[2].toLowerCase() === 'png') {
        foundBase = 'user://templates';
        foundSub = f[0].substring('user://templates'.length);
        foundPath = f[0];
        console.log(`DEBUG: Found bedrock.png in templates: ${f[0]}/${f[1]}`);
      }
    }
  } catch (e: any) {
    console.log("DEBUG: failed listing templates: " + e.message);
  }

  // 2. Search 'user://worlds'
  try {
    const worlds = Godot.files.folder.getContents('user://worlds', true);
    console.log("DEBUG: worlds count = " + worlds.length);
    for (const f of worlds) {
      console.log(`DEBUG: world file = ${f[0]} / ${f[1]} . ${f[2]}`);
      if (f[1].toLowerCase() === 'bedrock' && f[2].toLowerCase() === 'png') {
        foundBase = 'user://worlds';
        foundSub = f[0].substring('user://worlds'.length);
        foundPath = f[0];
        console.log(`DEBUG: Found bedrock.png in worlds: ${f[0]}/${f[1]}`);
      }
    }
  } catch (e: any) {
    console.log("DEBUG: failed listing worlds: " + e.message);
  }

  // 3. Search 'vm' path
  try {
    const vmPath = Godot.files.folder.getVMPath();
    const vmFiles = Godot.files.folder.getContents(vmPath, true);
    console.log("DEBUG: vm files count = " + vmFiles.length);
    for (const f of vmFiles) {
      console.log(`DEBUG: vm file = ${f[0]} / ${f[1]} . ${f[2]}`);
      if (f[1].toLowerCase() === 'bedrock' && f[2].toLowerCase() === 'png') {
        foundBase = 'vm';
        foundSub = f[0].substring(vmPath.length);
        foundPath = f[0];
        console.log(`DEBUG: Found bedrock.png in vm path: ${f[0]}/${f[1]}`);
      }
    }
  } catch (e: any) {
    console.log("DEBUG: failed listing vm files: " + e.message);
  }

  // 4. Try reading the file if found
  if (foundBase && foundPath) {
    try {
      console.log(`DEBUG: Attempting to read bedrock.png from base=${foundBase}, sub=${foundSub}`);
      const content = Files.text.get(foundBase as any, foundSub, 'bedrock', '.png');

      if (content) {
        console.log(`DEBUG: Read successful! Length = ${content.length}`);
        const codes = [];
        for (let i = 0; i < Math.min(content.length, 10); i++) {
          codes.push(content.charCodeAt(i));
        }
        console.log(`DEBUG: First 10 charCodes: ${codes.join(', ')}`);

        // If we can read it, let's convert it to hex text right here on device!
        let hex = '';
        for (let i = 0; i < content.length; i++) {
          const byte = content.charCodeAt(i) & 0xff;
          hex += byte.toString(16).padStart(2, '0');
        }
        console.log("DEBUG: Hex conversion length = " + hex.length);
        
        // Write the converted hex to bedrock_png.txt in the same directory!
        const writeSuccess = Godot.files.text.create(foundPath, 'bedrock_png', '.txt', hex);
        console.log(`DEBUG: Converted hex text file created: ${writeSuccess}`);
      } else {
        console.log("DEBUG: Read returned empty or undefined!");
      }
    } catch (e: any) {
      console.log("DEBUG: Error reading bedrock.png: " + e.message);
    }
  } else {
    console.log("DEBUG: bedrock.png was NOT found anywhere!");
  }

  console.log("--- VM PROBE END ---");

  // Load the texture from the directory where it was found and converted
  const texture = loadPNGToTexture((foundBase || 'vm') as any, foundSub, 'bedrock_png');

  if (texture) {
    cube.mesh.texture.set(texture, false);
  } else {
    console.log("Failed to dynamically load bedrock.png texture");
  }
}






