import { HandStateMachine } from "./HandStateMachine";
import { IdleState } from "./States/IdleState";
import { GrabState } from "./States/GrabState";
import { DualHandState } from "./States/DualHandState";
import { Events } from "../Yuu API/Events";
import { Controller } from "../Yuu API/Controller";
import { UndoManager } from "./UndoManager";

class InteractionManagerClass {
  public leftHand: HandStateMachine;
  public rightHand: HandStateMachine;
  public isSnapping: boolean = false;

  private updateSubscriptionId: number = -1;
  private snapSub: number = -1;
  private undoSub: number = -1;

  constructor() {
    this.leftHand = new HandStateMachine('left');
    this.rightHand = new HandStateMachine('right');
  }

  public initialize() {
    this.leftHand.changeState(new IdleState(this.leftHand));
    this.rightHand.changeState(new IdleState(this.rightHand));

    // Subscribe to physics update
    this.updateSubscriptionId = Events.onPhysicsUpdate((dt) => this.update(dt));

    this.snapSub = Controller.subscribe('leftThumbstick', 'Pressed', () => {
      this.isSnapping = !this.isSnapping;
    });

    this.undoSub = Controller.subscribe('leftX', 'Pressed', () => {
      UndoManager.undo();
    });
  }

  public destroy() {
    if (this.updateSubscriptionId !== -1) {
      Events.unsubscribe(this.updateSubscriptionId);
    }
    if (this.snapSub !== -1) Controller.unsubscribe(this.snapSub);
    if (this.undoSub !== -1) Controller.unsubscribe(this.undoSub);
  }

  private update(deltaTime: number) {
    this.leftHand.update(deltaTime);
    this.rightHand.update(deltaTime);

    this.checkDualHandInteractions();
  }

  private checkDualHandInteractions() {
    // If both hands are grabbing the same object, and they aren't already in DualHandState
    // Transition both to DualHandState
    const leftState = this.leftHand.currentState;
    const rightState = this.rightHand.currentState;

    if (leftState instanceof GrabState && rightState instanceof GrabState) {
      if (this.leftHand.grabbedEntity && this.leftHand.grabbedEntity === this.rightHand.grabbedEntity) {
        // Both are grabbing the same entity! Transition to DualHandState
        this.leftHand.changeState(new DualHandState(this.leftHand));
        this.rightHand.changeState(new DualHandState(this.rightHand));
      }
    }
  }
}

export const InteractionManager = new InteractionManagerClass();
