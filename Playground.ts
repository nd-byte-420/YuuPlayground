import { registerStart } from "./Yuu API/RegisterStart";
import { Player } from "./Yuu API/Player";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { SkyDome } from "./Yuu API/SkyDome";
import { FlowerParticleEmitters } from "./FlowerParticleEmitters";
import { scene } from "./Scene";

function updateSkydome() {
  SkyDome.ambientLight.skyColorContribution.set(0.98);

  // Spawns the custom sky dome mesh with atmospheric gradient, starfield & textured moon
  SkyDome.customShader.spawnSkyDome({
    diameter: 80,
    timeOfDay: 0.0,
    starfieldIntensity: 1.0,
    gradientIntensity: 1.0,
    starSize: 0.14,
    enableCelestialOrb: true,
    moonSize: 0.08,
    glowSize: 0.22,
    useProceduralFallback: true,
    followPlayer: true,
    autoRotateStars: true,
  });

  // Start 24h day/night cycle (120 seconds per day)
  SkyDome.customShader.startDayNightCycle(120);
}

registerStart(start);
async function start() {
  updateSkydome();

  Player.position.set(new Vector3(0, 13, 0));
  console.log('spawned skydome with textured moon directly on dome');

  // Spawn flower particle emitters from particle-emitter-summary
  FlowerParticleEmitters.spawnAllEmitters();
  console.log('spawned flower particle emitters');

  scene.spawnScene()
}




