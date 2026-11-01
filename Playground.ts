import { registerStart } from "./Yuu API/RegisterStart";
import { Player } from "./Yuu API/Player";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Color } from "./Yuu API/Basic Types/Color";
import { Controller } from "./Yuu API/Controller";
import { SkyDome } from "./Yuu API/SkyDome";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Billboard } from "./Yuu API/Billboard";
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

function spawnMoonBillboard(distance: number = 32) {
  const spawnCenter = Player.position.get() ?? new Vector3(0, 13, 0);

  // Direction towards the moon/glow (facing forward and slightly elevated)
  const dir = new Vector3(0, 0.15, -1.0).normalize();
  const moonPos = spawnCenter.add(dir.multiply(distance));
  // Place glow slightly behind the moon plane along the sightline
  const glowPos = moonPos.add(dir.multiply(0.2));

  // 1. Glow Billboard plane (rendered with Both sides, transparent)
  const glowScale = new Vector3(7, 7, 1);
  const glowPlane = spawnPrimitive.plane(
    'Both',
    glowPos,
    glowScale,
    Quaternion.one,
    Color.white,
    0.99,
    'None',
    'Static',
    undefined
  );
  Billboard.start(glowPlane, 'Freely', { unshaded: true, followPlayer: true });
  applyTextureToEntity(glowPlane, 'glow');

  // 2. Moon Billboard plane (rendered with Both sides, transparent)
  const moonScale = new Vector3(5, 5, 1);
  const moonPlane = spawnPrimitive.plane(
    'Both',
    moonPos,
    moonScale,
    Quaternion.one,
    Color.white,
    0.99,
    'None',
    'Static',
    undefined
  );
  Billboard.start(moonPlane, 'Freely', { unshaded: true, followPlayer: true });
  applyTextureToEntity(moonPlane, 'moon');

  return { moonPlane, glowPlane };
}


registerStart(start);
async function start() {
  updateSkydome();

  console.log('spawned skydome');

  Player.position.set(new Vector3(0, 13, 0));

  spawnMoonBillboard(32);
  console.log('spawned moon and glow billboard');

  // // if you press right trigger go up 11 units
  // Controller.subscribe('rightTrigger', 'Pressed', () => {
  //   const prevpos = Player.position.get() || new Vector3(0, 0, 0);
  //   const newPos = new Vector3(prevpos.x, prevpos.y + 11, prevpos.z);
  //   Player.position.set(newPos);
  // });
}



