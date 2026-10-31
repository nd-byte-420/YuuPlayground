import { Color } from "../Basic Types/Color"
import { Quaternion } from "../Basic Types/Quaternion";
import { Vector3 } from "../Basic Types/Vector3";
import { entityData } from "../Entity/Entity_Data";
import { registerStart } from "../RegisterStart";
import { DefaultShaders } from "../Shader/DefaultShaders"
import { spawnPrimitive } from "../SpawnPrimitive";
import { ParticlesProperties } from "./Particles";


export const DefaultParticles = {
  getColoredWaterFountainParticlesProperties,
  getRainbowCubeParticlesProperties,
  getHeartParticlesProperties,
  getSmokeParticlesProperties,
  getExplosionParticlesProperties,
  getMagicFloatingParticlesProperties,
  getRainParticlesProperties,
  getRainSplashParticlesProperties,
}


const basicSphere = spawnPrimitive.sphere(12, 6, new Vector3(0, -100, 0), 1, Quaternion.one, Color.white, 1, 'None', 'Empty', undefined);
basicSphere.visible.set(false);

registerStart(start);
function start() {
  entityData.defaultParticlesProperties.meshNodeID = basicSphere.mesh.nodeID ?? -1;
}


const coloredWaterFountainSphere = spawnPrimitive.sphere(12, 6, new Vector3(0, -100, 0), 1, Quaternion.one, Color.white, 1, 'None', 'Empty', undefined);
coloredWaterFountainSphere.visible.set(false);

function getColoredWaterFountainParticlesProperties(color: Color): Partial<ParticlesProperties> {
  coloredWaterFountainSphere.mesh.color.set(color, 1);

  return {
    meshNodeID: coloredWaterFountainSphere.mesh.nodeID ?? -1,

    isEmitting: true,
    isOneShot: false,
    randomness: 0.5,

    amount: 48,
    lifetimeInSeconds: 3,
    speedScale: 1,
    scaleMin: 0,
    scaleMax: 0.04,

    initialVelocityMin: 0.5,
    initialVelocityMax: 1.75,
    gravity: Vector3.moonGravity,
    spread: 2,
  }
}


const rainbowCube = spawnPrimitive.cube(new Vector3(0, -100, 0), Vector3.one, Quaternion.one, Color.white, 1, false, 'Empty', undefined);
rainbowCube.visible.set(false);

function getRainbowCubeParticlesProperties(durationSeconds: number, saturation: number, value: number): Partial<ParticlesProperties> {
  rainbowCube.mesh.shader.set(DefaultShaders.getRainbowShader(durationSeconds, saturation, value, 0.5, 0.5));
  // Instead of creating a new shader, it could update the shader properties.

  return {
    meshNodeID: rainbowCube.mesh.nodeID ?? -1,

    randomness: 0.5,

    amount: 24,
    lifetimeInSeconds: 8,
    speedScale: 1,
    scaleMin: 0,
    scaleMax: 0.075,

    initialVelocityMin: 0,
    initialVelocityMax: 0.1,
    gravity: new Vector3(0, -0.02, 0),
    spread: 90,
  }
}


const heartSphere = spawnPrimitive.sphere(12, 6, new Vector3(0, -100, 0), 1, Quaternion.one, Color.white, 1, 'None', 'Empty', undefined);
heartSphere.mesh.shader.set(DefaultShaders.getHeartShader());
heartSphere.visible.set(false);

function getHeartParticlesProperties(): Partial<ParticlesProperties> {
  return {
    meshNodeID: heartSphere.mesh.nodeID ?? -1,
    emissionShape: 'Sphere',
    emissionShapeProperties: {
      sphereRadius: 0.5,
    },

    randomness: 0.5,

    amount: 6,
    lifetimeInSeconds: 3,
    speedScale: 1,
    scaleMin: 0,
    scaleMax: 0.25,

    initialVelocityMin: 0.25,
    initialVelocityMax: .75,
    gravity: Vector3.moonGravity,
    spread: 4,

    transformAlign: 'Billboard',
  }
}


const smokeSphere = spawnPrimitive.sphere(12, 6, new Vector3(0, -100, 0), 1, Quaternion.one, Color.white, 1, 'None', 'Empty', undefined);
smokeSphere.visible.set(false);

