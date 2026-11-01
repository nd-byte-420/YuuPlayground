import { Color } from "./Basic Types/Color";
import { Vector3 } from "./Basic Types/Vector3";
import { Quaternion } from "./Basic Types/Quaternion";
import { Entity } from "./Entity/Entity";
import { spawnPrimitive } from "./SpawnPrimitive";
import { Player } from "./Player";
import { Async } from "./Async";

/**
 * Pure Godot 4 Sky Shader code (shader_type sky).
 * Used when applying directly to Godot's WorldEnvironment SkyMaterial.
 */
export const skyShaderCode = `
shader_type sky;

group_uniforms Textures;
uniform sampler2D starfield_tex : filter_linear, repeat_enable;
uniform sampler2D skygrad_tex : filter_linear, repeat_enable;
uniform sampler2D moon_tex : filter_linear, repeat_disable;
uniform sampler2D glow_tex : filter_linear, repeat_disable;
uniform sampler2D clouds_tex : filter_linear, repeat_enable;

group_uniforms CelestialOrb;
uniform vec3 sun_moon_dir = vec3(0.0, 0.4, -1.0); // Celestial forward direction
uniform float moon_size : hint_range(0.0, 0.5) = 0.08;
uniform float glow_size : hint_range(0.0, 1.0) = 0.22;
uniform float enable_celestial_orb : hint_range(0.0, 1.0) = 1.0;

group_uniforms TimeAndAtmosphere;
// 0.0 = Midnight, 0.5 = Dawn, 0.75 = Midday, 0.9 = Sunset
uniform float time_of_day : hint_range(0.0, 1.0) = 0.0;
uniform float starfield_intensity : hint_range(0.0, 3.0) = 1.0;
uniform float gradient_intensity : hint_range(0.0, 3.0) = 1.0;

const float PI = 3.14159265358979323846;

void sky() {
    vec3 dir = normalize(EYEDIR);
    float elev = abs(dir.y); // Symmetric across horizon

    // 1. Base Starfield (Equirectangular)
    vec2 star_uv = vec2(atan(dir.x, -dir.z) / (2.0 * PI) + 0.5, acos(clamp(dir.y, -1.0, 1.0)) / PI);
    vec3 star_color = texture(starfield_tex, star_uv).rgb * starfield_intensity;

    // 2. Atmosphere Gradient (mazskygrad.png)
    float grad_v = clamp(pow(elev, 1.6), 0.003, 0.995);
    vec3 grad_color = texture(skygrad_tex, vec2(time_of_day, grad_v)).rgb * gradient_intensity;

    // 3. 360-Degree Horizon Glow Band
    float horizon_falloff = pow(clamp(1.0 - (elev / 0.28), 0.0, 1.0), 2.0);
    vec3 horizon_tint = texture(skygrad_tex, vec2(time_of_day, 0.005)).rgb;
    vec3 horizon_glow = horizon_tint * horizon_falloff * 1.5;

    // 4. Moon & Sun Celestial Orb (Dot product perspective projection)
    vec3 celestial_color = vec3(0.0);
    vec3 orb_dir = normalize(sun_moon_dir);
    float cos_angle = dot(dir, orb_dir);

    if (enable_celestial_orb > 0.5 && cos_angle > 0.0) {
        // Construct tangent projection basis perpendicular to sun_moon_dir
        vec3 up_hint = abs(orb_dir.y) > 0.99 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);
        vec3 right = normalize(cross(up_hint, orb_dir));
        vec3 up = cross(orb_dir, right);
        vec3 diff = dir - orb_dir;

        // Day factor: 0.0 at night, 1.0 at day
        float day_factor = clamp((sin((time_of_day - 0.5) * 2.0 * PI) + 1.0) * 0.5, 0.0, 1.0);
        float night_factor = 1.0 - day_factor;

        // Dynamic Glow Tint: Cool Silver-White (Moon) -> Fiery Golden Sun
        vec3 moon_glow_tint = vec3(0.9, 0.95, 1.0);
        vec3 sun_glow_tint  = vec3(1.6, 0.85, 0.2);
        vec3 current_glow_tint = mix(moon_glow_tint, sun_glow_tint, day_factor);

        // Sample Glow Aura
        vec2 glow_uv = vec2(dot(diff, right), dot(diff, up)) / (2.0 * glow_size) + vec2(0.5);
        if (glow_uv.x >= 0.0 && glow_uv.x <= 1.0 && glow_uv.y >= 0.0 && glow_uv.y <= 1.0) {
            float glow_alpha = texture(glow_tex, glow_uv).a;
            celestial_color += current_glow_tint * glow_alpha * 1.2;
        }

        // Sample Moon Texture Disc
        if (night_factor > 0.01) {
            vec2 moon_uv = vec2(dot(diff, right), dot(diff, up)) / (2.0 * moon_size) + vec2(0.5);
            if (moon_uv.x >= 0.0 && moon_uv.x <= 1.0 && moon_uv.y >= 0.0 && moon_uv.y <= 1.0) {
                vec4 moon_sample = texture(moon_tex, moon_uv);
                celestial_color += moon_sample.rgb * moon_sample.a * night_factor;
            }
        }
    }

    // 5. Additive Combination ($additive 1)
    COLOR = star_color + grad_color + horizon_glow + celestial_color;
}
`;

