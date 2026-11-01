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

  // Spawners at exact coordinates
  spawnRampFlowerStream,
  spawnHexFlowerShooters,
  spawnAllEmitters,

  // Positions from particle-emitter-summary.md (Godot Y-Up coords)
  LOCATIONS: {
    rampFlowerStream: new Vector3(0.0, 135.20, 120.32),
    hexTowerLeft: new Vector3(-53.69, 128.11, 90.42),
    hexTowerRight: new Vector3(53.76, 128.11, 90.43),
  },
};

/**
 * Creates a two-sided invisible plane entity with particle texture applied.
 */
function createParticlePlaneMesh(type: FlowerParticleType, color: Color = Color.white): Entity {
  const plane = spawnPrimitive.plane('Both', Vector3.zero, Vector3.one, Quaternion.one, color, 1, 'None', 'Empty', undefined);
  plane.visible.set(false);

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
}

/**
 * rampflowerstream (The Ramp Petal River)
 * Continuous river of flower petals and leaves cascading down the Stage 1 start ramp.
 *
 * Parameters based on particle-emitter-summary.md:
 * - Amount: ~200-400 total (Pink: ~150, Red: ~100, Leaf: ~80)
 * - Lifetime: 4.0s
 * - Emission Shape: Box (extents: Vector3(2.5, 0.5, 2.5))
 * - Direction: Vector3(0.0, -0.25, -1.0).normalized()
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
  const dir = new Vector3(0.0, -0.25, -1.0).normalized();

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
      type: 'Billboard',
    },
  };
}

/**
 * hexflowershooter (Hex Pillar Cannons)
 * Upward fountains bursting petals into the air atop the two hex towers beside the ramp.
 *
 * Parameters based on particle-emitter-summary.md:
 * - Amount: ~150-250 (Pink: ~100, Red: ~60, Leaf: ~40)
 * - Lifetime: 3.5s
 * - Emission Shape: Ring (radius: 1.2m)
 * - Direction: Vector3(0.0, 1.0, 0.0)
 * - Spread: 25.0 deg
 * - Initial Velocity: 18.0 - 24.0 m/s
 * - Gravity: Vector3(0.0, -9.8, 0.0)
 * - Rotation / Tumbling: -180 to 180 deg/s
 * - Scale: 0.8 - 1.3
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
    explosiveness: 0.0,

    amount,
    lifetimeInSeconds: 3.5,
    speedScale: 1.0,
    scaleMin: 0.8,
    scaleMax: 1.3,

    emissionShape: 'Ring',
    emissionShapeProperties: {
      ring: {
        radius: 1.2,
        innerRadius: 0.0,
        height: 0.2,
        axis: Vector3.up,
      },
    },

    direction: Vector3.up,
    spread: 25.0,
    initialVelocityMin: 18.0,
    initialVelocityMax: 24.0,

    gravity: new Vector3(0.0, -9.8, 0.0),

    initialRotationMin: Vector3.zero,
    initialRotationMax: new Vector3(360, 360, 360),
    rotationVelocityMin: new Vector3(-180, -180, -180),
    rotationVelocityMax: new Vector3(180, 180, 180),

    transformAlign: {
      type: 'Billboard',
    },
  };
}

/**
 * Spawns the composite ramp petal stream at a specific location.
 * Creates child emitters for pink petals, red petals, and leaves.
 */
function spawnRampFlowerStream(pos: Vector3 = FlowerParticleEmitters.LOCATIONS.rampFlowerStream): Entity[] {
  const entities: Entity[] = [];

  const types: FlowerParticleType[] = ['pink', 'red', 'leaf'];
  for (const t of types) {
    const props = getRampFlowerStreamProperties(t);
    const emitter = new Entity(pos, Quaternion.one, Vector3.one, undefined, 'Static');
    emitter.particles.setParticlesProperties(props);
    emitter.particles.play();
    entities.push(emitter);
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
    const props = getHexFlowerShooterProperties(t);
    const emitter = new Entity(FlowerParticleEmitters.LOCATIONS.hexTowerLeft, Quaternion.one, Vector3.one, undefined, 'Static');
    emitter.particles.setParticlesProperties(props);
    emitter.particles.play();
    leftEntities.push(emitter);
  }

  // Right hex tower
  for (const t of types) {
    const props = getHexFlowerShooterProperties(t);
    const emitter = new Entity(FlowerParticleEmitters.LOCATIONS.hexTowerRight, Quaternion.one, Vector3.one, undefined, 'Static');
    emitter.particles.setParticlesProperties(props);
    emitter.particles.play();
    rightEntities.push(emitter);
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

