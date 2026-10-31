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

uniform sampler2D starfield_texture : filter_linear, repeat_enable;
uniform sampler2D gradient_lut : filter_linear, repeat_enable;

uniform float time_of_day : hint_range(0.0, 1.0) = 0.0;
uniform float starfield_intensity : hint_range(0.0, 3.0) = 1.0;
uniform float gradient_intensity : hint_range(0.0, 3.0) = 1.0;

const float PI = 3.14159265358979323846;

void sky() {
    // 1. Equirectangular UV Projection for Starfield
    vec2 star_uv;
    star_uv.x = atan(EYEDIR.x, -EYEDIR.z) / (2.0 * PI) + 0.5;
    star_uv.y = acos(clamp(EYEDIR.y, -1.0, 1.0)) / PI;
    vec3 stars = texture(starfield_texture, star_uv).rgb * starfield_intensity;

    // 2. Time-of-Day LUT Sampling
    float altitude = clamp(EYEDIR.y, 0.0, 1.0);
    vec2 lut_uv = vec2(time_of_day, 1.0 - altitude);
    vec3 sky_gradient = texture(gradient_lut, lut_uv).rgb * gradient_intensity;

    // 3. Additive Blending
    COLOR = stars + sky_gradient;
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

uniform sampler2D starfield_texture : filter_linear, repeat_enable;
uniform sampler2D gradient_lut : filter_linear, repeat_enable;

uniform float time_of_day : hint_range(0.0, 1.0) = 0.0;
uniform float starfield_intensity : hint_range(0.0, 3.0) = 1.0;
uniform float gradient_intensity : hint_range(0.0, 3.0) = 1.0;
uniform float use_procedural_fallback : hint_range(0.0, 1.0) = 1.0;

const float PI = 3.14159265358979323846;

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
    vec2 grid_uv = uv * 320.0;
    vec2 id = floor(grid_uv);
    vec2 gv = fract(grid_uv) - 0.5;

    float n = star_hash(id);
    float star = 0.0;
    if (n > 0.986) {
        float d = length(gv);
        star = smoothstep(0.25, 0.01, d) * (n - 0.986) * 75.0;
    }

    // Stars automatically fade during daylight (between 0.38 and 0.96)
    float day_fade = 1.0 - smoothstep(0.38, 0.52, tod) * (1.0 - smoothstep(0.88, 0.96, tod));
    return vec3(star) * day_fade;
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

    // 3. Additive Blending
    ALBEDO = stars + sky_gradient;
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
