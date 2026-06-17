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
  const doorPos = new Vector3(pos.x, pos.y + 2 * 2, pos.z);
  // const cube = spawnPrimitive.cube(doorPos, new Vector3(5, 5, 0.1), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Physics', undefined);

  const door = spawnPrimitive.door3(doorPos, new Vector3(20, 1, 1), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Animated', undefined);
  const nodeId = door.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, doorShader4);

  let isGravityReversed = false;

  // Create a visible trigger on one side of the door
  const triggerPos = new Vector3(5,1,0);
  const triggerEntity = new Entity(triggerPos, Quaternion.one, new Vector3(0.5, 0.5, 4), undefined, 'Static');

  triggerEntity.trigger.initialize(new Vector3(0.5, 0.5, 4));
  triggerEntity.trigger.setVisible(true, Color.red);

  triggerEntity.trigger.setOccupiedFunction(() => {
    isGravityReversed = true;
    triggerEntity.trigger.setVisible(true, Color.green);
    if (nodeId !== -1) {
      Godot.shader.updateColor(nodeId, "border_color", 0.1, 1.0, 0.1);
    }
  });

  triggerEntity.trigger.setEmptyFunction(() => {
    isGravityReversed = false;
    triggerEntity.trigger.setVisible(true, Color.red);
    if (nodeId !== -1) {
      Godot.shader.updateColor(nodeId, "border_color", 1.0, 1.0, 1.0);
    }
  });

  let doorYVelocity = 0;

  Events.onUpdate((deltaTime) => {
    if (door.exists()) {
      door.rot = Quaternion.one;
      
      if (isGravityReversed) {
        // Accelerate upwards
        doorYVelocity += 9.8 * deltaTime;
      } else {
        // Accelerate downwards (default gravity)
        doorYVelocity -= 9.8 * deltaTime;
      }

      const curPos = door.pos;
      let curY = curPos.y + doorYVelocity * deltaTime;

      // Clamp door position to keep it between the ground (pos.y) and 2x the door height (pos.y + 2 * 2)
      const doorHeight = 2;
      const minY = pos.y;
      const maxY = pos.y + 2 * doorHeight;
      if (curY < minY) {
        curY = minY;
        if (doorYVelocity < 0) {
          doorYVelocity = 0;
        }
      } else if (curY > maxY) {
        curY = maxY;
        if (doorYVelocity > 0) {
          doorYVelocity = 0;
        }
      }
      door.pos = new Vector3(pos.x, curY, pos.z);
    }
  });

  const supportPos = new Vector3(pos.x, pos.y+1.9, pos.z+1.9);
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
render_mode blend_mix, depth_draw_opaque, cull_disabled;

uniform float border_width : hint_range(0.0, 0.5) = 0.05; 
uniform float normal_threshold : hint_range(0.0, 1.0) = 0.5;
uniform bool invert_mask = false;

varying vec3 local_pos;

void vertex() {
    local_pos = VERTEX;
}

void fragment() {
    // --- 1. Flat Normal Calculation ---
    vec3 flat_normal = normalize(cross(dFdy(local_pos), dFdx(local_pos)));

    // --- 2. Front/Back Normal Mask (SWAPPED Y for Z) ---
    // We are now checking the Z axis of the flat normal.
    float normal_mask = step(normal_threshold, abs(flat_normal.z));

    // --- 3. UV Border Mask ---
    float edge_x = step(1.0 - border_width, UV.x) + step(UV.x, border_width);
    float edge_y = step(1.0 - border_width, UV.y) + step(UV.y, border_width);
    
    float uv_mask = max(edge_x, edge_y);

    // --- 4. Final Combine ---
    float factor = clamp(max(uv_mask, normal_mask), 0.0, 1.0);
    
    if (invert_mask) {
        factor = 1.0 - factor;
    }

    // --- 5. Material Output ---
    ALBEDO = vec3(0.0); 
    EMISSION = vec3(1.0) * factor; 
    ALPHA = factor; 
}
`

const doorShader3 = `
shader_type spatial;
render_mode blend_mix, depth_draw_opaque, cull_disabled;

