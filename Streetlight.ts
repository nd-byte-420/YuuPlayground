import { Color } from "./Yuu API/Basic Types/Color";
import { Entity } from "./Yuu API/Entity";
import { SkyDome } from "./Yuu API/SkyDome";
import { Events } from "./Yuu API/Events";

/**
 * Stage 1 Streetlight Lamp & Volumetric Light Cone Controller
 * ==========================================================
 * Synchronizes the street lamp (`prop_static_55602`) and its volumetric light cone
 * (`func_illusionary_1288360_18189`, `func_illusionary_1288360_18208`) with the day/night cycle.
 *
 * Timeline Mapping (matching Blender & SkyDome 240-frame cycle):
 * - Night (0.95 -> 1.0 -> 0.40): Fully ON (lamp glows warm tungsten, light cone radiant)
 * - Dawn (0.40 -> 0.48): Smoothly fades OFF as sunrise completes
 * - Day (0.48 -> 0.88): Completely OFF (cone invisible, 0 emission)
 * - Dusk (0.88 -> 0.95): Smoothly fades ON as darkness arrives
 */

export interface StreetlightEntities {
  pole?: Entity;
  cone?: Entity;
  puddle?: Entity;
}

// Warm tungsten street lamp color (~3000K-3200K)
const LAMP_COLOR = new Color(1.0, 0.82, 0.58);

// Emission strengths
const POLE_EMISSION_MAX = 4.0;
const CONE_EMISSION_MAX = 0.85;
const PUDDLE_EMISSION_MAX = 0.60;

// Opacities
const CONE_OPACITY_MAX = 0.45;
const PUDDLE_OPACITY_MAX = 0.35;

let activeEntities: StreetlightEntities = {};
let updateListenerId: number | undefined;

/**
 * Calculates current lamp intensity (0.0 to 1.0) based on normalized cycle time [0, 1).
 */
export function calculateStreetlightIntensity(time: number): number {
  const t = ((time % 1.0) + 1.0) % 1.0;

  // Day: completely off
  if (t >= 0.48 && t <= 0.88) {
    return 0.0;
  }

  // Dawn fade out: 0.40 -> 0.48
  if (t > 0.40 && t < 0.48) {
    const frac = (t - 0.40) / (0.48 - 0.40);
    return 1.0 - frac;
  }

  // Dusk fade in: 0.88 -> 0.95
  if (t > 0.88 && t < 0.95) {
    const frac = (t - 0.88) / (0.95 - 0.88);
    return frac;
  }

  // Night: fully on (0.95 -> 1.0 / 0.0 -> 0.40)
  return 1.0;
}

/**
 * Registers streetlight entities and hooks them into the Day/Night cycle loop.
 */
export function registerStreetlight(entities: StreetlightEntities) {
  activeEntities = entities;

  // Configure initial material appearance
  if (activeEntities.pole?.mesh.nodeID) {
    activeEntities.pole.mesh.material.emissionColor.set(LAMP_COLOR);
    activeEntities.pole.mesh.material.roughness.set(0.2);
  }

  if (activeEntities.cone?.mesh.nodeID) {
    activeEntities.cone.mesh.material.emissionColor.set(LAMP_COLOR);
  }

  if (activeEntities.puddle?.mesh.nodeID) {
    activeEntities.puddle.mesh.material.emissionColor.set(LAMP_COLOR);
  }

  // Update immediately
  updateStreetlightGlow(SkyDome.customShader.getTimeOfDay());

  // Subscribe to engine update loop to stay perfectly synced with SkyDome
  if (updateListenerId === undefined) {
    updateListenerId = Events.onUpdate(() => {
      const timeOfDay = SkyDome.customShader.getTimeOfDay();
      updateStreetlightGlow(timeOfDay);
    });
  }
}

/**
 * Updates streetlight and light cone emission & transparency according to current time of day.
 */
export function updateStreetlightGlow(timeOfDay: number) {
  const intensity = calculateStreetlightIntensity(timeOfDay);

  // 1. Streetlight Pole lantern glass glow
  if (activeEntities.pole?.mesh.nodeID) {
    activeEntities.pole.mesh.material.emissionStrength.set(intensity * POLE_EMISSION_MAX);
  }

  // 2. Volumetric light cone mesh
  if (activeEntities.cone?.mesh.nodeID) {
    const coneOpacity = Math.max(0.001, intensity * CONE_OPACITY_MAX);
    activeEntities.cone.mesh.material.tintColor.set(Color.white, coneOpacity);
    activeEntities.cone.mesh.material.emissionStrength.set(intensity * CONE_EMISSION_MAX);
  }

  // 3. Ground puddle light disc
  if (activeEntities.puddle?.mesh.nodeID) {
    const puddleOpacity = Math.max(0.001, intensity * PUDDLE_OPACITY_MAX);
    activeEntities.puddle.mesh.material.tintColor.set(Color.white, puddleOpacity);
    activeEntities.puddle.mesh.material.emissionStrength.set(intensity * PUDDLE_EMISSION_MAX);
  }
}

/**
 * Cleans up update listener.
 */
export function destroyStreetlight() {
  if (updateListenerId !== undefined) {
    Events.unsubscribe(updateListenerId);
    updateListenerId = undefined;
  }
  activeEntities = {};
}

export const Streetlight = {
  register: registerStreetlight,
  update: updateStreetlightGlow,
  destroy: destroyStreetlight,
  calculateIntensity: calculateStreetlightIntensity,
};

