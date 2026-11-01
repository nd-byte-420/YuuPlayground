import { registerStart } from "./Yuu API/RegisterStart";
import { Player } from "./Yuu API/Player";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Color } from "./Yuu API/Basic Types/Color";
import { Controller } from "./Yuu API/Controller";
import { SkyDome } from "./Yuu API/SkyDome";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { applyTextureToEntity } from "./Textures/loader";


function updateSkydome() {
  SkyDome.ambientLight.skyColorContribution.set(0.98);

  // Spawns the custom sky dome mesh with atmospheric gradient & starfield
  SkyDome.customShader.spawnSkyDome({
    diameter: 80,
    timeOfDay: 0.0,
    starfieldIntensity: 1.0,
    gradientIntensity: 1.0,
    starSize: 0.14,
    useProceduralFallback: true,
    followPlayer: true,
    autoRotateStars: true,
  });

  // Start 24h day/night cycle (120 seconds per day)
  SkyDome.customShader.startDayNightCycle(10);

  // Native sky shader fallback if supportedgs
  // SkyDome.skyMaterial.setShader(SkyDome.skyShaderCode);
}

function spawnMoonPlanes(distance: number = 32) {
  const spawnCenter = Player.position.get() ?? new Vector3(0, 8, 0);

  // Direction towards the moon/glow (facing forward and slightly elevated)
  const dir = new Vector3(0, 0.05, -1.0).normalize();
  const moonPos = spawnCenter.add(dir.multiply(distance));
  // // Glow plane placed slightly behind moon along the sightline
  // const glowPos = moonPos.add(dir.multiply(0.2));

  // Orientation: look back towards the player
  const toPlayer = dir.multiply(-1);
  const rot = Quaternion.lookAt(toPlayer, Vector3.up);

  // // 1. Glow Plane
  // const glowScale = new Vector3(14, 14, 1);
  // const glowPlane = spawnPrimitive.plane(
  //   'Both',
  //   glowPos,
  //   glowScale,
  //   rot,
  //   Color.white,
  //   0.99,
  //   'None',
  //   'Static',
  //   undefined
  // );
  // applyTextureToEntity(glowPlane, 'glow');

  // 2. Moon Plane
  const moonScale = new Vector3(5, 5, 1);
  const moonPlane = spawnPrimitive.plane(
    'Both',
    moonPos,
    moonScale,
    rot,
    Color.white,
    0.99,
    'None',
    'Static',
    undefined
  );
  applyTextureToEntity(moonPlane, 'moon');

  return { moonPlane };
}


registerStart(start);
async function start() {
  updateSkydome();

  console.log('spawned skydome');

  Player.position.set(new Vector3(0, 13, 0));

  spawnMoonPlanes(32);
  console.log('spawned moon and glow planes');

  // // if you press right trigger go up 11 units
  // Controller.subscribe('rightTrigger', 'Pressed', () => {
  //   const prevpos = Player.position.get() || new Vector3(0, 0, 0);
  //   const newPos = new Vector3(prevpos.x, prevpos.y + 11, prevpos.z);
  //   Player.position.set(newPos);
  // });
}



