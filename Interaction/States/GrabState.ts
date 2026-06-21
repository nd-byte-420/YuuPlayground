import { HandState } from "./HandState";
import { PointingState } from "./PointingState";
import { Controller } from "../../Yuu API/Controller";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";

export enum GrabType {
  FreeMove,
  AxisMove,
  Rotate,
  Scale
}

export class GrabState extends HandState {
  private gripSub: number = -1;
  public grabType: GrabType = GrabType.FreeMove;
  
  // FreeMove State
  private grabOffsetPos: Vector3 = Vector3.zero;
  private grabOffsetRot: Quaternion = Quaternion.one;
  
  public enter(): void {
    if (!this.stateMachine.hoveredEntity) {
      this.stateMachine.changeState(new PointingState(this.stateMachine));
      return;
    }
    
    this.stateMachine.grabbedEntity = this.stateMachine.hoveredEntity;
    this.grabType = GrabType.FreeMove; // Default to FreeMove unless it's a gizmo handle
    
    const handTransform = this.stateMachine.transform;
    const handPos = handTransform.position.get() || Vector3.zero;
    
    if (this.stateMachine.grabbedEntity) {
       // grab_offset = object.position - hand.position
       // Note: A true robust solution involves affine inverse matrices to support nested rotations,
       // but Yuu API Vector3 provides a solid base for FreeMove translation.
       this.grabOffsetPos = this.stateMachine.grabbedEntity.pos.subtract(handPos);
    }

    this.gripSub = Controller.subscribe(this.stateMachine.gripButton, 'Released', () => {
      this.stateMachine.changeState(new PointingState(this.stateMachine));
    });
  }

  public update(deltaTime: number): void {
    if (!this.stateMachine.grabbedEntity) return;

    const handTransform = this.stateMachine.transform;
    const handPos = handTransform.position.get() || Vector3.zero;

    if (this.grabType === GrabType.FreeMove) {
      this.stateMachine.grabbedEntity.pos = handPos.add(this.grabOffsetPos);
    }
    // Handle AxisMove, Rotate, Scale based on GrabType in future steps
  }

  public exit(): void {
    if (this.gripSub !== -1) Controller.unsubscribe(this.gripSub);
    this.stateMachine.grabbedEntity = undefined;
  }
}
