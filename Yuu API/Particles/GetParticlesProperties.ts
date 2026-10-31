import { Vector3 } from "../Basic Types/Vector3";
import { Entity } from "../Entity/Entity";


export const GetParticlesProperties = {
  emissionShape: {
    shape,
    sphereRadius,
    boxExtents,
    ring: {
      axis: ringAxis,
      height: ringHeight,
      radius: ringRadius,
      innerRadius: ringInnerRadius,
      coneAngle: ringConeAngle,
    },
    },
    isOneShot,
    explosiveness,
    randomness,
    amount,
    lifetimeInSeconds,
    speedScale,
    scale: {
      min: minScale,
      max: maxScale,
    },
    initialRotation: {
      min: initialRotationMin,
      max: initialRotationMax,
    },
    initialVelocity: {
      min: minInitialVelocity,
      max: maxInitialVelocity,
    },
    rotationVelocity: {
      min: minRotationVelocity,
      max: maxRotationVelocity,
    },
    gravity,
    direction,
    spread,
    tangentialAccel: {
      min: minTangentialAccel,
      max: maxTangentialAccel,
    },
    turbulence: {
      noiseStrength: turbulenceNoiseStrength,
      noiseScale: turbulenceNoiseScale,
      noiseSpeed: turbulenceNoiseSpeed,
      noiseSpeedRandom: turbulenceNoiseSpeedRandom,
    },
    transformAlign: {
      type: transformAlign,
      angle: {
        min: transformAlignAngleMin,
        max: transformAlignAngleMax,
      },
    },
}


function shape(particlesEntity: Entity): ParticlesEmissionShape | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.shape.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function sphereRadius(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.shape.sphere.radius.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function boxExtents(particlesEntity: Entity): Vector3 | undefined {
  if (particlesEntity.particles.nodeID) {
    const payload = Godot.node.particles.shape.box.extents.get(particlesEntity.particles.nodeID);
    return payload ? new Vector3(payload.x, payload.y, payload.z) : undefined;
  }
  else {
    return undefined;
  }
}

function ringAxis(particlesEntity: Entity): Vector3 | undefined {
  if (particlesEntity.particles.nodeID) {
    const payload = Godot.node.particles.shape.ring.axis.get(particlesEntity.particles.nodeID);
    return payload ? new Vector3(payload.x, payload.y, payload.z) : undefined;
  }
  else {
    return undefined;
  }
}

function ringHeight(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.shape.ring.height.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function ringRadius(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.shape.ring.radius.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function ringInnerRadius(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.shape.ring.innerRadius.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function ringConeAngle(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.shape.ring.coneAngle.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function isOneShot(particlesEntity: Entity): boolean | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.isOneShot.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function explosiveness(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.explosiveness.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function randomness(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.randomness.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function amount(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.amount.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function lifetimeInSeconds(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.lifetime.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function speedScale(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.speedScale.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function minScale(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.scale.min.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function maxScale(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.scale.max.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function initialRotationMin(particlesEntity: Entity): Vector3 | undefined {
  if (particlesEntity.particles.nodeID) {
    const payload = Godot.node.particles.initialRotation.min.get(particlesEntity.particles.nodeID);
    return payload ? new Vector3(payload.x, payload.y, payload.z) : undefined;
  }
  else {
    return undefined;
  }
}

function initialRotationMax(particlesEntity: Entity): Vector3 | undefined {
  if (particlesEntity.particles.nodeID) {
    const payload = Godot.node.particles.initialRotation.max.get(particlesEntity.particles.nodeID);
    return payload ? new Vector3(payload.x, payload.y, payload.z) : undefined;
  }
  else {
    return undefined;
  }
}

function minInitialVelocity(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.initialVelocity.min.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function maxInitialVelocity(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.initialVelocity.max.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function minRotationVelocity(particlesEntity: Entity): Vector3 | undefined {
  if (particlesEntity.particles.nodeID) {
    const payload = Godot.node.particles.rotationVelocity.min.get(particlesEntity.particles.nodeID);
    return payload ? new Vector3(payload.x, payload.y, payload.z) : undefined;
  }
  else {
    return undefined;
  }
}

function maxRotationVelocity(particlesEntity: Entity): Vector3 | undefined {
  if (particlesEntity.particles.nodeID) {
    const payload = Godot.node.particles.rotationVelocity.max.get(particlesEntity.particles.nodeID);
    return payload ? new Vector3(payload.x, payload.y, payload.z) : undefined;
  }
  else {
    return undefined;
  }
}

function gravity(particlesEntity: Entity): Vector3 | undefined {
  if (particlesEntity.particles.nodeID) {
    const payload = Godot.node.particles.gravity.get(particlesEntity.particles.nodeID);
    return payload ? new Vector3(payload.x, payload.y, payload.z) : undefined;
  }
  else {
    return undefined;
  }
}

function direction(particlesEntity: Entity): Vector3 | undefined {
  if (particlesEntity.particles.nodeID) {
    const payload = Godot.node.particles.direction.get(particlesEntity.particles.nodeID);
    return payload ? new Vector3(payload.x, payload.y, payload.z) : undefined;
  }
  else {
    return undefined;
  }
}

function spread(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.spread.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function minTangentialAccel(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.tangentialAcceleration.min.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function maxTangentialAccel(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.tangentialAcceleration.max.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function turbulenceNoiseStrength(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.turbulence.noiseStrength.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function turbulenceNoiseScale(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.turbulence.noiseScale.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function turbulenceNoiseSpeed(particlesEntity: Entity): Vector3 | undefined {
  if (particlesEntity.particles.nodeID) {
    const payload = Godot.node.particles.turbulence.noiseSpeed.get(particlesEntity.particles.nodeID);
    return payload ? new Vector3(payload.x, payload.y, payload.z) : undefined;
  }
  else {
    return undefined;
  }
}

function turbulenceNoiseSpeedRandom(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.turbulence.noiseSpeedRandom.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function transformAlign(particlesEntity: Entity): ParticlesTransformAlignment | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.transformAlign.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function transformAlignAngleMin(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.transformAlign.angle.min.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

function transformAlignAngleMax(particlesEntity: Entity): number | undefined {
  if (particlesEntity.particles.nodeID) {
    return Godot.node.particles.transformAlign.angle.max.get(particlesEntity.particles.nodeID);
  }
  else {
    return undefined;
  }
}

