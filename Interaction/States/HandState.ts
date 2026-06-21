import { HandStateMachine } from "../HandStateMachine";

export abstract class HandState {
  protected stateMachine: HandStateMachine;

  constructor(stateMachine: HandStateMachine) {
    this.stateMachine = stateMachine;
  }

  public abstract enter(): void;
  public abstract update(deltaTime: number): void;
  public abstract exit(): void;
}
