import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Entity } from "./Yuu API/Entity";
import { Events } from "./Yuu API/Events";

/**
 * Ramp Flower Rotator
 * ===================
 * Continuous axle rotation for ramp flower props:
 * - Lower ramp flower pair (Flat slope):
 *     - prop_dynamic_1233080: Lower Ramp Flower 2 (rampflower_0.mdl), direction: +1.0
 *     - prop_dynamic_1233084: Lower Ramp Flower 1 (rampflower.mdl),   direction: -1.0
 * - Upper ramp flower pair (45-degree ramp slope):
 *     - prop_dynamic_1233821: Upper Ramp Flower 4 (rampflower_0.mdl), direction: +1.0
 *     - prop_dynamic_1233826: Upper Ramp Flower 3 (rampflower.mdl),   direction: -1.0
 *
 * Source phys_motor speed: 50.0 deg/sec (~0.87266 rad/sec).
 */

export interface RampFlowerEntities {
  propDynamic1233080?: Entity;
  propDynamic1233084?: Entity;
  propDynamic1233821?: Entity;
  propDynamic1233826?: Entity;
}

interface AnimatedFlower {
  entity: Entity;
  baseRot: Quaternion;
  direction: number;
}

const SPEED_DEG_PER_SEC = 50.0;
const RAD_PER_SEC = (SPEED_DEG_PER_SEC * Math.PI) / 180.0;

let flowers: AnimatedFlower[] = [];
let updateListenerId: number | undefined;
let currentAngle = 0;

/**
 * Registers ramp flower entities and begins continuous local Y-axis rotation.
 */
export function registerRampFlowers(entities: RampFlowerEntities) {
  flowers = [];

  const config: Array<{ entity: Entity | undefined; direction: number }> = [
    { entity: entities.propDynamic1233080, direction: 1.0 },
    { entity: entities.propDynamic1233084, direction: -1.0 },
    { entity: entities.propDynamic1233821, direction: 1.0 },
    { entity: entities.propDynamic1233826, direction: -1.0 },
  ];

  for (const item of config) {
    if (item.entity) {
      flowers.push({
        entity: item.entity,
        baseRot: item.entity.rot.clone(),
        direction: item.direction,
      });
    }
  }

  if (flowers.length === 0) return;

  if (updateListenerId === undefined) {
    updateListenerId = Events.onUpdate((delta: number) => {
      // Guard against abnormal delta spikes
      const dt = Math.min(Math.max(delta, 0), 0.1);
      currentAngle += RAD_PER_SEC * dt;
      if (currentAngle > Math.PI * 2000) {
        currentAngle %= Math.PI * 2;
      }

      for (let i = 0; i < flowers.length; i++) {
        const flower = flowers[i];
        const theta = flower.direction * currentAngle;
        const half = theta * 0.5;

        // Local rotation around local Y-axis: (0, sin(theta/2), 0, cos(theta/2))
        const qLocal = new Quaternion(0, Math.sin(half), 0, Math.cos(half));

        // Intrinsic rotation: base orientation multiplied by local delta
        flower.entity.rot = flower.baseRot.multiply(qLocal);
      }
    });
  }
}

/**
 * Cleans up the update listener.
 */
export function destroyRampFlowers() {
  if (updateListenerId !== undefined) {
    Events.unsubscribe(updateListenerId);
    updateListenerId = undefined;
  }
  flowers = [];
}

export const RampFlowerController = {
  register: registerRampFlowers,
  destroy: destroyRampFlowers,
};

