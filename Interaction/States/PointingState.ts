import { HandState } from "./HandState";
import { HoverState } from "./HoverState";
import { UIState } from "./UIState";
import { Raycast } from "../../Yuu API/Raycast";

export class PointingState extends HandState {
  public enter(): void {
    // Show laser visual
    // (Visuals to be implemented by a LineRenderer or similar Godot entity)
  }

  public update(deltaTime: number): void {
    const handTransform = this.stateMachine.transform;
    const pos = handTransform.position.get();
    const forward = handTransform.forward.get();
    
    if (pos && forward) {
      const hit = Raycast.directional(pos, forward, 100, { getEntity: true });
      if (hit && hit.entity) {
        this.stateMachine.hoveredEntity = hit.entity;
        
        // TODO: Distinguish between UI and Objects. 
        // For now, assume it's an object and transition to HoverState.
        const isUI = false; 
        if (isUI) {
            this.stateMachine.changeState(new UIState(this.stateMachine));
        } else {
            this.stateMachine.changeState(new HoverState(this.stateMachine));
        }
      }
    }
  }

  public exit(): void {
    // Hide laser visual
  }
}
