import { HandState } from "./HandState";

export class UIState extends HandState {
  public enter(): void {
    // Interacting with UI
  }

  public update(deltaTime: number): void {
    // Raycast against UI elements
    // In Godot/Yuu API UI is handled differently.
  }

  public exit(): void {
  }
}
