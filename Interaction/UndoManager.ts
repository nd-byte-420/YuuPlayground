import { Entity } from "../Yuu API/Entity";
import { Vector3 } from "../Yuu API/Basic Types/Vector3";
import { Quaternion } from "../Yuu API/Basic Types/Quaternion";

export abstract class Command {
  public abstract do(): void;
  public abstract undo(): void;
}

export class TransformCommand extends Command {
  constructor(
    private entity: Entity,
    private startPos: Vector3,
    private startRot: Quaternion,
    private endPos: Vector3,
    private endRot: Quaternion
  ) {
    super();
  }

  public do(): void {
    if (this.entity.exists()) {
      this.entity.pos = this.endPos;
      this.entity.rot = this.endRot;
    }
  }

  public undo(): void {
    if (this.entity.exists()) {
      this.entity.pos = this.startPos;
      this.entity.rot = this.startRot;
    }
  }
}

class UndoManagerClass {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  public pushCommand(command: Command) {
    this.undoStack.push(command);
    this.redoStack = []; // clear redo stack on new action
  }

  public undo() {
    const cmd = this.undoStack.pop();
    if (cmd) {
      cmd.undo();
      this.redoStack.push(cmd);
    }
  }

  public redo() {
    const cmd = this.redoStack.pop();
    if (cmd) {
      cmd.do();
      this.undoStack.push(cmd);
    }
  }
}

export const UndoManager = new UndoManagerClass();
