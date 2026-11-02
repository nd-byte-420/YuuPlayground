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
  getOarPaddleSplashProperties,
  getExplosionBurstProperties,

  // Spawners & triggers
  triggerExplosion,
  spawnRampFlowerStream,
  spawnHexFlowerShooters,
  spawnOarPaddleSplashes,
  startOarPaddleSplashLoop,
  spawnAllEmitters,

  // Positions from Blender export (converted to Godot Y-Up coords: X, Z, -Y)
  LOCATIONS: {
    rampFlowerStream: new Vector3(-0.9957, 58.4551, 108.4806),
    hexTowerLeft: new Vector3(-54.6857, 51.3651, 78.5806),
    hexTowerRight: new Vector3(52.7643, 51.3651, 78.5906),
    hexShooterProp55851: new Vector3(35.4043, 38.5351, -43.9194),
    hexShooterProp55854: new Vector3(-37.3957, 38.5351, -43.9194),
    oarPaddleSplashRight: new Vector3(13.0843, 35.7351, 16.9606),
    oarPaddleSplashLeft: new Vector3(-15.0757, 35.7351, 16.9606),
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
 * Parameters based on Blender emitter config:
 * - Amount: 600 total (Pink: ~250, Red: ~200, Leaf: ~150)
 * - Lifetime: 1.25s (30 frames @ 24fps)
 * - Lifetime Randomness: 0.0 (fixed 1.25s)
 * - Explosiveness: 0.0 (continuous stream)
 * - Emission Shape: Sphere (R ≈ 0.05m, point emission)
 * - Direction: Blender init_velocity (0.0, 8.75, 1.5) -> Godot (X, Z, -Y): (0.0, 1.5, -8.75).normalize()
 * - Initial Velocity: ~8.88 m/s (magnitude of [0, 8.75, 1.5])
 * - Spread: ~27.0 deg (random_velocity 4.5 spread)
 * - Gravity: Vector3(0.0, -9.8, 0.0) (Blender gravity 1.0 = standard 9.8 m/s^2)
 * - Scale: 0.51 - 0.77 (size: 0.64m, random: 0.2)
 */
function getRampFlowerStreamProperties(type: FlowerParticleType = 'pink', count?: number): Partial<ParticlesProperties> {
  const meshEntity = getCachedPlaneMesh(type);

  const defaultCount = type === 'pink' ? 250 : (type === 'red' ? 200 : 150);
  const amount = count ?? defaultCount;

  // Blender: (0.0, 8.75, 1.5) -> Godot (X, Z, -Y): (0.0, 1.5, -8.75)
  const dir = new Vector3(0.0, 1.5, -8.75).normalize();

  return {
    meshNodeID: meshEntity.mesh.nodeID ?? -1,

    isEmitting: true,
    isOneShot: false,
    randomness: 0.0,
    explosiveness: 0.0,

    amount,
    lifetimeInSeconds: 1.25,
    speedScale: 1.0,
    scaleMin: 0.51,
    scaleMax: 0.77,

    emissionShape: 'Sphere',
    emissionShapeProperties: {
      sphereRadius: 0.05,
    },

    direction: dir,
    spread: 27.0,
    initialVelocityMin: 7.5,
    initialVelocityMax: 10.5,

    gravity: new Vector3(0.0, -9.8, 0.0),

    initialRotationMin: Vector3.zero,
    initialRotationMax: new Vector3(360, 360, 360),
    rotationVelocityMin: new Vector3(-140, -140, -140),
    rotationVelocityMax: new Vector3(140, 140, 140),

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

  const defaultCount = type === 'pink' ? 200 : (type === 'red' ? 175 : 125);
  const amount = count ?? defaultCount;

  return {
    meshNodeID: meshEntity.mesh.nodeID ?? -1,

    isEmitting: true,
    isOneShot: false,
    randomness: 0.125,
    explosiveness: 0.0,

    amount,
    lifetimeInSeconds: 3.75,
    speedScale: 1.0,
    scaleMin: 0.51,
    scaleMax: 0.77,

    emissionShape: 'Sphere',
    emissionShapeProperties: {
      sphereRadius: 0.48,
    },

    direction: Vector3.up,
    spread: 7.0,
    initialVelocityMin: 20.0,
    initialVelocityMax: 22.5,

    gravity: new Vector3(0.0, -7.84, 0.0),

    initialRotationMin: Vector3.zero,
    initialRotationMax: new Vector3(360, 360, 360),
    rotationVelocityMin: new Vector3(-140, -140, -140),
    rotationVelocityMax: new Vector3(140, 140, 140),

    transformAlign: {
      type: 'Disabled',
    },
  };
}

/**
 * oarflowersplash (Oar Paddle Water Entry Splashes)
 * Bursts flower petals upward when the rotating oar paddle strikes the water.
 *
 * Parameters based on Blender emitter config:
 * - Amount: 42 per burst across children (Pink: 16, Red: 13, Leaf: 13)
 * - Lifetime: 3.0s (72 frames @ 24fps)
 * - Lifetime Randomness: 0.0 (fixed 3.0s)
 * - Explosiveness: 1.0 (burst mode fired on impact)
 * - Emission Shape: Sphere (R ≈ 1.28m, Blender scale 2.56)
 * - Direction: Blender init_velocity (0.0, 0.0, 14.0) -> Godot (X, Z, -Y): Vector3.up (0, 1, 0)
 * - Initial Velocity: ~14.0 m/s
 * - Spread: ~8.0 deg (random_velocity 2.0 vs init_velocity 14.0)
 * - Gravity: Vector3(0.0, -7.84, 0.0) (Blender gravity 0.8 * 9.8 m/s^2)
 * - Scale: 0.51 - 0.77 (size: 0.64m, random: 0.2)
 */
function getOarPaddleSplashProperties(
  type: FlowerParticleType = 'pink',
  count?: number,
  isOneShot: boolean = true
): Partial<ParticlesProperties> {
  const meshEntity = getCachedPlaneMesh(type);

  const defaultCount = type === 'pink' ? 16 : 13;
  const amount = count ?? defaultCount;

  return {
    meshNodeID: meshEntity.mesh.nodeID ?? -1,

    isEmitting: true,
    isOneShot,
    randomness: 0.0,
    explosiveness: 1.0,

    amount,
    lifetimeInSeconds: 3.0,
    speedScale: 1.0,
    scaleMin: 0.51,
    scaleMax: 0.77,

    emissionShape: 'Sphere',
    emissionShapeProperties: {
      sphereRadius: 1.28,
    },

    direction: Vector3.up,
    spread: 8.0,
    initialVelocityMin: 13.0,
    initialVelocityMax: 15.0,

    gravity: new Vector3(0.0, -7.84, 0.0),

    initialRotationMin: Vector3.zero,
    initialRotationMax: new Vector3(360, 360, 360),
    rotationVelocityMin: new Vector3(-140, -140, -140),
    rotationVelocityMax: new Vector3(140, 140, 140),

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
 * Spawns the hex tower flower shooter fountains at tower locations and props (left, right, prop55851, prop55854).
 */
function spawnHexFlowerShooters(): { left: Entity[]; right: Entity[]; prop55851: Entity[]; prop55854: Entity[] } {
  const leftEntities: Entity[] = [];
  const rightEntities: Entity[] = [];
  const prop55851Entities: Entity[] = [];
  const prop55854Entities: Entity[] = [];

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

  // Hex shooter at prop_static_55851
  for (const t of types) {
    try {
      const props = getHexFlowerShooterProperties(t);
      const emitter = new Entity(FlowerParticleEmitters.LOCATIONS.hexShooterProp55851, Quaternion.one, Vector3.one, undefined, 'Static');
      emitter.particles.setParticlesProperties(props);
      emitter.particles.play();
      prop55851Entities.push(emitter);
    } catch (err: any) {
      console.error(`spawnHexFlowerShooters: Error creating prop55851 emitter for '${t}':`, err?.message || err);
    }
  }

  // Hex shooter at prop_static_55854
  for (const t of types) {
    try {
      const props = getHexFlowerShooterProperties(t);
      const emitter = new Entity(FlowerParticleEmitters.LOCATIONS.hexShooterProp55854, Quaternion.one, Vector3.one, undefined, 'Static');
      emitter.particles.setParticlesProperties(props);
      emitter.particles.play();
      prop55854Entities.push(emitter);
    } catch (err: any) {
      console.error(`spawnHexFlowerShooters: Error creating prop55854 emitter for '${t}':`, err?.message || err);
    }
  }

  return { left: leftEntities, right: rightEntities, prop55851: prop55851Entities, prop55854: prop55854Entities };
}

/**
 * Spawns one-shot or continuous oar paddle flower splashes at left and right paddle water impact points.
 */
function spawnOarPaddleSplashes(isOneShot: boolean = false): { left: Entity[]; right: Entity[] } {
  const leftEntities: Entity[] = [];
  const rightEntities: Entity[] = [];

  const types: FlowerParticleType[] = ['pink', 'red', 'leaf'];

  // Left paddle splash
  for (const t of types) {
    try {
      const props = getOarPaddleSplashProperties(t, undefined, isOneShot);
      const emitter = new Entity(FlowerParticleEmitters.LOCATIONS.oarPaddleSplashLeft, Quaternion.one, Vector3.one, undefined, 'Static');
      emitter.particles.setParticlesProperties(props);
      emitter.particles.play();
      leftEntities.push(emitter);
    } catch (err: any) {
      console.error(`spawnOarPaddleSplashes: Error creating left splash emitter for '${t}':`, err?.message || err);
    }
  }

  // Right paddle splash
  for (const t of types) {
    try {
      const props = getOarPaddleSplashProperties(t, undefined, isOneShot);
      const emitter = new Entity(FlowerParticleEmitters.LOCATIONS.oarPaddleSplashRight, Quaternion.one, Vector3.one, undefined, 'Static');
      emitter.particles.setParticlesProperties(props);
      emitter.particles.play();
      rightEntities.push(emitter);
    } catch (err: any) {
      console.error(`spawnOarPaddleSplashes: Error creating right splash emitter for '${t}':`, err?.message || err);
    }
  }

  return { left: leftEntities, right: rightEntities };
}

/**
 * Starts timed burst cycles for oar paddle splashes matching the paddle rotation cycle.
 * Rotates every 69 frames (~2.875s at 24fps).
 */
function startOarPaddleSplashLoop(intervalSeconds: number = 2.875): () => void {
  // Trigger initial splash
  spawnOarPaddleSplashes(true);

  const timer = setInterval(() => {
    spawnOarPaddleSplashes(true);
  }, intervalSeconds * 1000);

  return () => clearInterval(timer);
}

/**
 * Spawns all flower particle emitters defined in particle-emitter-summary.md and Blender scene.
 */
function spawnAllEmitters(): {
  rampStream: Entity[];
  hexLeft: Entity[];
  hexRight: Entity[];
  hexProp55851: Entity[];
  hexProp55854: Entity[];
  oarSplashLeft: Entity[];
  oarSplashRight: Entity[];
} {
  const rampStream = spawnRampFlowerStream();
  const hex = spawnHexFlowerShooters();
  const oar = spawnOarPaddleSplashes();

  return {
    rampStream,
    hexLeft: hex.left,
    hexRight: hex.right,
    hexProp55851: hex.prop55851,
    hexProp55854: hex.prop55854,
    oarSplashLeft: oar.left,
    oarSplashRight: oar.right,
  };
}

