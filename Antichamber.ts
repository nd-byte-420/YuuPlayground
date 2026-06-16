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
  const cube = spawnPrimitive.cube(doorPos, new Vector3(5, 5, 0.1), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Physics', undefined);

  cube.collidable.set(true);
  const nodeId = cube.mesh.nodeID ?? -1;

  Godot.shader.applyToMesh(nodeId, doorShader);


  Events.onPhysicsUpdate(() => {
    if (cube.exists()) {
      cube.rot = Quaternion.one;
      
      const curPos = cube.pos;
      cube.pos = new Vector3(pos.x, curPos.y, pos.z);
      
      const vel = cube.velocity.get();
      if (vel) {
        cube.velocity.set(new Vector3(0, vel.y, 0));
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
render_mode blend_mix, depth_draw_opaque, cull_back, diffuse_burley, specular_schlick_ggx;

// Exposing uniforms so you can tweak the material in the Godot inspector
group_uniforms Base_Properties;
uniform vec4 base_color : source_color = vec4(1.0, 1.0, 1.0, 1.0);
uniform float metallic = 0.0;

group_uniforms Border_Logic;
// In your graph, the "Greater Than" nodes had a default of 0.5. 
// You may need to lower this slightly (e.g., to 0.45 or 0.48) to see a thicker border.
uniform float border_threshold = 0.5; 

group_uniforms Map_Ranges;
// Values for the Alpha Map Range node
uniform float alpha_to_min = 0.0;
uniform float alpha_to_max = 1.0;

// Values for the Roughness Map Range node
uniform float roughness_to_min = 0.0;
uniform float roughness_to_max = 1.0;

void fragment() {
	// 1. Texture Coordinate (UV)
	vec2 uv = UV;
	
	// 2. Separate XYZ -> Math Logic for X
	float x_sub = uv.x - 0.5;
	float x_abs = abs(x_sub);
	// Equivalent to Math > Greater Than
	float x_gt = x_abs > border_threshold ? 1.0 : 0.0; 
	
	// 3. Separate XYZ -> Math Logic for Y
	float y_sub = uv.y - 0.5;
	float y_abs = abs(y_sub);
	// Equivalent to Math > Greater Than
	float y_gt = y_abs > border_threshold ? 1.0 : 0.0;
	
	// 4. Math > Maximum
	float border_mask = max(x_gt, y_gt);
	
	// 5. Map Range (Alpha)
	// Remaps the 0-1 mask to your target alpha range
	float mapped_alpha = mix(alpha_to_min, alpha_to_max, border_mask);
	
	// 6. Map Range.001 (Roughness)
	// Remaps the 0-1 mask to your target roughness range
	float mapped_roughness = mix(roughness_to_min, roughness_to_max, border_mask);
	
	// 7. Principled BSDF Output
	ALBEDO = base_color.rgb;
	METALLIC = metallic;
	ROUGHNESS = mapped_roughness;
	ALPHA = mapped_alpha;
}`