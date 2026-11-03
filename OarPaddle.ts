import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Entity } from "./Yuu API/Entity";
import { Events } from "./Yuu API/Events";
import { applyTextureToEntity } from "./Textures/loader";
import { getPropDynamic1240861 } from "./Yuu API/propDynamic1240861Model";
import { getPropDynamic1241014 } from "./Yuu API/propDynamic1241014Model";

/**
 * Oar Paddle Pivot & Continuous Rotation Controller
 * ================================================
 * Controls the central water oar paddle wheel located between the two hex towers.
 *
 * Pivot Position (Godot Y-Up):
 * - Center: Vector3(-0.995740, 38.775124, 13.760647)
 *   (Mounted directly on oar holder prop_static_55850 at Y=38.775124, Z=13.760647,
 *    matching particle splash targets at Y=35.7351, Z=16.9606)
 *
 * Child Paddle Blades:
 * - Right Paddle (prop_dynamic_1240861):
 *     Relative Pos: Vector3(9.399699, 1.661209, -0.953137)
 *     Relative Rot: Quaternion(0.950192, 0.189005, -0.048346, 0.243053)
 * - Left Paddle (prop_dynamic_1241014):
 *     Relative Pos: Vector3(-9.399699, 1.661209, -0.953137)
 *     Relative Rot: Quaternion(-0.048346, 0.243053, 0.950192, 0.189005)
 *
 * Rotation:
 * - Continuous spin along the X-axis:
 *   Rate: -0.091061 rad/frame at 24fps = -2.185464 rad/s (~ -125.22 deg/s)
 *   Full revolution: ~2.875 seconds (matching oar splash particle intervals)
 */

export interface OarPaddleEntities {
  pivot: Entity;
  paddleRight: Entity;
  paddleLeft: Entity;
}

const PADDLE_SPIN_SPEED_RAD_PER_SEC = -2.185464;

let activeEntities: OarPaddleEntities | undefined;
let updateListenerId: number | undefined;
let currentAngle = 0;

export function spawnOarPaddlePivot(
  spawnModelFn: (
    getMesh: () => [Vector3[], any, number[]],
    pos: Vector3,
    scale: Vector3,
    rot: Quaternion,
    color?: Color,
    alphaTransparency?: number,
    hasCollider?: boolean,
    type?: any,
    parent?: Entity
  ) => Entity,
  parentProp?: Entity
): OarPaddleEntities {
  // Central pivot entity positioned on oar holder mount (prop_static_55850)
  const pivotPos = parentProp
    ? Vector3.zero
    : new Vector3(-0.995740, 38.775124, 13.760647);

  const pivot = new Entity(
    pivotPos,
    Quaternion.one,
    Vector3.one,
    parentProp,
    'Animated'
  );

  // Spawn right paddle blade parented to pivot
  const paddleRight = spawnModelFn(
    getPropDynamic1240861,
    new Vector3(9.399699, 1.661209, -0.953137),
    new Vector3(0.01, 0.01, 0.01),
    new Quaternion(0.950192, 0.189005, -0.048346, 0.243053),
    new Color(1, 1, 1),
    1,
    true,
    'Animated',
    pivot
  );
  applyTextureToEntity(paddleRight, 'boatwood_n');

  // Spawn left paddle blade parented to pivot
  const paddleLeft = spawnModelFn(
    getPropDynamic1241014,
    new Vector3(-9.399699, 1.661209, -0.953137),
    new Vector3(0.01, 0.01, 0.01),
    new Quaternion(-0.048346, 0.243053, 0.950192, 0.189005),
    new Color(1, 1, 1),
    1,
    true,
    'Animated',
    pivot
  );
  applyTextureToEntity(paddleLeft, 'boatwood_n');

  activeEntities = {
    pivot,
    paddleRight,
    paddleLeft,
  };

  // Start continuous X-axis spin
  if (updateListenerId === undefined) {
    updateListenerId = Events.onUpdate((delta: number) => {
      const dt = Math.min(Math.max(delta, 0), 0.1);
      currentAngle += PADDLE_SPIN_SPEED_RAD_PER_SEC * dt;
      if (currentAngle < -Math.PI * 2000) {
        currentAngle %= Math.PI * 2;
      }
      pivot.rot = Quaternion.fromEuler(new Vector3(currentAngle, 0, 0));
    });
  }

  return activeEntities;
}

export function destroyOarPaddlePivot() {
  if (updateListenerId !== undefined) {
    Events.unsubscribe(updateListenerId);
    updateListenerId = undefined;
  }
  activeEntities = undefined;
}

export const OarPaddleController = {
  spawn: spawnOarPaddlePivot,
  destroy: destroyOarPaddlePivot,
  getEntities: () => activeEntities,
};

