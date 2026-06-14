import { registerStart } from "./Yuu API/RegisterStart";
import { playgroundDemos } from "./PlaygroundLaex";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { lexy } from "./PlaygroundLexy";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Color } from "./Yuu API/Basic Types/Color";
import { Async } from "./Yuu API/Async";
import { Player } from "./Yuu API/Player";

type BaseNodeTypes = 'Empty' | 'Static' | 'Animated' | 'Physics';

registerStart(start);
async function start() {
  playgroundDemos.spawnPaintableSphere(new Vector3(-1.5, 2, -3));
  playgroundDemos.canvas(new Vector3(0, 0.85, -4), Quaternion.one, Vector3.one);
  lexy.spawnDrawSettingButtons(new Vector3(0, 2.05, -4.15));
  playgroundDemos.colorPicker(new Vector3(1, 1.5, -3.5), Quaternion.fromEuler(new Vector3(0, -Math.PI / 4, 0)), new Vector3(0.35, 1, 0.35));
  playgroundDemos.spawnShaderSphere(new Vector3(-5, 2.5, -4));

  rainbowWave(new Vector3(-3, 5, -4));

  // Come back to this to get water shader working
  // playgroundDemos.spawnShaderSphere(new Vector3(-5, 2.5, -4));
}

// registerStart(start2);
function start2() {
  // const peer = new Peer();
  console.log(Godot.networking.rtcPeer.create());
}

async function rainbowWave(pos: Vector3) {

  const rw = spawnPrimitive.rainbowWaveLoop2(new Vector3(0, 0, 0), new Vector3(2, 2, 2), Quaternion.one, Color.white, 1, 'Concave', 'Static', undefined);

  const nodeId = rw.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, rainbowShader);
  
  let i = 0

  Async.setInterval(() => {
      i++;
      const nodeId = rw.mesh.nodeID ?? -1;
      Godot.shader.updateNumber(nodeId, 'custom_value', i);
  }, 50);
}

const rainbowShader = `
shader_type spatial;
render_mode unshaded; // Mirrors the Color Ramp bypassing a BSDF node

// --- Uniforms ---
uniform float custom_value = 1.0;      // Maps to the "Value" node
uniform float math4_divisor = 1.0;     // Default denominator for Math.004 (Divide)
uniform sampler2D color_ramp_001;      // Assign a GradientTexture1D in Godot's inspector

// Mapping Node parameters
uniform vec3 mapping_location = vec3(0.0);
uniform vec3 mapping_rotation = vec3(0.0); // Euler angles in radians
uniform vec3 mapping_scale    = vec3(1.0);

// Passed from vertex to fragment for local Object-space coordinates
varying vec3 local_pos;

void vertex() {
    // VERTEX in the vertex shader represents local object coordinates
    local_pos = VERTEX;
}

// Replicates Blender's Math "Wrap" function (Value, Min, Max)
// Assumes defaults Min=0.0, Max=1.0 based on typical node usage
float wrap_blender(float val, float min_val, float max_val) {
    float range = max_val - min_val;
    return (range == 0.0) ? min_val : val - (range * floor((val - min_val) / range));
}

void fragment() {
    // 1. Texture Coordinate (Object)
    vec3 tex_coord_obj = local_pos;

    // 2. Vector Math.003 (Add) - Assumes unconnected second input is (0,0,0)
    vec3 vmath3 = tex_coord_obj + vec3(0.0);

    // 3. Separate XYZ.002
    float sep2_z = vmath3.z;

    // 4. Math (Wrap)
    float math_wrap = wrap_blender(sep2_z, 0.0, 1.0);

    // 5. Math.004 (Divide)
    float math4_div = custom_value / math4_divisor;

    // 6. Math.003 (Wrap)
    float math3_wrap = wrap_blender(math4_div, 0.0, 1.0);

    // 7. Math.001 (Add)
    float math1_add = math_wrap + math3_wrap;

    // 8. Math.002 (Wrap, with use_clamp: true)
    float math2_wrap = wrap_blender(math1_add, 0.0, 1.0);
    float math2_clamp = clamp(math2_wrap, 0.0, 1.0);

    // 9. Combine XYZ.001
    // Note: When Blender plugs a Vector into a Value (Float) socket, 
    // it automatically averages the three components: (X + Y + Z) / 3.0
    float vmath3_avg = (vmath3.x + vmath3.y + vmath3.z) / 3.0;
    vec3 comb1 = vec3(vmath3_avg, vmath3_avg, math2_clamp);

    // 10. Mapping (Scale -> Rotate -> Translate)
    vec3 mapped = comb1 * mapping_scale;
    
    // Compute rotation matrices
    float cx = cos(mapping_rotation.x);
    float sx = sin(mapping_rotation.x);
    float cy = cos(mapping_rotation.y);
    float sy = sin(mapping_rotation.y);
    float cz = cos(mapping_rotation.z);
    float sz = sin(mapping_rotation.z);

    mat3 rot_x = mat3(vec3(1.0, 0.0, 0.0), vec3(0.0, cx, -sx), vec3(0.0, sx, cx));
    mat3 rot_y = mat3(vec3(cy, 0.0, sy), vec3(0.0, 1.0, 0.0), vec3(-sy, 0.0, cy));
    mat3 rot_z = mat3(vec3(cz, -sz, 0.0), vec3(sz, cz, 0.0), vec3(0.0, 0.0, 1.0));

    mapped = rot_z * rot_y * rot_x * mapped;
    mapped += mapping_location;

    // 11. Separate XYZ.001
    float sep1_z = mapped.z;

    // 12. Color Ramp.001
    // Sample the gradient texture horizontally using the computed Z factor
    vec4 ramp_color = texture(color_ramp_001, vec2(sep1_z, 0.5));

    // 13. Material Output
    ALBEDO = ramp_color.rgb;
    ALPHA = ramp_color.a;
}`