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

  const door = spawnPrimitive.door(doorPos, new Vector3(0.1, 2, 2), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Physics', undefined);
  const nodeId = door.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, doorShader4);

  let isGravityReversed = false;

  // Create a visible trigger on one side of the door
  const triggerPos = new Vector3(0,1,0);
  const triggerEntity = new Entity(triggerPos, Quaternion.one, new Vector3(3, 3, 3), undefined, 'Static');
  triggerEntity.trigger.initialize(1.5, undefined);
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

  Events.onPhysicsUpdate((deltaTime) => {
    if (door.exists()) {
      door.rot = Quaternion.one;
      
      const curPos = door.pos;
      let vel = door.velocity.get();
      if (vel) {
        let yVel = vel.y;
        if (isGravityReversed) {
          // Accelerate upwards: counteract default downward gravity (9.8 m/s^2)
          // and apply an upward gravity (9.8 m/s^2). Net upward acceleration is 19.6 m/s^2.
          yVel += 19.6 * deltaTime;
        }
        door.velocity.set(new Vector3(0, yVel, 0));
      }

      // Clamp door position to keep it between the ground (pos.y) and 2x the door height (pos.y + 2 * 2)
      let curY = curPos.y;
      const doorHeight = 2;
      const minY = 0;
      const maxY = pos.y + 2 * doorHeight;
      if (curY < minY) {
        curY = minY;
        const currentVel = door.velocity.get();
        if (currentVel && currentVel.y < 0) {
          door.velocity.set(new Vector3(0, 0, 0));
        }
      } else if (curY > maxY) {
        curY = maxY;
        const currentVel = door.velocity.get();
        if (currentVel && currentVel.y > 0) {
          door.velocity.set(new Vector3(0, 0, 0));
        }
      }
      door.pos = new Vector3(pos.x, curY, pos.z);
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

// Keeping cull_disabled so you can look through the glass to the back walls
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

// --- Borderlands Outline Uniforms ---
uniform vec4 outline_color : source_color = vec4(0.0, 0.0, 0.0, 1.0);
uniform float outline_thickness : hint_range(0.0, 1.0, 0.01) = 0.35; // Adjust via API to make ink lines thinner/thicker

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

    // --- 4. Final Combine Factor for White Grid Lines ---
    float factor = clamp(max(uv_mask, normal_mask), 0.0, 1.0);
    if (invert_mask) {
        factor = 1.0 - factor;
    }

    // --- 5. Fix: Smart Borderlands Silhouette Outline ---
    // Calculate alignment with camera view. We wrap NORMAL in an absolute check
    // or adjust it based on FRONT_FACING to prevent the black sphere glitch.
    float view_alignment = dot(NORMAL, VIEW);
    
    // If FRONT_FACING is true, we are looking at the outside of the glass.
    // If false, we are looking at the inside back-faces. We only want outlines on the outside!
    float ink_outline_mask = 0.0;
    if (FRONT_FACING) {
        ink_outline_mask = step(outline_thickness, 1.0 - max(0.0, view_alignment));
    }

    // --- 6. Mix Everything Together ---
    vec3 base_albedo = mix(glass_color.rgb, border_color.rgb, factor);
    float base_alpha = mix(glass_color.a, border_color.a, factor);
    float base_roughness = mix(roughness, 1.0, factor);
    float base_metallic = mix(metallic, 0.0, factor);
    vec3 base_emission = border_color.rgb * border_emission * factor;

    // Overwrite the outer edges with your ink color parameter
    ALBEDO = mix(base_albedo, outline_color.rgb, ink_outline_mask);
    ALPHA = mix(base_alpha, outline_color.a, ink_outline_mask);
    ROUGHNESS = mix(base_roughness, 1.0, ink_outline_mask);
    METALLIC = mix(base_metallic, 0.0, ink_outline_mask);
    
    // Turn off emission on the ink lines so they stay pitch black
    EMISSION = mix(base_emission, vec3(0.0), ink_outline_mask);
}

`