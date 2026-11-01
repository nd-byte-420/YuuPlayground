import { Color } from "./Basic Types/Color";
import { Quaternion } from "./Basic Types/Quaternion";
import { Vector3 } from "./Basic Types/Vector3";
import { Entity } from "./Entity/Entity";
import { Events } from "./Events";
import { Player } from "./Player";
import { registerStart } from "./RegisterStart";


registerStart(worldStart);
function worldStart() {
  Events.onUpdate(billboardOnUpdate);
}


export type BillboardMode = 'YLock' | 'Freely';

export interface PositionAxisLock {
  x?: boolean;
  y?: boolean;
  z?: boolean;
}

export interface BillboardOptions {
  /**
   * If true, makes the entity self-illuminating / unshaded so sky ambient light doesn't tint it (default: false)
   */
  unshaded?: boolean;
  /**
   * If true, keeps celestial billboards (like the moon) at a constant relative offset from the player
   * so they never get clipped or covered by the SkyDome mesh as the player moves.
   */
  followPlayer?: boolean;
  /**
   * Lock specific world position axes when followPlayer is active (e.g. { y: true } keeps height fixed in world space).
   * Or when billboards reposition, prevents specified axes from changing.
   */
  lockPositionAxis?: PositionAxisLock;
}

interface BillboardEntry {
  mode: BillboardMode;
  options?: BillboardOptions;
  relativeOffset?: Vector3;
  initialPos: Vector3;
}

const billboardMap = new Map<Entity, BillboardEntry>();

function billboardOnUpdate(deltaTime: number) {
  const localPlayerPos = Player.head.position.get();
  
  if (localPlayerPos) {
    billboardMap.forEach((entry, entity) => {
      // If celestial followPlayer is enabled, keep the billboard positioned relative to the player
      if (entry.options?.followPlayer && entry.relativeOffset) {
        const targetPos = localPlayerPos.add(entry.relativeOffset);
        const lock = entry.options.lockPositionAxis;

        if (lock) {
          entity.pos = new Vector3(
            lock.x ? entry.initialPos.x : targetPos.x,
            lock.y ? entry.initialPos.y : targetPos.y,
            lock.z ? entry.initialPos.z : targetPos.z
          );
        } else {
          entity.pos = targetPos;
        }
      }

      const pos = entity.pos;
      const direction = localPlayerPos.subtract(pos);

      if (entry.mode === 'YLock') {
        direction.y = 0;
      }

      direction.normalizeInPlace();

      entity.rot = Quaternion.lookAt(direction, Vector3.up);
    });
  }
}


export const Billboard = {
  start,
  stop,
}


function start(entity: Entity, mode: BillboardMode, options?: BillboardOptions) {
  const initialPos = entity.pos.clone();
  let relativeOffset: Vector3 | undefined;

  if (options?.followPlayer) {
    const playerPos = Player.head.position.get() ?? Player.position.get() ?? Vector3.zero;
    relativeOffset = initialPos.subtract(playerPos);
  }

  billboardMap.set(entity, { mode, options, relativeOffset, initialPos });

  if (options?.unshaded) {
    // Disable diffuse emission blowout; set metallic to 1.0 and roughness to 1.0 so ambient lighting doesn't add specular or diffuse sky shine
    entity.mesh.material.emissionColor.set(Color.black);
    entity.mesh.material.emissionStrength.set(0.0);
    entity.mesh.material.metallic.set(1.0);
    entity.mesh.material.roughness.set(1.0);
  }
}

function stop(entity: Entity) {
  billboardMap.delete(entity);
}


