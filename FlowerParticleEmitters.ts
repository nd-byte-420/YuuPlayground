import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Entity } from "./Yuu API/Entity";
import { ParticlesProperties } from "./Yuu API/Particles/Particles";
import { PlayParticles } from "./Yuu API/Particles/PlayParticles";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { applyTextureToEntity } from "./Textures/loader";

export type FlowerParticleType = 'pink' | 'red' | 'leaf';

export interface FlowerEmitterConfig {
  type: FlowerParticleType;
  color?: Color;
  countScale?: number;
}

export const FlowerParticleEmitters = {
  // Spawn primitives used as particle meshes
  createParticlePlaneMesh,

  // Particle property getters
  getRampFlowerStreamProperties,
  getHexFlowerShooterProperties,
  getExplosionBurstProperties,

  // Spawners & triggers
  triggerExplosion,
  spawnRampFlowerStream,
  spawnHexFlowerShooters,
  spawnAllEmitters,

  // Positions from Blender export (converted to Godot Y-Up coords: X, Z, -Y)
  LOCATIONS: {
    rampFlowerStream: new Vector3(0.0000, 25.2000, 120.3200),
    hexTowerLeft: new Vector3(-53.6900, 18.1100, 90.4200),
    hexTowerRight: new Vector3(53.7600, 18.1100, 90.4300),
  },
};

/**
 * Creates a two-sided invisible plane entity with particle texture applied.
 */
function createParticlePlaneMesh(type: FlowerParticleType, color: Color = Color.white): Entity {
  // Alpha < 1.0 (e.g. 0.99) switches the Godot StandardMaterial3D to alpha transparency mode
  const plane = spawnPrimitive.plane('Both', Vector3.zero, Vector3.one, Quaternion.one, color, 0.99, 'None', 'Empty', undefined);
  plane.visible.set(false);

  // Set mesh color with alpha < 1 to ensure transparent material pipeline is active
  plane.mesh.color.set(color, 0.99);

  const textureName = type === 'pink'
    ? 'pinkflowerparticle'
    : type === 'red'
      ? 'redflowerparticle'
      : 'leafparticle';

  applyTextureToEntity(plane, textureName);
  return plane;
}

// Cached particle plane meshes for reuse
let cachedPinkPlane: Entity | undefined;
let cachedRedPlane: Entity | undefined;
let cachedLeafPlane: Entity | undefined;

function getCachedPlaneMesh(type: FlowerParticleType): Entity {
  try {
    if (type === 'pink') {
      if (!cachedPinkPlane) cachedPinkPlane = createParticlePlaneMesh('pink');
      return cachedPinkPlane;
    }
    if (type === 'red') {
      if (!cachedRedPlane) cachedRedPlane = createParticlePlaneMesh('red');
      return cachedRedPlane;
    }
    if (!cachedLeafPlane) cachedLeafPlane = createParticlePlaneMesh('leaf');
    return cachedLeafPlane;
  } catch (err: any) {
    console.error(`Failed to create particle plane mesh for '${type}':`, err?.message || err);
    // Fall back to pink or plain plane mesh so emitter doesn't crash
    if (cachedPinkPlane) return cachedPinkPlane;
    return createParticlePlaneMesh('pink');
  }
}

/**
 * rampflowerstream (The Ramp Petal River)
 * Continuous river of flower petals and leaves cascading down the Stage 1 start ramp.
 *
 * Parameters based on particle-emitter-summary.md:
 * - Amount: ~200-400 total (Pink: ~150, Red: ~100, Leaf: ~80)
 * - Lifetime: 4.0s
 * - Emission Shape: Box (extents: Vector3(2.5, 0.5, 2.5))
 * - Direction: Vector3(0.0, -0.25, -1.0).normalize()
 * - Spread: 15.0 deg
 * - Initial Velocity: 12.0 - 16.0 m/s
 * - Gravity: Vector3(0.0, -2.5, 0.0)
 * - Rotation / Tumbling: -120 to 120 deg/s
 * - Scale: 0.7 - 1.2
 */
