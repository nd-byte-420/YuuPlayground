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
render_mode depth_draw_always, cull_back, diffuse_burley, specular_schlick_ggx;

// Shader parameters you can tweak in the inspector
uniform vec4 glass_color : source_color = vec4(0.8, 0.9, 1.0, 0.15); // Slight blue tint
uniform float roughness : hint_range(0.0, 1.0) = 0.05; // Very smooth
uniform float metallic : hint_range(0.0, 1.0) = 0.9;   // Highly reflective
uniform float refraction_strength : hint_range(0.0, 0.2) = 0.05;

// Captures the rendered scene behind the object
uniform sampler2D screen_texture : hint_screen_texture, filter_linear_mipmap;

void fragment() {
    // 1. Calculate the distortion offset using the geometry's normal
    vec2 offset = NORMAL.xy * refraction_strength;
    
    // 2. Apply the offset to the screen UV to simulate light bending (refraction)
    vec2 refraction_uv = SCREEN_UV + offset;

    // 3. Sample the background pixel behind the object
    vec3 background_color = texture(screen_texture, refraction_uv).rgb;

    // 4. Mix the distorted background with your chosen glass color
    // The alpha value of glass_color determines how strongly the tint is applied
    ALBEDO = mix(background_color, glass_color.rgb, glass_color.a);

    // 5. Apply PBR properties for realistic lighting reflections
    ROUGHNESS = roughness;
    METALLIC = metallic;
}
`