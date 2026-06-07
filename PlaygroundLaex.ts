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
  const shaderSphere = spawnPrimitive.sphere(16, 16, pos, 1, Quaternion.fromEuler(new Vector3(0, 180, 0)), Color.white, 1, 'None', 'Static', undefined);

  shaderSphere.trigger.initialize(1, undefined);
  shaderSphere.trigger.setOccupiedFunction((occupiedTriggerPayload) => {
    Player.position.set(occupiedTriggerPayload.pos.add(new Vector3(0, 5, 0)));
  });

  Godot.shader.applyToMesh(shaderSphere.mesh.nodeID ?? -1, shaderCodeSpiral);

  let hue = 0;

  Async.setInterval(() => {
    hue = (hue + 0.005) % 1;
    const color = Color.fromHSV(hue, 1, 1);
    Godot.shader.updateColor(shaderSphere.mesh.nodeID ?? -1, 'line_color', color.r, color.g, color.b);
  }, 100);
}

//The color on this needs to be 100% bright after the avg is determined
const shaderCodeSpiral = `
  shader_type spatial;

  uniform vec2 resolution = vec2(1920.0,1080.0);
  uniform vec3 line_color: source_color = vec3(0.0,1.0,0.0);
  uniform float direction: hint_range(-1.0, 1.0, 0.01) = 0.5;
  uniform float brightness: hint_range(0.0, 30.0, 0.01) = 15.0;
  uniform float speed: hint_range(0.0, 10.0, 0.01) = 1.0;
  uniform float octaves: hint_range(1.0, 200.0, 0.1) = 100.0;
  uniform float shift: hint_range(0.0, 10.0, 0.01) = 1.0;
  uniform float stretch: hint_range(1.0, 100.0, 0.1) = 10.0;
  uniform float alpha_threshold: hint_range(0.0, 1.0, 0.01) = 1.0;

  mat2 rotate(float a) {
    float sa = sin(a);
    float ca = cos(a);
    return mat2(vec2(ca, sa), vec2(-sa,ca));
  }

  vec3 fbm(vec3 ray) { //fbm = fractal brownian motion
    vec3 result = vec3(0.0);
    float time = TIME * speed;
    for (float i = 0.0; i < octaves; i++) {
      vec3 p = result;
      p.z += time + i * shift * 0.01;
      p.z /= stretch * 1.0;
      p.xy *= rotate(p.z);
      result += length(sin(p.yx + time) + cos(p.xz + time)) * ray;
    }
    return result;
  }

  void fragment() {
    vec2 uv = UV - 0.5; //moves coordinate origin to center
    uv.x *= resolution.x / resolution.y;
    vec3 ray = vec3(uv, direction);
    vec3 result = fbm(ray);
    vec3 color = vec3(brightness / length(result)) * line_color;
    float avg = (color.r + color.g + color.b) / 3.0;
    
    
    ALBEDO = color;
    ALPHA = clamp(avg * 3.0 - 0.5, 0.0, 1.0);
    // ALPHA = avg <= alpha_threshold ? 0.0 : 1.0;
  }
`;

const shaderCodeWater = `
  shader_type spatial;

  uniform sampler2D DEPTH_TEXTURE : hint_depth_texture, filter_linear_mipmap;
  uniform sampler2D SCREEN_TEXTURE : hint_screen_texture, filter_linear_mipmap;

  uniform vec3 albedo : source_color;
  uniform vec3 albedo2 : source_color;
  uniform float metallic : hint_range(0.0, 0.1) = 0;
  uniform float roughness : hint_range(0.0, 1.0) = 0.02;
  uniform sampler2D wave;
  uniform sampler2D texture_normal;
  uniform sampler2D texture_normal2;
  uniform vec2 wave_direction = vec2(2.0, 0.0);
  uniform vec2 wave_direction2 = vec2(0.0, 1.0);
  uniform float time_scale : hint_range(0.0, 0.2, 0.005) = 0.025;
  uniform float noise_scale = 10.0;
  uniform float height_scale = 0.15;

  uniform vec4 color_deep : source_color; // Deep depth color
  uniform vec4 color_shallow : source_color; // Shallow depth color
  uniform float beers_law = 2.0; // Beer's law application
  uniform float depth_offset = -0.75; // Offset

  uniform float edge_scale = 0.1;
  uniform float near = 1.0;
  uniform float far = 100.0;
  uniform vec3 edge_color : source_color;




  // Varying Variables
  varying float height;
  varying vec3 world_pos;


  float fresnel(float amount, vec3 normal, vec3 view)
  {
    return pow((1.0 - clamp(dot(normalize(normal), normalize(view)), 0.0, 1.0)), amount);
  }
  float edge(float depth){
    depth = 1.0 - 2.0 * depth;
    return near * far / (far + depth * (near - far));
  }

  void vertex() {
    world_pos = (MODEL_MATRIX * vec4(VERTEX,1.0)).xyz;
    height = texture(wave,world_pos.xz / noise_scale + TIME * time_scale).r;
    VERTEX.y += height * height_scale;
  }


  void fragment() {
    //Depth variables and calc
    float depth_texture = texture(DEPTH_TEXTURE, SCREEN_UV).r  * 2.0 - 1.0;
    float depth = PROJECTION_MATRIX[3][2] / (depth_texture + PROJECTION_MATRIX[2][2]);
    float depth_blend = exp((depth+VERTEX.z + depth_offset) * -beers_law);
    depth_blend = clamp(1.0 - depth_blend, 0.0, 1.0);
    float depth_blend_power = clamp(pow(depth_blend, 2.5), 0.0, 1.0);
    
    vec3 screen_color = textureLod(SCREEN_TEXTURE, SCREEN_UV, depth_blend_power * 2.5).rgb;
    vec3 depth_color = mix(color_shallow.rgb, color_deep.rgb, depth_blend_power);
    vec3 color = mix(screen_color * depth_color, depth_color * 0.25, depth_blend_power * 0.5);
    
    // Getting edge depth call
    float z_depth = edge(texture(DEPTH_TEXTURE, SCREEN_UV).x);
    float z_pos = edge(FRAGCOORD.z);
    float z_dif = z_depth - z_pos;
    
    
    // Time calculations for wave(normal map) movement
    vec2 time = (TIME * wave_direction) * time_scale; //movement rate of first wave
    vec2 time2 = (TIME * wave_direction2) * time_scale; //movement rate of second wave
    
    // Blend normal maps into one
    vec3 normal_blend = mix(texture(texture_normal,world_pos.xz + time).rgb, 
    texture(texture_normal2,world_pos.xz + time2).rgb, 0.5);
    
    // Calculate Fresnel
    float fresnel = fresnel(5.0,NORMAL,VIEW);
    vec3 surface_color = mix(albedo,albedo2,fresnel); // Interpolate albedo values by fresnel
    
    vec3 depth_color_adj = mix(edge_color, color, step(edge_scale, z_dif));
    
    
    ALBEDO = clamp(surface_color + depth_color_adj,vec3(0.0),vec3(1.0));
    METALLIC = metallic;
    ROUGHNESS = roughness;
    NORMAL_MAP = normal_blend;
    
  }
`;

const shaderCodeMirror = `
  shader_type spatial;

  void fragment() {
  ROUGHNESS = 0.0;
  METALLIC = 1.0;
  ALBEDO = vec3(1.0, 1.0, 1.0);
  }
`;