/**
 * Spatial Shader (shader_type spatial) for an in-world SkyDome mesh entity.
 * Uses cull_disabled and unshaded so it renders both interior and exterior cleanly.
 * Computes world ray direction directly via INV_VIEW_MATRIX in fragment().
 * Includes both texture sampling and an automatic procedural fallback
 * for seamless operation without external LUT/star textures.
 */
export const spatialSkyShaderCode = `
shader_type spatial;
render_mode unshaded, cull_disabled;

group_uniforms Textures;
uniform sampler2D starfield_texture : filter_linear, repeat_enable;
uniform sampler2D gradient_lut : filter_linear, repeat_enable;
uniform sampler2D moon_texture : filter_linear, repeat_disable;
uniform sampler2D glow_texture : filter_linear, repeat_disable;

group_uniforms CelestialOrb;
// Direction towards the orb (facing forward and slightly elevated above horizon)
uniform vec3 orb_direction = vec3(0.0, 0.4, -1.0);
uniform float moon_size : hint_range(0.0, 0.5) = 0.08;
uniform float glow_size : hint_range(0.0, 1.0) = 0.22;
uniform float enable_celestial_orb : hint_range(0.0, 1.0) = 1.0;

group_uniforms TimeAndAtmosphere;
uniform float time_of_day : hint_range(0.0, 1.0) = 0.0;
uniform float starfield_intensity : hint_range(0.0, 3.0) = 1.0;
uniform float gradient_intensity : hint_range(0.0, 3.0) = 1.0;
uniform float use_procedural_fallback : hint_range(0.0, 1.0) = 1.0;
uniform float star_size : hint_range(0.02, 0.4) = 0.14;

// Procedural LUT Fallback: replicates Mazskygrad 2D Time-of-Day atmospheric gradient
vec3 sample_procedural_sky(float tod, float altitude) {
    vec3 midnight_zenith  = vec3(0.015, 0.02, 0.05);
    vec3 midnight_horizon = vec3(0.03, 0.04, 0.09);

    vec3 dawn_zenith      = vec3(0.12, 0.18, 0.38);
    vec3 dawn_horizon     = vec3(0.96, 0.48, 0.22);

    vec3 midday_zenith    = vec3(0.18, 0.44, 0.88);
    vec3 midday_horizon   = vec3(0.68, 0.84, 0.98);

    vec3 sunset_zenith    = vec3(0.16, 0.10, 0.34);
    vec3 sunset_horizon   = vec3(0.96, 0.32, 0.14);

    vec3 zenith_col;
    vec3 horizon_col;
    float t = fract(tod);

    if (t < 0.5) {
        float f = smoothstep(0.0, 0.5, t);
        zenith_col  = mix(midnight_zenith, dawn_zenith, f);
        horizon_col = mix(midnight_horizon, dawn_horizon, f);
    } else if (t < 0.75) {
        float f = smoothstep(0.5, 0.75, t);
        zenith_col  = mix(dawn_zenith, midday_zenith, f);
        horizon_col = mix(dawn_horizon, midday_horizon, f);
    } else if (t < 0.9) {
        float f = smoothstep(0.75, 0.9, t);
        zenith_col  = mix(midday_zenith, sunset_zenith, f);
        horizon_col = mix(midday_horizon, sunset_horizon, f);
    } else {
        float f = smoothstep(0.9, 1.0, t);
        zenith_col  = mix(sunset_zenith, midnight_zenith, f);
        horizon_col = mix(sunset_horizon, midnight_horizon, f);
    }

    float alt_factor = pow(altitude, 0.45);
    return mix(horizon_col, zenith_col, alt_factor);
}

// Procedural Starfield Generator
float star_hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 sample_procedural_stars(vec2 uv, float tod) {
    vec2 grid_uv = uv * 560.0;
    vec2 id = floor(grid_uv);
    vec2 gv = fract(grid_uv) - 0.5;

    float n = star_hash(id);
    float star = 0.0;
    if (n > 0.982) {
        float d = length(gv);
        float r = star_size * (0.7 + 0.6 * star_hash(id + 11.7));
        star = smoothstep(r, 0.01, d) * (n - 0.982) * 90.0;
    }

    // Stars automatically fade during daylight (between 0.38 and 0.96)
    float day_fade = 1.0 - smoothstep(0.38, 0.52, tod) * (1.0 - smoothstep(0.88, 0.96, tod));
    return vec3(star) * day_fade;
}

// Procedural Glow & Disc Fallback when textures are not bound
vec3 sample_procedural_orb(vec3 eye_dir, float tod) {
    vec3 norm_orb = normalize(orb_direction);
    vec3 emission = vec3(0.0);

    if (dot(eye_dir, norm_orb) > 0.0) {
        vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), norm_orb));
        vec3 up = cross(norm_orb, right);
        vec3 diff = eye_dir - norm_orb;

        float day_factor = clamp((sin((tod - 0.5) * 2.0 * PI) + 1.0) * 0.5, 0.0, 1.0);
        float night_factor = 1.0 - day_factor;

        vec3 moon_glow_tint = vec3(0.9, 0.95, 1.0);
        vec3 sun_glow_tint  = vec3(1.6, 0.85, 0.2);
        vec3 current_glow_tint = mix(moon_glow_tint, sun_glow_tint, day_factor);

        vec2 orb_coords = vec2(dot(diff, right), dot(diff, up));
        float dist = length(orb_coords);

        // Procedural radial glow aura
        float glow = exp(-dist / (glow_size * 0.45));
        emission += current_glow_tint * glow * 0.8;

        // Procedural moon disc
        if (night_factor > 0.01) {
            float disc = smoothstep(moon_size, moon_size * 0.92, dist);
            emission += vec3(0.95, 0.97, 1.0) * disc * night_factor;
        }
    }
    return emission;
}

void fragment() {
    // In view space, VERTEX is the direction from camera to surface point.
    // Multiplying with INV_VIEW_MATRIX calculates the world ray direction (identical to EYEDIR).
    vec3 eye_dir = normalize((INV_VIEW_MATRIX * vec4(VERTEX, 0.0)).xyz);

    // 1. Equirectangular UV Projection for Starfield
    vec2 star_uv;
    star_uv.x = atan(eye_dir.x, -eye_dir.z) / (2.0 * PI) + 0.5;
    star_uv.y = acos(clamp(eye_dir.y, -1.0, 1.0)) / PI;

    vec3 stars;
    if (use_procedural_fallback > 0.5) {
        stars = sample_procedural_stars(star_uv, time_of_day) * starfield_intensity;
    } else {
        stars = texture(starfield_texture, star_uv).rgb * starfield_intensity;
    }

    // 2. Time-of-Day Sampling
    float altitude = clamp(eye_dir.y, 0.0, 1.0);
    vec3 sky_gradient;
    if (use_procedural_fallback > 0.5) {
        sky_gradient = sample_procedural_sky(time_of_day, altitude) * gradient_intensity;
    } else {
        vec2 lut_uv = vec2(time_of_day, 1.0 - altitude);
        sky_gradient = texture(gradient_lut, lut_uv).rgb * gradient_intensity;
    }

    // 3. Sun & Moon Celestial Orb (Texture or Procedural Fallback)
    vec3 orb_emission = vec3(0.0);
    vec3 norm_orb = normalize(orb_direction);

    if (enable_celestial_orb > 0.5 && dot(eye_dir, norm_orb) > 0.0) {
        vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), norm_orb));
        vec3 up = cross(norm_orb, right);
        vec3 diff = eye_dir - norm_orb;

        float day_factor = clamp((sin((time_of_day - 0.5) * 2.0 * PI) + 1.0) * 0.5, 0.0, 1.0);
        float night_factor = 1.0 - day_factor;

        vec3 moon_glow_tint = vec3(0.9, 0.95, 1.0);
        vec3 sun_glow_tint  = vec3(1.6, 0.85, 0.2);
        vec3 current_glow_tint = mix(moon_glow_tint, sun_glow_tint, day_factor);

        if (use_procedural_fallback > 0.5) {
            orb_emission = sample_procedural_orb(eye_dir, time_of_day);
        } else {
            // Sample Glow Aura
            vec2 glow_uv = vec2(dot(diff, right), dot(diff, up)) / (2.0 * glow_size) + vec2(0.5);
            if (glow_uv.x >= 0.0 && glow_uv.x <= 1.0 && glow_uv.y >= 0.0 && glow_uv.y <= 1.0) {
                float glow_alpha = texture(glow_texture, glow_uv).a;
                orb_emission += current_glow_tint * glow_alpha;
            }

            // Sample Moon Disc
            if (night_factor > 0.01) {
                vec2 moon_uv = vec2(dot(diff, right), dot(diff, up)) / (2.0 * moon_size) + vec2(0.5);
                if (moon_uv.x >= 0.0 && moon_uv.x <= 1.0 && moon_uv.y >= 0.0 && moon_uv.y <= 1.0) {
                    vec4 moon_sample = texture(moon_texture, moon_uv);
                    orb_emission += moon_sample.rgb * moon_sample.a * night_factor;
                }
            }
        }
    }

    // 4. Additive Blending
    ALBEDO = stars + sky_gradient + orb_emission;
}
`;

