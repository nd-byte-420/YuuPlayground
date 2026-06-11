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
  spawnDissolveCubeSmall,
  spawnDissolveCubeBest
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

// create a cube and attach shadercode new/
async function spawnDissolveCubeBest(pos: Vector3) {

  const cube = spawnPrimitive.cube(pos, new Vector3(10,1,10), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(false)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shaderBest);
  
  Async.setInterval(() => {
    const playerPos = Player.position.get();
    if (playerPos) {
      Godot.shader.updateColor(nodeId, 'camera_coords', pos.x, pos.y, pos.z);

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

const shaderBest = `
shader_type spatial;
render_mode blend_mix, depth_draw_opaque, cull_disabled, unshaded;

// Replaces the "Camera" vector from Blender's Texture Coordinate node
uniform vec3 camera_coords = vec3(0.0, 0.0, 0.0);

varying vec3 obj_pos;

// Standard 3D pseudo-random noise function to mimic Blender's Noise Texture
float hash(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 144.7272))) * 43758.5453);
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0.0,0.0,0.0)), hash(i + vec3(1.0,0.0,0.0)), f.x),
                   mix(hash(i + vec3(0.0,1.0,0.0)), hash(i + vec3(1.0,1.0,0.0)), f.x), f.y),
               mix(mix(hash(i + vec3(0.0,0.0,1.0)), hash(i + vec3(1.0,0.0,1.0)), f.x),
                   mix(hash(i + vec3(0.0,1.0,1.0)), hash(i + vec3(1.0,1.0,1.0)), f.x), f.y), f.z);
}

void vertex() {
    // Recreates the "Object" vector from Blender's Texture Coordinate node
    obj_pos = VERTEX;
}

void fragment() {
    // --- Sub-Graph 1 & 2: Voxel Grid Bounds (Separate XYZ & Math 0-10) ---
    vec3 fract_pos = fract(obj_pos);

    // Note: The Blender JSON exported identical default values (0.5) for both Less Than and Greater Than inputs.
    // Strictly translating this means (x < 0.5) * (x > 0.5), which evaluates to 0. 
    // To see your voxels, you will likely need to adjust these to create a bounding box (e.g., 0.1 and 0.9).
    float math_x  = (fract_pos.x < 0.5) ? 1.0 : 0.0;
    float math1_x = (fract_pos.x > 0.5) ? 1.0 : 0.0;
    float math2   = math_x * math1_x;

    float math3_y = (fract_pos.y < 0.5) ? 1.0 : 0.0;
    float math4_y = (fract_pos.y > 0.5) ? 1.0 : 0.0;
    float math5   = math3_y * math4_y;

    float math6_z = (fract_pos.z < 0.5) ? 1.0 : 0.0;
    float math7_z = (fract_pos.z > 0.5) ? 1.0 : 0.0;
    float math8   = math6_z * math7_z;

    float math9  = math2 * math5;
    float math10 = math9 * math8;

    // --- Sub-Graph 3: Camera Distance/Falloff (Separate XYZ.001 & Math 11-20) ---
    float math11 = abs(camera_coords.x);
    float math12 = abs(camera_coords.y);
    float math13 = abs(camera_coords.z);

    // Power operations with default exponent 0.5 (square root)
    float math14 = pow(math11, 0.5);
    float math15 = pow(math12, 0.5);
    float math16 = pow(math13, 0.5);

    float math17 = math14 + math15;
    float math18 = math17 + math16;
    float math19 = pow(math18, 0.5);

    float math20 = (math19 < 0.5) ? 1.0 : 0.0;

    // --- Sub-Graph 4: Noise Texture & Map Range ---
    // Noise Scale set to 50.0 based on Blender node properties
    float n_val = noise(obj_pos * 50.0); 
    
    // Map Range [0.0, 1.0] to [0.0, 1.0] simplifies to a clamp function
    float map_range = clamp(math19, 0.0, 1.0); 

    float math21 = (n_val > map_range) ? 1.0 : 0.0;

    // --- Sub-Graph 5: Final Mixes ---
    float math22 = math20 * math21;
    float math23 = math10 * math22;
    
    // Math.024 multiplied by default input of 0.5
    float math24 = math23 * 0.5;

    // --- Principled Volume Output ---
    vec3 vol_color = vec3(0.0, 0.8, 1.0);
    vec3 vol_emission = vec3(0.0, 0.4, 0.6);

    ALBEDO = vol_color;
    EMISSION = vol_emission * math24;
    
    // Alpha controls the volumetric masking/density
    ALPHA = math24;
}`

// const shaderBest = `
// shader_type spatial;
// render_mode blend_add, depth_draw_opaque, cull_disabled, unshaded;

// // Colors pulled directly from your Principled Volume node
// uniform vec3 volume_color : source_color = vec3(0.0, 0.8, 1.0);
// uniform vec3 emission_color : source_color = vec3(0.0, 0.4, 0.6);

// // NEW: Your custom camera/target coordinate
// uniform vec3 custom_camera_pos = vec3(0.0, 0.0, 0.0);

// varying vec3 local_pos;
// varying vec3 world_pos; // We need this to compare against your custom uniform

// void vertex() {
//     local_pos = VERTEX;
//     // Get the absolute world position of the vertex
//     world_pos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
// }

// // ----------------------------------------------------
// // FBM Noise (Unchanged)
// // ----------------------------------------------------
// float hash(vec3 p) {
//     p = fract(p * 0.3183099 + 0.1);
//     p *= 17.0;
//     return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
// }

// float noise(vec3 x) {
//     vec3 i = floor(x);
//     vec3 f = fract(x);
//     f = f * f * (3.0 - 2.0 * f);
//     return mix(mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
//                    mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
//                mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
//                    mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
// }

// float fbm(vec3 x) {
//     float v = 0.0;
//     float a = 0.5;
//     vec3 shift = vec3(100.0);
//     for (int i = 0; i < 3; ++i) { 
//         v += a * noise(x);
//         x = x * 2.0 + shift;
//         a *= 0.5;
//     }
//     return v;
// }

// void fragment() {
//     // ========================================================
//     // BRANCH 1: Object Coordinates & Voxel Logic 
//     // ========================================================
//     vec3 frac_obj = fract(local_pos);

//     float math_x = (frac_obj.x < 0.5) ? 1.0 : 0.0;
//     float math_001_x = (frac_obj.x > 0.5) ? 1.0 : 0.0;
//     // Note: Change '*' to '+' here if the grid is invisible
//     float math_002_x = math_x * math_001_x; 

//     float math_y = (frac_obj.y < 0.5) ? 1.0 : 0.0;
//     float math_004_y = (frac_obj.y > 0.5) ? 1.0 : 0.0;
//     float math_005_y = math_y * math_004_y;

//     float math_z = (frac_obj.z < 0.5) ? 1.0 : 0.0;
//     float math_007_z = (frac_obj.z > 0.5) ? 1.0 : 0.0;
//     float math_008_z = math_z * math_007_z;

//     float math_009 = math_002_x * math_005_y;
//     float math_010 = math_009 * math_008_z;

//     // ========================================================
//     // BRANCH 2: Camera Distance Logic (UPDATED FOR UNIFORM)
//     // ========================================================
//     // Calculate the vector from the pixel to your custom coordinate
//     vec3 cam_coord = world_pos - custom_camera_pos;
    
//     float abs_x = abs(cam_coord.x);
//     float abs_y = abs(cam_coord.y);
//     float abs_z = abs(cam_coord.z);

//     float pow_x = pow(abs_x, 0.5);
//     float pow_y = pow(abs_y, 0.5);
//     float pow_z = pow(abs_z, 0.5);

//     float math_017 = pow_x + pow_y;
//     float math_018 = math_017 + pow_z;
//     float math_019 = pow(math_018, 0.5);

//     float math_020 = (math_019 < 0.5) ? 1.0 : 0.0;

//     // ========================================================
//     // BRANCH 3: Noise 
//     // ========================================================
//     float noise_val = fbm(local_pos * 50.0);
//     float map_res = clamp(math_019, 0.0, 1.0);
//     float math_021 = (noise_val > map_res) ? 1.0 : 0.0;

//     // ========================================================
//     // FINAL MIX
//     // ========================================================
//     float math_022 = math_020 * math_021;
//     float math_023 = math_010 * math_022;
//     float math_024 = math_023 * 0.5;

//     ALBEDO = volume_color; 
//     ALPHA = math_024;
//     EMISSION = emission_color * math_024;
// }`