function getRampFlowerStreamProperties(type: FlowerParticleType = 'pink', count?: number): Partial<ParticlesProperties> {
  const meshEntity = getCachedPlaneMesh(type);

  const defaultCount = type === 'pink' ? 150 : (type === 'red' ? 100 : 80);
  const amount = count ?? defaultCount;

  // Normalized direction down the ramp slope
  const dir = new Vector3(0.0, -0.25, -1.0).normalize();

  return {
    meshNodeID: meshEntity.mesh.nodeID ?? -1,

    isEmitting: true,
    isOneShot: false,
    randomness: 0.8,
    explosiveness: 0.0,

    amount,
    lifetimeInSeconds: 4.0,
    speedScale: 1.0,
    scaleMin: 0.7,
    scaleMax: 1.2,

    emissionShape: 'Box',
    emissionShapeProperties: {
      boxExtents: new Vector3(2.5, 0.5, 2.5),
    },

    direction: dir,
    spread: 15.0,
    initialVelocityMin: 12.0,
    initialVelocityMax: 16.0,

    gravity: new Vector3(0.0, -2.5, 0.0),

    initialRotationMin: Vector3.zero,
    initialRotationMax: new Vector3(360, 360, 360),
    rotationVelocityMin: new Vector3(-120, -120, -120),
    rotationVelocityMax: new Vector3(120, 120, 120),

    transformAlign: {
      type: 'Disabled',
    },
  };
}

/**
 * hexflowershooter (Hex Pillar Cannons)
 * Upward fountains bursting petals into the air atop the two hex towers beside the ramp.
 *
 * Parameters based on burst sequence physics:
 * - Amount: ~120-150 (Pink: ~100, Red: ~60, Leaf: ~40)
 * - Lifetime: 3.5s
 * - Explosiveness: 1.0 (burst mode: all particles emit simultaneously in frame 0)
 * - Emission Shape: Sphere (R ≈ 0.3m)
 * - Direction: Vector3.up (conical spread 30°)
 * - Spread: 30.0 deg
 * - Initial Velocity: 18.0 - 24.0 m/s
 * - Gravity: Vector3(0.0, -3.0, 0.0) (buoyant drift descent)
 * - Rotation / Tumbling: -220 to 220 deg/s
 * - Scale: 0.6 - 1.2
 */
function getHexFlowerShooterProperties(type: FlowerParticleType = 'pink', count?: number): Partial<ParticlesProperties> {
  const meshEntity = getCachedPlaneMesh(type);

  const defaultCount = type === 'pink' ? 100 : (type === 'red' ? 60 : 40);
  const amount = count ?? defaultCount;

  return {
    meshNodeID: meshEntity.mesh.nodeID ?? -1,

    isEmitting: true,
    isOneShot: false,
    randomness: 0.9,
    explosiveness: 1.0,

    amount,
    lifetimeInSeconds: 3.5,
    speedScale: 1.0,
    scaleMin: 0.6,
    scaleMax: 1.2,

    emissionShape: 'Sphere',
    emissionShapeProperties: {
      sphereRadius: 0.3,
    },

    direction: Vector3.up,
    spread: 30.0,
    initialVelocityMin: 18.0,
    initialVelocityMax: 24.0,

    // Buoyant gravity: low mass & high air drag petals drift gently down
    gravity: new Vector3(0.0, -3.0, 0.0),

    initialRotationMin: Vector3.zero,
    initialRotationMax: new Vector3(360, 360, 360),
    rotationVelocityMin: new Vector3(-220, -220, -220),
    rotationVelocityMax: new Vector3(220, 220, 220),

    transformAlign: {
      type: 'Disabled',
    },
  };
}

/**
 * Explosion Burst Properties (Spherical Apple Burst or Upward Hex Fountain Burst)
 * Follows 3-phase physics: violent burst (explosiveness 1.0) -> apex stall -> buoyant drift (-3.0 m/s^2).
 */
function getExplosionBurstProperties(
  type: FlowerParticleType = 'pink',
  isFountain: boolean = false,
  count: number = 120
): Partial<ParticlesProperties> {
  const meshEntity = getCachedPlaneMesh(type);

  return {
    meshNodeID: meshEntity.mesh.nodeID ?? -1,

    isEmitting: true,
    isOneShot: true,
    randomness: 1.0,
    explosiveness: 1.0,

    amount: count,
    lifetimeInSeconds: 3.5,
    speedScale: 1.0,
    scaleMin: 0.6,
    scaleMax: 1.2,

    emissionShape: 'Sphere',
    emissionShapeProperties: {
      sphereRadius: 0.3,
    },

    direction: isFountain ? Vector3.up : Vector3.zero,
    spread: isFountain ? 30.0 : 180.0,
    initialVelocityMin: isFountain ? 18.0 : 14.0,
    initialVelocityMax: isFountain ? 24.0 : 22.0,

    // Buoyant gravity (gentle petal drift)
    gravity: new Vector3(0.0, -3.0, 0.0),

    // Multi-axis spin & tumbling
    initialRotationMin: Vector3.zero,
    initialRotationMax: new Vector3(360, 360, 360),
    rotationVelocityMin: new Vector3(-220, -220, -220),
    rotationVelocityMax: new Vector3(220, 220, 220),

    transformAlign: {
      type: 'Disabled',
    },
  };
}

