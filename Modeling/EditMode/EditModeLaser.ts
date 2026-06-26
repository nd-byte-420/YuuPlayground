import { Color } from "../../Yuu API/Basic Types/Color";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Entity } from "../../Yuu API/Entity";
import { spawnPrimitive } from "../../Yuu API/SpawnPrimitive";
import { Raycast } from "../../Yuu API/Raycast";
import { Player } from "../../Yuu API/Player";

/**
 * Spawns the guide line and cursor dot for Edit Mode's laser pointer.
 * Returns the two entities so the caller can store them.
 */
export function spawnLaser(): { guideLine: Entity; cursorDot: Entity } {
  const guideLine = spawnPrimitive.cube(
    Vector3.zero,
    new Vector3(0.002, 0.002, 5),
    Quaternion.one,
    new Color(0.8, 0.8, 0.8),
    0.3,
    false,
    'Empty',
    undefined
  );
  const cursorDot = spawnPrimitive.sphere(
    8, 8,
    Vector3.zero,
    0.015,
    Quaternion.one,
    Color.white,
    0.8,
    'None',
    'Empty',
    undefined
  );
  return { guideLine, cursorDot };
}

/**
 * Destroys the guide line and cursor dot and returns undefined for both.
 */
export function destroyLaser(guideLine: Entity | undefined, cursorDot: Entity | undefined): void {
  if (guideLine) guideLine.destroy();
  if (cursorDot)  cursorDot.destroy();
}

/**
 * Called every physics frame when Edit Mode is active.
 * Updates the guide line position/rotation and cursor dot visibility.
 */
export function updateLaser(
  guideLine: Entity | undefined,
  cursorDot:  Entity | undefined
): void {
  const handPos = Player.rightHand.position.get() ?? Player.head.position.get();
  const handFwd = Player.rightHand.forward.get()  ?? Player.head.forward.get();
  const handRot = Player.rightHand.rotation.get() ?? Player.head.rotation.get();

  if (handPos && handFwd && handRot) {
    const rayHit = Raycast.directional(handPos, handFwd, 5);

    if (guideLine) {
      guideLine.visible.set(true);
      guideLine.rot = handRot;

      let dist = 5;
      if (rayHit) {
        dist = rayHit.distance;
        if (cursorDot) {
          cursorDot.pos = rayHit.pos;
          cursorDot.visible.set(true);
          cursorDot.scale = new Vector3(0.015, 0.015, 0.015);
        }
      } else {
        if (cursorDot) cursorDot.visible.set(false);
      }

      guideLine.pos = handPos.add(handFwd.multiply(dist / 2));
      guideLine.scale = new Vector3(0.002, 0.002, dist);
    }
  } else {
    if (guideLine) guideLine.visible.set(false);
    if (cursorDot)  cursorDot.visible.set(false);
  }
}
