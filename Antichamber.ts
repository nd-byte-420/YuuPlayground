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