/**
 * Triggers a one-shot particle explosion burst at spawnPos and automatically cleans up.
 * @param spawnPos Center of the explosion
 * @param isFountain If true, emits upward conical fountain burst; if false, 360-degree spherical burst.
 * @param types The particle types to include (defaults to all: pink, red, leaf)
 */
function triggerExplosion(
  spawnPos: Vector3,
  isFountain: boolean = false,
  types: FlowerParticleType[] = ['pink', 'red', 'leaf']
): Entity[] {
  const emitters: Entity[] = [];

  for (const t of types) {
    try {
      const count = t === 'pink' ? 60 : (t === 'red' ? 35 : 25);
      const props = getExplosionBurstProperties(t, isFountain, count);
      const emitter = new Entity(spawnPos, Quaternion.one, Vector3.one, undefined, 'Static');
      emitter.particles.setParticlesProperties(props);
      emitter.particles.play();
      emitters.push(emitter);

      // Auto-free when finished (lifetime 3.5s + 0.5s padding)
      const lifetimeMs = ((props.lifetimeInSeconds ?? 3.5) + 0.5) * 1000;
      setTimeout(() => {
        emitter.destroy();
      }, lifetimeMs);
    } catch (err: any) {
      console.error(`triggerExplosion: Error creating emitter for '${t}':`, err?.message || err);
    }
  }

  return emitters;
}

/**
 * Spawns the composite ramp petal stream at a specific location.
 * Creates child emitters for pink petals, red petals, and leaves.
 */
function spawnRampFlowerStream(pos: Vector3 = FlowerParticleEmitters.LOCATIONS.rampFlowerStream): Entity[] {
  const entities: Entity[] = [];

  const types: FlowerParticleType[] = ['pink', 'red', 'leaf'];
  for (const t of types) {
    try {
      const props = getRampFlowerStreamProperties(t);
      const emitter = new Entity(pos, Quaternion.one, Vector3.one, undefined, 'Static');
      emitter.particles.setParticlesProperties(props);
      emitter.particles.play();
      entities.push(emitter);
    } catch (err: any) {
      console.error(`spawnRampFlowerStream: Error creating emitter for '${t}':`, err?.message || err);
    }
  }

  return entities;
}

/**
 * Spawns the hex tower flower shooter fountains at both tower locations (left & right).
 */
function spawnHexFlowerShooters(): { left: Entity[]; right: Entity[] } {
  const leftEntities: Entity[] = [];
  const rightEntities: Entity[] = [];

  const types: FlowerParticleType[] = ['pink', 'red', 'leaf'];

  // Left hex tower
  for (const t of types) {
    try {
      const props = getHexFlowerShooterProperties(t);
      const emitter = new Entity(FlowerParticleEmitters.LOCATIONS.hexTowerLeft, Quaternion.one, Vector3.one, undefined, 'Static');
      emitter.particles.setParticlesProperties(props);
      emitter.particles.play();
      leftEntities.push(emitter);
    } catch (err: any) {
      console.error(`spawnHexFlowerShooters: Error creating left emitter for '${t}':`, err?.message || err);
    }
  }

  // Right hex tower
  for (const t of types) {
    try {
      const props = getHexFlowerShooterProperties(t);
      const emitter = new Entity(FlowerParticleEmitters.LOCATIONS.hexTowerRight, Quaternion.one, Vector3.one, undefined, 'Static');
      emitter.particles.setParticlesProperties(props);
      emitter.particles.play();
      rightEntities.push(emitter);
    } catch (err: any) {
      console.error(`spawnHexFlowerShooters: Error creating right emitter for '${t}':`, err?.message || err);
    }
  }

  return { left: leftEntities, right: rightEntities };
}

/**
 * Spawns all flower particle emitters defined in particle-emitter-summary.md.
 */
function spawnAllEmitters(): { rampStream: Entity[]; hexLeft: Entity[]; hexRight: Entity[] } {
  const rampStream = spawnRampFlowerStream();
  const hex = spawnHexFlowerShooters();

  return {
    rampStream,
    hexLeft: hex.left,
    hexRight: hex.right,
  };
}

