import { registerStart } from "./Yuu API/RegisterStart";
import { Player } from "./Yuu API/Player";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Controller } from "./Yuu API/Controller";
import { SkyDome } from "./Yuu API/SkyDome";


function updateSkydome() {
  SkyDome.ambientLight.skyColorContribution.set(0.98);

  // Spawns the custom sky dome mesh with atmospheric gradient & starfield
  SkyDome.customShader.spawnSkyDome({
    diameter: 500,
    timeOfDay: 0.0,
    starfieldIntensity: 1.0,
    gradientIntensity: 1.0,
    useProceduralFallback: true,
    followPlayer: true,
    autoRotateStars: true,
  });

  // Start 24h day/night cycle (120 seconds per day)
  SkyDome.customShader.startDayNightCycle(10);

  // Native sky shader fallback if supportedgs
  // SkyDome.skyMaterial.setShader(SkyDome.skyShaderCode);
}


registerStart(start);
async function start() {
  updateSkydome();

  console.log('spawned skydome');

  Player.position.set(new Vector3(0, 13, 0));

  // // if you press right trigger go up 11 units
  // Controller.subscribe('rightTrigger', 'Pressed', () => {
  //   const prevpos = Player.position.get() || new Vector3(0, 0, 0);
  //   const newPos = new Vector3(prevpos.x, prevpos.y + 11, prevpos.z);
  //   Player.position.set(newPos);
  // });
}


