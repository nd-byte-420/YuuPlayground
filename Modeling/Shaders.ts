export const Shaders = {
  Pulse: `
shader_type spatial;
render_mode unshaded;

void fragment() {
    float pulse = (sin(TIME * 5.0) + 1.0) * 0.5;
    ALBEDO = vec3(pulse, 0.0, 1.0 - pulse);
}
`,

  Hologram: `
shader_type spatial;
render_mode unshaded, blend_add, cull_disabled;

void fragment() {
    float scanline = sin(UV.y * 50.0 - TIME * 5.0);
    scanline = smoothstep(0.8, 1.0, scanline);
    ALBEDO = vec3(0.1, 0.8, 1.0);
    ALPHA = clamp(scanline + 0.1, 0.0, 1.0);
}
`,

  Wobble: `
shader_type spatial;

void vertex() {
    VERTEX.x += sin(TIME * 3.0 + VERTEX.y * 5.0) * 0.1;
    VERTEX.z += cos(TIME * 3.0 + VERTEX.y * 5.0) * 0.1;
}

void fragment() {
    ALBEDO = vec3(0.8, 0.2, 0.2);
}
`
};
