import { Async } from "../Async";
import { Quaternion } from "../Basic Types/Quaternion";
import { Vector3 } from "../Basic Types/Vector3";
import { Entity } from "../Entity/Entity";
import { ParticlesProperties } from "./Particles";


export const PlayParticles = {
  atPos: playParticlesAtPos,
  atPosForDuration: playParticlesAtPosForDuration,
}


/**
 * Play particles effect at a pos
 * @param pos to play the particles
 * @param particleProperties to be played, if isOneShot is true, particles are destroyed after being played
 */
function playParticlesAtPos(pos: Vector3, particleProperties: Partial<ParticlesProperties>) {
  const particles = new Entity(pos, Quaternion.one, Vector3.one, undefined, 'Static');

  particles.particles.setParticlesProperties(particleProperties);
  particles.particles.play();

  if (particleProperties.isOneShot) {
    Async.setTimeout(() => {
      particles.destroy();
    }, (particleProperties.lifetimeInSeconds ?? 1) * 2_000);
  }
}


/**
 * Play particles effect at a pos for a duration
 * @param pos to play the particles
 * @param particleProperties to be played
 * @param durationMs if set to undefined, plays indefinitely. If defined, particles are destroyed after duration.
 */
function playParticlesAtPosForDuration(pos: Vector3, particleProperties: Partial<ParticlesProperties>, durationMs: number | undefined) {
  const particles = new Entity(pos, Quaternion.one, Vector3.one, undefined, 'Static');

  particles.particles.setParticlesProperties(particleProperties);
  particles.particles.play();

  if (durationMs) {
    Async.setTimeout(() => {
      particles.particles.stop();

      Async.setTimeout(() => {
        particles.destroy();
      }, (particleProperties.lifetimeInSeconds ?? 1) * 1_000);
    }, durationMs);
  }
}

