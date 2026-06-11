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


export const playgroundDemos = {
  colorPicker,
  canvas,
  spawnPaintableSphere,
  spawnShaderSphere,
  spawnDissolveCube,
  spawnDissolveCubeBig,
  spawnDissolveCubeSmall
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

function spawnShaderSphere(pos: Vector3) {
  const shaderSphere = spawnPrimitive.sphere(32, 32, pos, 2, Quaternion.fromEuler(new Vector3(0, 180, 0)), Color.white, 1, 'None', 'Static', undefined);

  shaderSphere.trigger.initialize(1, undefined);
  shaderSphere.trigger.setOccupiedFunction((occupiedTriggerPayload) => {
    Player.position.set(occupiedTriggerPayload.pos.add(new Vector3(0, 5, 0)));
  });

  const texture2 = new Texture(8, 8);
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const isLeft = x < 4;
      const isTop = y < 4;
      let r = 0, g = 0, b = 0;
      if (isTop && isLeft)       { r = 1; g = 0; b = 0; } // top-left: red
      else if (isTop && !isLeft) { r = 0; g = 1; b = 0; } // top-right: green
      else if (!isTop && isLeft) { r = 0; g = 0; b = 1; } // bottom-left: blue
      else                       { r = 1; g = 1; b = 1; } // bottom-right: white
      Godot.image.setPixelsColor(texture2.imageID, new Int32Array([x, y]), r, g, b, 1.0);
    }
  }

  Godot.image.updateTexture(texture2.imageID);
  shaderSphere.mesh.texture.set(texture2, false);
  shaderSphere.mesh.texture.setMipMaps(false);

  Godot.shader.applyToMesh(shaderSphere.mesh.nodeID ?? -1, shaderCodeSpiral);

  const initialPlayerPos = Player.position.get();
  if (initialPlayerPos) {
    const nodeId = shaderSphere.mesh.nodeID ?? -1;
    Godot.shader.updateColor(nodeId, 'player_pos', initialPlayerPos.x, initialPlayerPos.y, initialPlayerPos.z);
    Godot.shader.updateColor(nodeId, 'sphere_pos', pos.x, pos.y, pos.z);
  }

  Async.setInterval(() => {
    const playerPos = Player.position.get();
    if (playerPos) {
      const distance = playerPos.distanceTo(pos);
      // Map distance: 1.0 (white) at sphere surface (0.5m) down to 0.0 (black) at 8.0m
      // if difference is above 10 cap it at 10, if below 2 cap it at 2
      const proximityMinMax = Math.max(2, Math.min(10, distance));

      const nodeId = shaderSphere.mesh.nodeID ?? -1;
      Godot.shader.updateNumber(nodeId, 'proximity', proximityMinMax);
      Godot.shader.updateColor(nodeId, 'player_pos', playerPos.x, playerPos.y, playerPos.z);
      Godot.shader.updateColor(nodeId, 'sphere_pos', pos.x, pos.y, pos.z);
    }
  }, 50);
}

// create a cube and attach shadercode new/
async function spawnDissolveCube(pos: Vector3) {

  const cube = spawnPrimitive.cube(pos, new Vector3(1,1,1), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(false)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shaderCodeNew);
  
  Async.setInterval(() => {
    const playerPos = Player.position.get();
    if (playerPos) {
      const distance = playerPos.distanceTo(pos);
      const normalizedDistance =
        distance <= 5 ? 0 :
          distance >= 6 ? 1 :
            distance - 5;

      const nodeId = cube.mesh.nodeID ?? -1;
      Godot.shader.updateNumber(nodeId, 'dissolve', normalizedDistance);
    }
  }, 50);
}

// create a cube and attach shadercode new/
async function spawnDissolveCubeSmall(pos: Vector3) {

  const cube = spawnPrimitive.cube(pos, new Vector3(0.25,0.25,0.25), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(false)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shaderCodeNew);
  
  Async.setInterval(() => {
    const playerPos = Player.position.get();
    if (playerPos) {
      const distance = playerPos.distanceTo(pos);
      const normalized = distance <= 2 ? 0 :
        distance >= 3 ? 1 :
          distance - 2;

      const nodeId = cube.mesh.nodeID ?? -1;
      Godot.shader.updateNumber(nodeId, 'dissolve', normalized);
    }
  }, 50);
}


// create a cube and attach shadercode new/
async function spawnDissolveCubeBig(pos: Vector3) {

  const cube = spawnPrimitive.cube(pos, new Vector3(10,1,10), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(false)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shaderCodeNew);
  
  Async.setInterval(() => {
    const playerPos = Player.position.get();
    if (playerPos) {
      const distance = playerPos.distanceTo(pos);
      const normalizedDistance =
        distance <= 5 ? 0 :
          distance >= 6 ? 1 :
            distance - 5;

      const nodeId = cube.mesh.nodeID ?? -1;
      Godot.shader.updateNumber(nodeId, 'dissolve', normalizedDistance);
    }
  }, 50);
}

//The color on this needs to be 100% bright after the avg is determined
const shaderCodeSpiral = `
  shader_type spatial;

  uniform float proximity;

  void fragment() {
    vec2 uv = UV - 0.5;
    uv *= proximity;

    float fracX = fract(uv.x);
    float fracY = fract(uv.y);

    float blenderX = abs(fracX - 0.5);
    float blenderY = abs(fracY - 0.5);

    float maxUV = max(blenderX, blenderY);

    float mulled = maxUV * 0.5;
    mulled -= 0.25;

    float result = abs(mulled); 

    ALBEDO = vec3(result);
    ALPHA = 1.0;
  }
`;

//The color on this needs to be 100% bright after the avg is determined
const shaderCodeNew = `
  shader_type spatial;

  uniform float dissolve : hint_range(0.0, 1.0) = 0.0;
  uniform float noise_scale = 50.0;

  float hash(vec3 p) {
      p = fract(p * 0.3183099 + vec3(0.1));
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise3d(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);

      f = f * f * (3.0 - 2.0 * f);

      float n000 = hash(i + vec3(0,0,0));
      float n100 = hash(i + vec3(1,0,0));
      float n010 = hash(i + vec3(0,1,0));
      float n110 = hash(i + vec3(1,1,0));
      float n001 = hash(i + vec3(0,0,1));
      float n101 = hash(i + vec3(1,0,1));
      float n011 = hash(i + vec3(0,1,1));
      float n111 = hash(i + vec3(1,1,1));

      return mix(
          mix(
              mix(n000, n100, f.x),
              mix(n010, n110, f.x),
              f.y
          ),
          mix(
              mix(n001, n101, f.x),
              mix(n011, n111, f.x),
              f.y
          ),
          f.z
      );
  }

  void fragment() {
      float n = noise3d(VERTEX * noise_scale);

      // Equivalent to Blender's Less Than node
      if (n >= dissolve) {
          discard;
      }

      ALBEDO = vec3(1.0);
      EMISSION = vec3(1.0);
  }
`;
