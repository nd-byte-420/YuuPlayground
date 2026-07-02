import { Color } from "../../Yuu API/Basic Types/Color";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Entity } from "../../Yuu API/Entity";
import { spawnPrimitive } from "../../Yuu API/SpawnPrimitive";

/**
 * Spawns a single axis arrow (stem + cone tip) parented under a root entity.
 * Returns the root parent entity so the caller can track it in an array.
 *
 * @param center  World-space spawn position.
 * @param axis    Which axis this arrow represents.
 * @param color   Arrow colour.
 * @param onArrowClick  Callback fired when stem or tip is clicked.
 * @param onArrowHeld   Callback fired while stem or tip is held.
 */
export function createArrow(
  center: Vector3,
  axis: 'X' | 'Y' | 'Z',
  color: Color,
  onArrowClick: (axis: 'X' | 'Y' | 'Z', hit: any) => void,
  onArrowHeld:  (axis: 'X' | 'Y' | 'Z', hit: any) => void
): Entity {
  // Spawn a root entity at gizmo center
  const parentEntity = new Entity(center, Quaternion.one, Vector3.one, undefined, 'Static');

  let stemScale = new Vector3(0.015, 0.16, 0.015);
  let stemPos   = Vector3.zero;
  let tipPos    = Vector3.zero;
  let arrowRot  = Quaternion.one;

  const rad90 = Math.PI / 2;

  if (axis === 'X') {
    stemScale = new Vector3(0.16, 0.015, 0.015);
    stemPos   = new Vector3(0.08, 0, 0);
    tipPos    = new Vector3(0.18, 0, 0);
    arrowRot  = Quaternion.fromEuler(new Vector3(0, 0, -rad90));
  } else if (axis === 'Y') {
    stemScale = new Vector3(0.015, 0.16, 0.015);
    stemPos   = new Vector3(0, 0.08, 0);
    tipPos    = new Vector3(0, 0.18, 0);
    arrowRot  = Quaternion.one;
  } else if (axis === 'Z') {
    stemScale = new Vector3(0.015, 0.015, 0.16);
    stemPos   = new Vector3(0, 0, 0.08);
    tipPos    = new Vector3(0, 0, 0.18);
    arrowRot  = Quaternion.fromEuler(new Vector3(rad90, 0, 0));
  }

  const stem = spawnPrimitive.cube(stemPos, stemScale, Quaternion.one, color, 1.0, true, 'Static', parentEntity);
  const tip  = spawnPrimitive.cone(16, tipPos, 0.035, arrowRot, color, 1.0, 'Convex', 'Static', parentEntity);

  stem.rayClick.initialize(false);
  stem.rayClick.setClickFunction((hit: any) => onArrowClick(axis, hit));
  stem.rayClick.setHeldFunction((hit: any) => onArrowHeld(axis, hit));

  tip.rayClick.initialize(false);
  tip.rayClick.setClickFunction((hit: any) => onArrowClick(axis, hit));
  tip.rayClick.setHeldFunction((hit: any) => onArrowHeld(axis, hit));

  return parentEntity;
}
