import { Vector3 } from "../Basic Types/Vector3";


// Edit this type definition to have explanations like the d.ts
export type ParticlesProperties = {
  meshNodeID: number,
  emissionShape: ParticlesEmissionShape,
  emissionShapeProperties: Partial<{
    sphereRadius: number,
    boxExtents: Vector3,
    ring: Partial<{
      axis: Vector3,
      height: number,
      radius: number,
      innerRadius: number,
      coneAngle: number,
    }>,
  }>,

  isEmitting: boolean,
  isOneShot: boolean,
  explosiveness: number,
  randomness: number,

  amount: number,
  lifetimeInSeconds: number,
  speedScale: number,
  scaleMin: number,
  scaleMax: number,
  initialRotationMin: Vector3,
  initialRotationMax: Vector3,

  initialVelocityMin: number,
  initialVelocityMax: number,
  rotationVelocityMin: Vector3,
  rotationVelocityMax: Vector3,

  gravity: Vector3,
  direction: Vector3,
  spread: number,
  tangentialAccelMin: number,
  tangentialAccelMax: number,
  turbulence: Partial<{
    noiseStrength: number,
    noiseScale: number,
    noiseSpeed: Vector3,
    noiseSpeedRandom: number,
  }>,

  transformAlign: Partial<{
    type: ParticlesTransformAlignment,
    angleMin: number,
    angleMax: number,
  }>,
}
