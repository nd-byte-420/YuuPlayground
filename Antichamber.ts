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
import { CubeEntity } from "./CubeGun";
import { Events } from "./Yuu API/Events";

export const antichamber = {
  spawnDoor,
}

// create a cube and attach shadercode new/
async function spawnDoor(pos: Vector3) {
  const doorPos = new Vector3(pos.x, pos.y + 5, pos.z);
  // const cube = spawnPrimitive.cube(doorPos, new Vector3(5, 5, 0.1), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Physics', undefined);

  const door = spawnPrimitive.door(doorPos, new Vector3(5, 5, 5), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Physics', undefined);
  const nodeId = door.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, doorShader2);


  Events.onPhysicsUpdate(() => {
    if (door.exists()) {
      door.rot = Quaternion.one;
      
      const curPos = door.pos;
      door.pos = new Vector3(pos.x, curPos.y, pos.z);
      
      const vel = door.velocity.get();
      if (vel) {
        door.velocity.set(new Vector3(0, vel.y, 0));
      }
    }
  });

  const supportPos = new Vector3(pos.x, pos.y + 2.5, pos.z);
  const supportCube = new CubeEntity(supportPos, true, new Vector3(0.1,0.1,0.1), Color.blue, 'Static');
  const support = supportCube.entity;
  support.collidable.set(true);
}


const doorShader = `
shader_type spatial;
// blend_mix enables standard transparency, depth_draw_always fixes overlapping glass issues
render_mode blend_mix, depth_draw_always, cull_back, specular_schlick_ggx;

// The Alpha channel here (0.3) dictates the transparency
uniform vec4 glass_color : source_color = vec4(0.8, 0.9, 1.0, 0.3); 
uniform float roughness : hint_range(0.0, 1.0) = 0.05; 
uniform float metallic : hint_range(0.0, 1.0) = 0.9;   

void fragment() {
    // 1. Set the base color
    ALBEDO = glass_color.rgb;
    
    // 2. Set the transparency. 
    // This single line tells Godot to push this object to the transparent render pass.
    ALPHA = glass_color.a;

    // 3. Apply PBR properties for realistic lighting reflections
    ROUGHNESS = roughness;
    METALLIC = metallic;
}
`



const doorShader2 = `
shader_type spatial;

// Enable transparency and standard blending
render_mode blend_mix, depth_draw_opaque, cull_disabled;

// We use a varying to pass the object-space normal from the vertex to the fragment shader,
// because Godot's fragment 'NORMAL' is in view-space, whereas Blender's TexCoord Normal is object-space.
varying vec3 object_normal;

void vertex() {
    object_normal = NORMAL;
}

void fragment() {
    // --- 1. Texture Coordinate (UV) -> Separate XYZ ---
    float uv_x = UV.x;
    float uv_y = UV.y;

    // --- 2. Math Operations for UV X ---
    // Math & Math.002
    float math = uv_x - 0.5;
    float math_002 = math > 0.5 ? 1.0 : 0.0;
    
    // Math.003 & Math.004
    float math_003 = uv_x - 0.5;
    float math_004 = math_003 < 0.5 ? 1.0 : 0.0;
    
    // Math.005 (Maximum of X)
    float math_005 = max(math_002, math_004);

    // --- 3. Math Operations for UV Y ---
    // Math.001 & Math.006
    float math_001 = uv_y - 0.5;
    float math_006 = math_001 > 0.5 ? 1.0 : 0.0;
    
    // Math.007 & Math.008
    float math_007 = uv_y - 0.5;
    float math_008 = math_007 < 0.5 ? 1.0 : 0.0;
    
    // Math.009 (Maximum of Y)
    float math_009 = max(math_006, math_008);

    // --- 4. Combine UV X and Y masks ---
    // Math.010
    float math_010 = max(math_005, math_009);

    // --- 5. Texture Coordinate (Normal) -> Separate XYZ.001 ---
    float norm_y = object_normal.y;

    // --- 6. Math Operations for Normal Y ---
    // Math.011 (Absolute) & Math.012 (Greater Than)
    float math_011 = abs(norm_y);
    float math_012 = math_011 > 0.5 ? 1.0 : 0.0;

    // --- 7. Final Mask Combine ---
    // Math.013 (Mix Shader Factor)
    float math_013 = max(math_010, math_012);

    // --- 8. Mix Shader: Transparent BSDF and Emission ---
    // The Mix Shader uses math_013 as the Factor.
    // Factor 0.0 = Transparent BSDF
    // Factor 1.0 = Emission Shader (Color: 1,1,1, Strength: 1.0)
    
    float factor = math_013;
    
    // Godot handles emission and transparency via specific built-in variables
    ALBEDO = vec3(0.0); // Black base color so only emission is visible
    EMISSION = vec3(1.0) * factor; // Pure white emission scaled by our mask
    ALPHA = factor; // Transparent where the mask is 0
}`