export interface SkyDomeOptions {
  /**
   * Diameter of the dome sphere in meters (default: 80, keeping it inside camera far plane)
   */
  diameter?: number;
  /**
   * Starting time of day: 0.0 = Midnight, 0.5 = Dawn, 0.75 = Midday, 0.9 = Sunset (default: 0.0)
   */
  timeOfDay?: number;
  /**
   * Intensity multiplier for the starfield (default: 1.0)
   */
  starfieldIntensity?: number;
  /**
   * Intensity multiplier for the atmosphere gradient (default: 1.0)
   */
  gradientIntensity?: number;
  /**
   * Size radius of stars (default: 0.14 - increase for larger stars, decrease for smaller)
   */
  starSize?: number;
  /**
   * Moon disc size in UV space (default: 0.08)
   */
  moonSize?: number;
  /**
   * Glow aura size in UV space (default: 0.22)
   */
  glowSize?: number;
  /**
   * Render the celestial orb (sun/moon) directly in the background dome shader (default: true)
   */
  enableCelestialOrb?: boolean;
  /**
   * Use mathematical procedural LUT & starfield if external textures are not bound (default: true)
   */
  useProceduralFallback?: boolean;
  /**
   * Automatically follow player position so player never reaches the horizon (default: true)
   */
  followPlayer?: boolean;
  /**
   * Slowly rotate the starfield over time to simulate planetary rotation (default: true)
   */
  autoRotateStars?: boolean;
}

