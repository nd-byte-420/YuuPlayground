import { Vector3 } from "../Basic Types/Vector3";
import { ParticlesProperties } from "../Particles/Particles";
import { RayHit } from "../Raycast";



export type WhatCanTrigger = 'Entity' | 'Left Hand' | 'Right Hand' | 'Head' | 'Body' | 'Foot';

export const entityData = {
  triggerMap: new Map<number, { triggerRadius: number, yRadius: number | undefined, whatCanTrigger: WhatCanTrigger[], entityTags: string[], activeCount: number, onUpdateTriggeredFunction: undefined | ((onUpdatePayload: OnUpdatePayload) => void), occupiedTriggeredFunction: undefined | ((occupiedTriggerPayload: OccupiedTriggerPayload) => void), emptyTriggeredFunction: undefined | (() => void) }>(),
  rayClickMap: new Map<number, { clickFunction: undefined | ((rayHit: RayHit) => void), heldFunction: undefined | ((rayHit: RayHit) => void), releaseFunction: undefined | ((rayHit: RayHit) => void) }>(),
  paintableEntities: [] as number[],
  uvEntities: [] as number[],
  triggerDetectableEntities: [] as number[],
  defaultParticlesProperties: { meshID: undefined, amount: 20, scaleMin: 0.01, scaleMax: 0.1, initialVelocityMin: 0.25, initialVelocityMax: 1, gravity: Vector3.zero, direction: Vector3.up, spread: 180 } as Partial<ParticlesProperties>,
}


export type OccupiedTriggerPayload = {
  pos: Vector3,
}

export type OnUpdatePayload = {
  positions: Vector3[],
}
