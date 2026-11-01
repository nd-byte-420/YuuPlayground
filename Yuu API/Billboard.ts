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

export interface BillboardOptions {
  /**
   * If true, makes the entity self-illuminating / unshaded so sky ambient light doesn't tint it (default: false)
   */
  unshaded?: boolean;
}

const billboardMap = new Map<Entity, BillboardMode>();

function billboardOnUpdate(deltaTime: number) {
  const localPlayerPos = Player.head.position.get();
  
  if (localPlayerPos) {
    billboardMap.forEach((mode, entity) => {
      const pos = entity.pos;

      const direction = localPlayerPos.subtract(pos);

      if (mode === 'YLock') {
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
  billboardMap.set(entity, mode);

  if (options?.unshaded) {
    // Enable full self-illumination (emission) with zero roughness so ambient diffuse sky lighting does not tint the texture
    entity.mesh.material.emissionColor.set(Color.white);
    entity.mesh.material.emissionStrength.set(1.0);
    entity.mesh.material.roughness.set(0.0);
  }
}

function stop(entity: Entity) {
  billboardMap.delete(entity);
}