let activeSkyDomeEntity: Entity | undefined;
let updateListenerId: number | undefined;
let cycleTimerId: number | undefined;
let currentTimeOfDay: number = 0.0;

function spawnSkyDome(options: SkyDomeOptions = {}): Entity {
  SkyDome.customShader.destroy();

  const diameter = options.diameter ?? 80;
  currentTimeOfDay = options.timeOfDay ?? 0.0;
  const initialPos = Player.position.get() ?? Vector3.zero;

  console.log(`SkyDome: Spawning SkyDome entity (diameter: ${diameter}, pos: ${initialPos.x}, ${initialPos.y}, ${initialPos.z})`);

  activeSkyDomeEntity = spawnPrimitive.sphere(
    32,
    24,
    initialPos,
    diameter,
    Quaternion.one,
    Color.white,
    1,
    'None',
    'Empty',
    undefined
  );

  const meshNodeID = activeSkyDomeEntity.mesh.nodeID;
  if (meshNodeID) {
    const success = activeSkyDomeEntity.mesh.shader.set(spatialSkyShaderCode);
    console.log(`SkyDome: Shader applied to meshNodeID ${meshNodeID}, success: ${success}`);

    activeSkyDomeEntity.mesh.shader.updateNumber("time_of_day", currentTimeOfDay);
    activeSkyDomeEntity.mesh.shader.updateNumber("starfield_intensity", options.starfieldIntensity ?? 1.0);
    activeSkyDomeEntity.mesh.shader.updateNumber("gradient_intensity", options.gradientIntensity ?? 1.0);
    activeSkyDomeEntity.mesh.shader.updateNumber("star_size", options.starSize ?? 0.14);
    activeSkyDomeEntity.mesh.shader.updateNumber("moon_size", options.moonSize ?? 0.08);
    activeSkyDomeEntity.mesh.shader.updateNumber("glow_size", options.glowSize ?? 0.22);
    activeSkyDomeEntity.mesh.shader.updateNumber(
      "enable_celestial_orb",
      (options.enableCelestialOrb ?? true) ? 1.0 : 0.0
    );
    activeSkyDomeEntity.mesh.shader.updateNumber(
      "use_procedural_fallback",
      (options.useProceduralFallback ?? true) ? 1.0 : 0.0
    );
  } else {
    console.error("SkyDome: Failed to retrieve meshNodeID for SkyDome entity!");
  }

  const followPlayer = options.followPlayer ?? true;
  const autoRotate = options.autoRotateStars ?? true;

  if (followPlayer || autoRotate) {
    updateListenerId = Godot.events.onUpdate((delta) => {
      if (!activeSkyDomeEntity) return;

      if (followPlayer) {
        const playerPos = Player.position.get();
        if (playerPos) {
          activeSkyDomeEntity.pos = playerPos;
        }
      }

      if (autoRotate) {
        activeSkyDomeEntity.rot = activeSkyDomeEntity.rot.multiply(
          Quaternion.fromEuler(new Vector3(0, delta * 0.005, 0))
        );
      }
    });
  }

  return activeSkyDomeEntity;
}

