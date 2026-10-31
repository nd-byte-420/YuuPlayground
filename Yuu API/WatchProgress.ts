
import { registerStart } from "./RegisterStart"
import { Events } from "./Events";


export const WatchProgress = {
  onUpdate: watchOnUpdate,
  stop,
}


const progressFunctionsMap = new Map<number, { watcherFunction: (progress: number) => void, getProgressFunction: () => number }>();
let nextID = 0;


/**
 * Provide a function to watch the progress of another function.
 * Note: Automatically stops watching once the progress reaches 1.
 * @param watcherFunction is called every frame with the current progress
 * @param getProgressFunction is called every frame and the value is passed into the watcher function
 * @returns number id that allows you to stop watching
 */
function watchOnUpdate(watcherFunction: (progress: number) => void, getProgressFunction: () => number): number {
  nextID++;

  progressFunctionsMap.set(nextID, { watcherFunction: watcherFunction, getProgressFunction: getProgressFunction });

  return nextID;
}


/**
 * Stop watching progress for a given id
 * @param id to stop watching
 * @returns — true if the id existed and has been removed, or false if the id does not exist
 */
function stop(id: number): boolean {
  return progressFunctionsMap.delete(id);
}


registerStart(() => { Events.onPhysicsUpdate(onUpdate); });

function onUpdate(deltaTime: number) {
  processProgress();
}

function processProgress() {
  if (progressFunctionsMap.size > 0) {
    const removeIDs: number[] = [];

    progressFunctionsMap.forEach((payload, id) => {
      const progress = payload.getProgressFunction();

      payload.watcherFunction(progress);

      if (progress >= 1) {
        removeIDs.push(id);
      }
    });

    removeIDs.forEach((idToRemove) => {
      progressFunctionsMap.delete(idToRemove);
    });
  }
}