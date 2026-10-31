import { Color } from "../Basic Types/Color"


export const DefaultShaders = {
  getColorShader,
  getRainbowShader,
  getHeartShader,
}

/**
 * Get simple color shader code
 * @param color to apply
 * @param metallic values range from 0 to 1, where 1 is very reflective.
 * @param roughness values range from 0 to 1, where 1 is rough / matte.
 * @returns string of the shader code
 */
function getColorShader(color: Color, metallic: number, roughness: number): string {
  return `
            shader_type spatial;

            void fragment() {
                ALBEDO = vec3(`+ color.r.toString() + `, ` + color.g.toString() + `, ` + color.b.toString() + `);
                METALLIC = `+ metallic.toPrecision(2) + `;
                ROUGHNESS = `+ roughness.toPrecision(2) + `;
            }
        `;
}

/**
 * Get hue fader shader code
 * @param durationSeconds it takes to cycle through the full hue spectrum
 * @param saturation of the colors
 * @param value of the colors
 * @param metallic values range from 0 to 1, where 1 is very reflective.
 * @param roughness values range from 0 to 1, where 1 is rough / matte.
 * @returns string of the shader code
 */
function getRainbowShader(durationSeconds: number, saturation: number, value: number, metallic: number, roughness: number): string {
  return `
            shader_type spatial;

            vec3 hsv_to_rgb(vec3 c) {
              vec3 rgb = clamp(
              abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);

              return c.z * mix(vec3(1.0), rgb, c.y);
            }

            void fragment() {
                float hue = mod(TIME / `+ durationSeconds.toPrecision(2) + `, 1);

                ALBEDO = hsv_to_rgb(vec3(hue, `+ saturation.toString() + `, ` + value.toString() + `));
                METALLIC = `+ metallic.toPrecision(2) + `;
                ROUGHNESS = `+ roughness.toPrecision(2) + `;
            }
        `;
}

function getHeartShader() {
  return `
    shader_type spatial;

    uniform float displacement_strength: hint_range(0.0, 1.0) = 1.0;
    uniform vec3 starting_color = vec3(0.5, 0.0, 0.5);
    uniform vec3 ending_color = vec3(1.0, 0.0, 0.5);
    uniform float hue_variation: hint_range(0.0, 1.0) = 0.2;

    varying float colorshift;
    varying vec3 v_start;
    varying vec3 v_end;

    float hash(uint x) {
        x ^= x >> 16u; x *= 0x7feb352du;
        x ^= x >> 15u; x *= 0x846ca68bu;
        x ^= x >> 16u;
        return float(x) / 4294967295.0;
    }

    // Rotates hue around the gray axis. shift is in turns (1.0 = full color wheel).
    vec3 hue_shift(vec3 col, float shift) {
        const vec3 k = vec3(0.57735);
        float ang = shift * TAU;
        float ca = cos(ang);
        float sa = sin(ang);
        return clamp(col * ca + cross(k, col) * sa + k * dot(k, col) * (1.0 - ca), 0.0, 1.0);
    }

    void vertex() {
        float animation = sin(TIME * 2.0) * 0.15 + 0.75;
        colorshift = (animation - 0.6) / 0.3;

        float shift = (hash(uint(INSTANCE_ID)) - 0.5) * hue_variation;
        v_start = hue_shift(starting_color, shift);
        v_end = hue_shift(ending_color, shift);
        


        VERTEX.y += abs(1.0 * VERTEX.x) * displacement_strength * animation;
        VERTEX.z = 0.5 * VERTEX.z;
    }

    void fragment() {
        ALBEDO = mix(v_start, v_end, colorshift);
        METALLIC = 0.5;
        ROUGHNESS = 0.7;
    }
  `
}