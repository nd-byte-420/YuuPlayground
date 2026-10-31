import { Color } from "./Basic Types/Color";
import { Quaternion } from "./Basic Types/Quaternion";
import { Vector3 } from "./Basic Types/Vector3";
import { Entity } from "./Entity/Entity";
import { registerStart } from "./RegisterStart";


// needs to be changed to set get long term
// need warn/error/info/etc
// make console history accessible


let isInitialized = false;
let startedTime = Date.now();

registerStart(start);
function start() {
  if (!isInitialized) {
    isInitialized = true;

    const orgLog = console.log;

    console.log = (...args: any[]) => {
      orgLog(...args);

      history.push({ timestamp: (Date.now() - startedTime) / 1000, args: args });

      if (history.length > 20) {
        history.shift();
      }
      updateText();
    };
  }
}


export const inWorldConsole = {
  visible,
  toggle,
}


type LogEntry = {
  timestamp: number,
  args: any[],
}

const history: LogEntry[] = [];


let entity: Entity | undefined;
let isVisibleStored = false;

/**
 * Toggle the console visibility on or off
 * @param isVisible or not
 * @param position to place
 * @param rotation to use
 */
function visible(isVisible: boolean, position: Vector3 = Vector3.up, rotation: Quaternion = Quaternion.one) {
  isVisibleStored = isVisible;
  
  if (entity === undefined) {
    entity = new Entity(position, rotation, Vector3.one, undefined, 'Static');

    entity.text.create("", 4, 0);
    entity.text.color.set(Color.black);
  }
  else {
    entity.pos = position;
    entity.rot = rotation;
  }

  entity.visible.set(isVisible);

  if (isVisible) {
    updateText();
  }
}

/**
 * Toggle the console on or off
 * @param position to place
 * @param rotation to use
 * @returns boolean true if turned on
 */
function toggle(position: Vector3 = Vector3.up, rotation: Quaternion = Quaternion.one) {
  visible(!isVisibleStored, position, rotation);

  return isVisibleStored;
}

function updateText() {
  if (entity && isVisibleStored) {
    let display = "Console:\n";

    history.forEach((logEntry) => {
      display += "\n" + logEntry.timestamp + ":";

      logEntry.args.forEach((arg) => {
        display += " " + arg;
      });
    });

    entity.text.display.set(display);
  }
}
