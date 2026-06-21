import { HandState } from "./HandState";
import { PointingState } from "./PointingState";
import { Controller } from "../../Yuu API/Controller";

export class IdleState extends HandState {
  private subscriptionId: number = -1;

  public enter(): void {
    // For now, let's always be pointing or wait for a button. 
    // In many VR applications, pointing is default if the controller is active.
    // Let's transition to pointing immediately to enable the ray.
    this.stateMachine.changeState(new PointingState(this.stateMachine));
  }

  public update(deltaTime: number): void {
  }

  public exit(): void {
  }
}
