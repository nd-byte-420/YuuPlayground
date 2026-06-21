import { HandState } from "./States/HandState";
import { Player } from "../Yuu API/Player";
import { Entity } from "../Yuu API/Entity";
import { RadialMenu } from "./UI/RadialMenu";
import { GrabType } from "./States/GrabState";

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
  public selectedGrabType: GrabType = GrabType.FreeMove;
  public radialMenu: RadialMenu;
  
  constructor(handType: HandType) {
    this.handType = handType;
    this.radialMenu = new RadialMenu(handType);
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
    
    // Update Radial Menu using thumbstick
    const handPos = this.transform.position.get();
    const handRot = this.transform.rotation.get();
    const thumbstick = this.transform.thumbstick?.get();

    if (handPos && handRot) {
      const newType = this.radialMenu.update(handPos, handRot, thumbstick);
      if (newType !== undefined) {
        this.selectedGrabType = newType;
      }
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