function getSmokeParticlesProperties(color: Color | undefined): Partial<ParticlesProperties> {
  smokeSphere.mesh.color.set(color ?? new Color(0.4, 0.4, 0.35), 0.5);

  return {
    meshNodeID: smokeSphere.mesh.nodeID ?? -1,
    emissionShape: 'Sphere',

    randomness: 0.6,

    amount: 25,
    lifetimeInSeconds: 3.0,
    speedScale: 0.8,
    scaleMin: 0.6,
    scaleMax: 1,

    initialVelocityMin: 0.25,
    initialVelocityMax: 1,
    gravity: new Vector3(0, 0.15, 0),
    spread: 25,

    transformAlign: 'Billboard',
  }
}


const explosionParticlesSphere = spawnPrimitive.sphere(12, 6, new Vector3(0, -100, 0), 1, Quaternion.one, Color.white, 1, 'None', 'Empty', undefined);
explosionParticlesSphere.visible.set(false);

function getExplosionParticlesProperties(color: Color): Partial<ParticlesProperties> {
  explosionParticlesSphere.mesh.shader.set(DefaultShaders.getColorShader(color, 0.7, 0.8));

  return {
    meshNodeID: explosionParticlesSphere.mesh.nodeID ?? -1,

    isOneShot: true,
    explosiveness: 1.0,
    randomness: 0.4,

    amount: 30,
    lifetimeInSeconds: 1,
    speedScale: 2.5,
    scaleMin: 0.08,
    scaleMax: 0.3,

    initialVelocityMin: 0.25,
    initialVelocityMax: 1,
    gravity: Vector3.earthGravity,
    spread: 45,
  }
}


const magicFloatingSphere = spawnPrimitive.sphere(12, 6, new Vector3(0, -100, 0), 1, Quaternion.one, Color.white, 1, 'None', 'Empty', undefined);
magicFloatingSphere.visible.set(false);

function getMagicFloatingParticlesProperties(durationSeconds: number, saturation: number, value: number): Partial<ParticlesProperties> {
  magicFloatingSphere.mesh.shader.set(DefaultShaders.getRainbowShader(durationSeconds, saturation, value, 0.5, 0.5));

  return {
    meshNodeID: magicFloatingSphere.mesh.nodeID ?? -1,
    emissionShape: 'Ring',

    randomness: 0.5,

    amount: 30,
    lifetimeInSeconds: 1.4,
    speedScale: 0.8,
    scaleMin: 0.05,
    scaleMax: 0.2,

    initialVelocityMin: 0.25,
    initialVelocityMax: 2,
    gravity: new Vector3(0, 0.1, 0),
    spread: 15,
  }
}


const rainParticlesSphere = spawnPrimitive.sphere(12, 6, new Vector3(0, -100, 0), 1, Quaternion.one, Color.white, 1, 'None', 'Empty', undefined);
rainParticlesSphere.visible.set(false);

function getRainParticlesProperties(color: Color | undefined): Partial<ParticlesProperties> {
  rainParticlesSphere.mesh.color.set(color ?? new Color(0.427, 0.706, 0.969), 0.8);

  return {
    meshNodeID: rainParticlesSphere.mesh.nodeID ?? -1,
    emissionShape: 'Box',
    emissionShapeProperties: {
      boxExtents: new Vector3(3, 0.25, 3),
    },

    randomness: 0.45,

    amount: 150,
    lifetimeInSeconds: 4,
    speedScale: 1,
    scaleMin: 0.03,
    scaleMax: 0.06,

    initialVelocityMin: 0.25,
    initialVelocityMax: 2,
    gravity: new Vector3(0, -25.0, 0),
    direction: Vector3.down,
    spread: 2,

    transformAlign: 'AlignToVelocity',
  }
}


const rainSplashParticlesSphere = spawnPrimitive.sphere(12, 6, new Vector3(0, -100, 0), 1, Quaternion.one, Color.white, 1, 'None', 'Empty', undefined);
rainSplashParticlesSphere.visible.set(false);

function getRainSplashParticlesProperties(color: Color | undefined): Partial<ParticlesProperties> {
  rainSplashParticlesSphere.mesh.color.set(color ?? new Color(0.427, 0.706, 0.969), 0.8);

  return {
    meshNodeID: rainSplashParticlesSphere.mesh.nodeID ?? -1,

    explosiveness: 0.8,
    randomness: 1,

    amount: 4,
    lifetimeInSeconds: 1,
    speedScale: 1,
    scaleMin: 0.08,
    scaleMax: 0.1,

    initialVelocityMin: 0.25,
    initialVelocityMax: 6,
    gravity: Vector3.earthGravity,
    spread: 45,
  }
}