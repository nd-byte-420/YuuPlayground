import { HandState } from "./HandState";
import { PointingState } from "./PointingState";
import { Controller } from "../../Yuu API/Controller";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Player } from "../../Yuu API/Player";

export class DualHandState extends HandState {
  private initialHandDistance: number = 0;
  private initialScale: Vector3 = Vector3.one;

  private gripSub: number = -1;

  public enter(): void {
    const leftPos = Player.leftHand.position.get() || Vector3.zero;
    const rightPos = Player.rightHand.position.get() || Vector3.zero;
    
    this.initialHandDistance = leftPos.distanceTo(rightPos);
    
    if (this.stateMachine.grabbedEntity) {
      this.initialScale = this.stateMachine.grabbedEntity.scale;
    }

    this.gripSub = Controller.subscribe(this.stateMachine.gripButton, 'Released', () => {
      this.stateMachine.changeState(new PointingState(this.stateMachine));
    });
  }

  public update(deltaTime: number): void {
    if (!this.stateMachine.grabbedEntity) return;

    // Only update transform from one of the hands (e.g. left) to prevent double-applying
    if (this.stateMachine.handType === 'right') return;

    const leftPos = Player.leftHand.position.get() || Vector3.zero;
    const rightPos = Player.rightHand.position.get() || Vector3.zero;

    // Position = Midpoint
    const midPoint = leftPos.lerp(rightPos, 0.5);
    this.stateMachine.grabbedEntity.pos = midPoint;

    // Scale = Spread
    if (this.initialHandDistance > 0.001) {
      const currentDistance = leftPos.distanceTo(rightPos);
      const scaleFactor = currentDistance / this.initialHandDistance;
      this.stateMachine.grabbedEntity.scale = this.initialScale.multiply(scaleFactor);
    }
    
    // Twist Rotation to be implemented
  }

  public exit(): void {
    if (this.gripSub !== -1) Controller.unsubscribe(this.gripSub);
    // Note: Grabbed entity state might need to be preserved if falling back to single GrabState
  }
}