function setTimeOfDay(time: number) {
  currentTimeOfDay = ((time % 1.0) + 1.0) % 1.0;
  if (activeSkyDomeEntity?.mesh.nodeID) {
    activeSkyDomeEntity.mesh.shader.updateNumber("time_of_day", currentTimeOfDay);
  }
}

function getTimeOfDay(): number {
  return currentTimeOfDay;
}

function setStarfieldIntensity(val: number) {
  if (activeSkyDomeEntity?.mesh.nodeID) {
    activeSkyDomeEntity.mesh.shader.updateNumber("starfield_intensity", val);
  }
}

function setGradientIntensity(val: number) {
  if (activeSkyDomeEntity?.mesh.nodeID) {
    activeSkyDomeEntity.mesh.shader.updateNumber("gradient_intensity", val);
  }
}

function setStarSize(size: number) {
  if (activeSkyDomeEntity?.mesh.nodeID) {
    activeSkyDomeEntity.mesh.shader.updateNumber("star_size", size);
  }
}

function setMoonSize(size: number) {
  if (activeSkyDomeEntity?.mesh.nodeID) {
    activeSkyDomeEntity.mesh.shader.updateNumber("moon_size", size);
  }
}

function setGlowSize(size: number) {
  if (activeSkyDomeEntity?.mesh.nodeID) {
    activeSkyDomeEntity.mesh.shader.updateNumber("glow_size", size);
  }
}

function setEnableCelestialOrb(enable: boolean) {
  if (activeSkyDomeEntity?.mesh.nodeID) {
    activeSkyDomeEntity.mesh.shader.updateNumber("enable_celestial_orb", enable ? 1.0 : 0.0);
  }
}

function setUseProceduralFallback(useFallback: boolean) {
  if (activeSkyDomeEntity?.mesh.nodeID) {
    activeSkyDomeEntity.mesh.shader.updateNumber("use_procedural_fallback", useFallback ? 1.0 : 0.0);
  }
}

function startDayNightCycle(cycleDurationSeconds: number = 120) {
  SkyDome.customShader.stopDayNightCycle();
  const intervalMs = 50;
  const step = intervalMs / (cycleDurationSeconds * 1000);

  cycleTimerId = Async.setInterval(() => {
    SkyDome.customShader.setTimeOfDay(currentTimeOfDay + step);
  }, intervalMs);
}

function stopDayNightCycle() {
  if (cycleTimerId !== undefined) {
    Async.clearTimer(cycleTimerId);
    cycleTimerId = undefined;
  }
}

function getEntity(): Entity | undefined {
  return activeSkyDomeEntity;
}

