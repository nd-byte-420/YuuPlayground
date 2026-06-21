import { HandState } from "./States/HandState";
import { Player } from "../Yuu API/Player";
import { Entity } from "../Yuu API/Entity";

export type HandType = 'left' | 'right';

export class HandStateMachine {
  public handType: HandType;
  private _currentState: HandState | undefined;
  
  public get currentState(): HandState | undefined {
    return this._currentState;
  }
  
  // Shared state data for transitions
  public hoveredEntity: Entity | undefined;
  public grabbedEntity: Entity | undefined;
  
  constructor(handType: HandType) {
    this.handType = handType;
  }
  
  public changeState(newState: HandState) {
    if (this._currentState) {
      this._currentState.exit();
    }
    this._currentState = newState;
    if (this._currentState) {
      this._currentState.enter();
    }
  }

  public update(deltaTime: number) {
    if (this._currentState) {
      this._currentState.update(deltaTime);
    }
  }
  
  public get transform() {
    return this.handType === 'left' ? Player.leftHand : Player.rightHand;
  }
  
  public get triggerButton(): ControllerButtonPressed {
    return this.handType === 'left' ? 'leftTrigger' : 'rightTrigger';
  }

  public get gripButton(): ControllerButtonPressed {
    return this.handType === 'left' ? 'leftGrip' : 'rightGrip';
  }
}