uniform float border_width : hint_range(0.0, 0.5) = 0.05; 
uniform float normal_threshold : hint_range(0.0, 1.0) = 0.5;
uniform bool invert_mask = false;

varying vec3 local_pos;

void vertex() {
    local_pos = VERTEX;
}

void fragment() {
    // --- 1. Flat Normal Calculation ---
    vec3 flat_normal = normalize(cross(dFdy(local_pos), dFdx(local_pos)));

    // --- 2. Y and Z Normal Mask ---
    // Check BOTH the Y (top/bottom) and Z (front/back) axes.
    // If either axis exceeds the threshold, the mask becomes 1.0.
    float mask_y = abs(flat_normal.y);
    float mask_z = abs(flat_normal.z);
    float normal_mask = step(normal_threshold, max(mask_y, mask_z));

    // --- 3. UV Border Mask ---
    float edge_x = step(1.0 - border_width, UV.x) + step(UV.x, border_width);
    float edge_y = step(1.0 - border_width, UV.y) + step(UV.y, border_width);
    
    float uv_mask = max(edge_x, edge_y);

    // --- 4. Final Combine ---
    float factor = clamp(max(uv_mask, normal_mask), 0.0, 1.0);
    
    if (invert_mask) {
        factor = 1.0 - factor;
    }

    // --- 5. Material Output ---
    ALBEDO = vec3(0.0); 
    EMISSION = vec3(1.0) * factor; 
    ALPHA = factor; 
}`

const doorShader4 = `
shader_type spatial;

// Added depth_draw_always to fix overlapping transparency issues.
// Note: I kept cull_disabled instead of cull_back so you can see the borders on the back of the cube through the front glass.
render_mode blend_mix, depth_draw_always, cull_disabled;

// --- Mask Uniforms ---
uniform float border_width : hint_range(0.0, 0.5) = 0.05; 
uniform float normal_threshold : hint_range(0.0, 1.0) = 0.5;
uniform bool invert_mask = false;

// --- Glass Uniforms ---
uniform vec4 glass_color : source_color = vec4(0.8, 0.9, 1.0, 0.3); 
uniform float roughness : hint_range(0.0, 1.0) = 0.05; 
uniform float metallic : hint_range(0.0, 1.0) = 0.9;   

// --- Border Uniforms ---
uniform vec4 border_color : source_color = vec4(1.0, 1.0, 1.0, 1.0);
uniform float border_emission = 1.0;

varying vec3 local_pos;

void vertex() {
    local_pos = VERTEX;
}

void fragment() {
    // --- 1. Flat Normal Calculation ---
    vec3 flat_normal = normalize(cross(dFdy(local_pos), dFdx(local_pos)));

    // --- 2. Y and Z Normal Mask ---
    float mask_y = abs(flat_normal.y);
    float mask_z = abs(flat_normal.z);
    float normal_mask = step(normal_threshold, max(mask_y, mask_z));

    // --- 3. UV Border Mask ---
    float edge_x = step(1.0 - border_width, UV.x) + step(UV.x, border_width);
    float edge_y = step(1.0 - border_width, UV.y) + step(UV.y, border_width);
    float uv_mask = max(edge_x, edge_y);

    // --- 4. Final Combine Factor ---
    // factor = 1.0 (Border), factor = 0.0 (Glass)
    float factor = clamp(max(uv_mask, normal_mask), 0.0, 1.0);
    if (invert_mask) {
        factor = 1.0 - factor;
    }

    // --- 5. Mix Materials based on Factor ---
    
    // Mix the base colors. 
    ALBEDO = mix(glass_color.rgb, border_color.rgb, factor);
    
    // Mix the alpha. Uses the glass_color.a for the center, and border_color.a for the edges.
    ALPHA = mix(glass_color.a, border_color.a, factor);
    
    // Apply PBR properties. 
    // The glass gets your roughness/metallic values. 
    // The border gets standard matte non-metallic values (1.0 roughness, 0.0 metallic).
    ROUGHNESS = mix(roughness, 1.0, factor);
    METALLIC = mix(metallic, 0.0, factor);
    
    // Apply emission only to the border
    EMISSION = border_color.rgb * border_emission * factor;
}
`