function destroy() {
  SkyDome.customShader.stopDayNightCycle();

  if (updateListenerId !== undefined) {
    Godot.events.unsubscribe(updateListenerId);
    updateListenerId = undefined;
  }

  if (activeSkyDomeEntity) {
    activeSkyDomeEntity.destroy();
    activeSkyDomeEntity = undefined;
  }
}

export const SkyDome = {
  ambientLight: {
    /**
     * Color of the ambient light in the world.
     */
    baseColor: {
      set: (color: Color): boolean => { return Godot.skyDome.ambientLight.baseColor.set(color.r, color.g, color.b); },
      get: (): Color | undefined => { const color = Godot.skyDome.ambientLight.baseColor.get(); if (color) { return new Color(color.r, color.g, color.b); } else { return color; } },
    },
    /**
     * Increase or decrease the brightness of the scene. Defaults to 1.
     */
    energy: {
      set: (value: number): boolean => { return Godot.skyDome.ambientLight.energy.set(value); },
      get: (): number | undefined => { return Godot.skyDome.ambientLight.energy.get(); },
    },
    /**
     * Allows the sky color to cast colored light on the scene (from above and below).
     * Values range from 0 (no contribution) to 1 (max contribution). Defaults to 0.
     */
    skyColorContribution: {
      set: (value: number): boolean => { return Godot.skyDome.ambientLight.skyColorContribution.set(value); },
      get: (): number | undefined => { return Godot.skyDome.ambientLight.skyColorContribution.get(); },
    },
    setToDefaults: setAmbientLightToDefaults,
  },

  skyMaterial: {
    setProceduralSkyMaterial,
    setToDefaults: setProceduralSkyMaterialToDefaults,
    /**
     * Attempts to apply a native Godot Sky shader (shader_type sky) if supported by the engine bridge.
     */
    setShader: (shaderCode: string): boolean => {
      const bridge = (Godot.skyDome.skyMaterial as any);
      if (typeof bridge?.setShader === 'function') {
        return bridge.setShader(shaderCode);
      }
      return false;
    },
  },

  skyShaderCode,
  spatialSkyShaderCode,

  /**
   * In-World Custom SkyDome Mesh Manager (works directly with existing Yuu Online APIs)
   */
  customShader: {
    spawnSkyDome,
    setTimeOfDay,
    getTimeOfDay,
    setStarfieldIntensity,
    setGradientIntensity,
    setStarSize,
    setMoonSize,
    setGlowSize,
    setEnableCelestialOrb,
    setUseProceduralFallback,
    startDayNightCycle,
    stopDayNightCycle,
    getEntity,
    destroy,
  },
};

function setAmbientLightToDefaults() {
  SkyDome.ambientLight.baseColor.set(Color.white);
  SkyDome.ambientLight.energy.set(1);
  SkyDome.ambientLight.skyColorContribution.set(0);
}

/**
 * Updates the Procedural Sky Material, or creates one if it doesn't already exist. Undefined values are skipped.
 * @param topColor Sky Color
 * @param topHorizonColor Best to match bottomHorizonColor
 * @param topCurve How sharply the top and horizon colors fade together
 * @param bottomColor Ground Color
 * @param bottomHorizonColor Best to match topHorizonColor
 * @param bottomCurve How sharply the bottom and horizon colors fade together
 * @returns boolean true if successful
 */
function setProceduralSkyMaterial(
  topColor: Color | undefined,
  topHorizonColor: Color | undefined,
  topCurve: number | undefined,
  bottomColor: Color | undefined,
  bottomHorizonColor: Color | undefined,
  bottomCurve: number | undefined,
): boolean {
  return Godot.skyDome.skyMaterial.setProceduralSkyMaterial(
    topColor ? { r: topColor.r, g: topColor.g, b: topColor.b } : undefined,
    topHorizonColor ? { r: topHorizonColor.r, g: topHorizonColor.g, b: topHorizonColor.b } : undefined,
    topCurve,
    bottomColor ? { r: bottomColor.r, g: bottomColor.g, b: bottomColor.b } : undefined,
    bottomHorizonColor ? { r: bottomHorizonColor.r, g: bottomHorizonColor.g, b: bottomHorizonColor.b } : undefined,
    bottomCurve,
  );
}

function setProceduralSkyMaterialToDefaults() {
  setProceduralSkyMaterial(new Color(0.07, 0.48, 0.99), new Color(0.73, 0.89, 0.94), 0.15, new Color(0.2, 0.42, 0.14), new Color(0.73, 0.89, 0.94), 0.0199);
}
