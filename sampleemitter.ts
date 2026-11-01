import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { ParticlesProperties } from "./Yuu API/Particles/Particles";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";



export const MyParticles = {
  getConfettiParticlesProperties,
}



function getConfettiParticlesProperties(color: Color): Partial<ParticlesProperties> {
  const confettiPlane = spawnPrimitive.plane('Both', Vector3.zero, Vector3.one, Quaternion.one, Color.white, 1, 'None', 'Empty', undefined);
  confettiPlane.visible.set(false);
  confettiPlane.mesh.color.set(color, 1);

  return {
    meshNodeID: confettiPlane.mesh.nodeID ?? -1,

    isEmitting: true,
    isOneShot: false,
    randomness: 1,
    explosiveness: 0.9,

    amount: 24,
    lifetimeInSeconds: 3,
    speedScale: 1,
    scaleMin: 0,
    scaleMax: 0.06,
    initialRotationMax: new Vector3(360, 360, 360),

    initialVelocityMin: 1.5,
    initialVelocityMax: 3.75,
    gravity: new Vector3(0, -2.75, 0),
    spread: 9,
    rotationVelocityMin: new Vector3(-25,-25,-25),
    rotationVelocityMax: new Vector3(25,25,25),
    direction: new Vector3(0.25, 1, 0),
  }
}

