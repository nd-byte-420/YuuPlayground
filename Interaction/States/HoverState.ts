import { HandState } from "./HandState";
import { PointingState } from "./PointingState";
import { GrabState } from "./GrabState";
import { Raycast } from "../../Yuu API/Raycast";
import { Controller } from "../../Yuu API/Controller";
import { SelectionManager } from "../SelectionManager";

export class HoverState extends HandState {
  private gripSub: number = -1;
  private triggerSub: number = -1;

  public enter(): void {
    // Add visual outline/highlight to hovered object
    const entity = this.stateMachine.hoveredEntity;
    if (entity) {
      // Apply outline logic here
    }

    this.gripSub = Controller.subscribe(this.stateMachine.gripButton, 'Pressed', () => {
      const modifierButton = this.stateMachine.handType === 'left' ? 'leftX' : 'rightA';

      if (Controller.isPressed(modifierButton) && this.stateMachine.hoveredEntity) {
        const clonedEntity = this.stateMachine.hoveredEntity.clone();
        if (clonedEntity) {
          this.stateMachine.hoveredEntity = clonedEntity;
        }
      }
      this.stateMachine.changeState(new GrabState(this.stateMachine));
    });

    this.triggerSub = Controller.subscribe(this.stateMachine.triggerButton, 'Pressed', () => {
      if (this.stateMachine.hoveredEntity) {
        SelectionManager.select(this.stateMachine.hoveredEntity);
      }
    });
  }

  public update(deltaTime: number): void {
    const handTransform = this.stateMachine.transform;
    const pos = handTransform.position.get();
    const forward = handTransform.forward.get();
    
    if (pos && forward) {
      const hit = Raycast.directional(pos, forward, 100, { getEntity: true });
      if (hit && hit.entity) {
        if (hit.entity !== this.stateMachine.hoveredEntity) {
          // Changed target
          // Remove highlight from old entity
          this.stateMachine.hoveredEntity = hit.entity;
          // Add highlight to new entity
        }
      } else {
        // Target lost
        this.stateMachine.hoveredEntity = undefined;
        this.stateMachine.changeState(new PointingState(this.stateMachine));
      }
    }
  }

  public exit(): void {
    if (this.gripSub !== -1) Controller.unsubscribe(this.gripSub);
    if (this.triggerSub !== -1) Controller.unsubscribe(this.triggerSub);
    
    // Remove outline/highlight from hovered object
  }
}
