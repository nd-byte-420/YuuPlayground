import { Files } from "./Files";


export type PlayerSettings = {
  version: number,
  worlds: PersistentWorldInfo[],
}

export type PersistentWorldInfo = {
  name: string,
  isDeletable: boolean,
  isAlpha: boolean,
  version: string,
  gitUserRepoUrlPretty: string | undefined,
  zipFileURL: string | undefined,
  worldFolderName: string | undefined,
}


export const PlayerSettings = {
  get,
  update,
}


let settings: PlayerSettings | undefined;


/**
 * Gets the player settings JSON object
 * @returns 
 */
function get(): PlayerSettings {
  if (settings === undefined) {
    settings = getEmptyPlayerSettings();

    const settingsString = Files.text.get('user://profile', '', 'settings', '.json');

    if (settingsString) {
      const oldSettings: PlayerSettings = JSON.parse(settingsString);

      if (oldSettings.worlds) {
        settings.worlds = oldSettings.worlds;
      }
    }
  }

  return settings;
}

function getEmptyPlayerSettings(): PlayerSettings {
  return {
    version: 1,
    worlds: [
      { name: 'Yuu Paint', isDeletable: false, isAlpha: false, version: 'v1', gitUserRepoUrlPretty: 'YuuOnline/YuuPaint', zipFileURL: undefined, worldFolderName: undefined },
    ],
  }
}

/**
 * Updates the player settings file
 */
function update() {
  if (settings === undefined) {
    Files.text.update('user://profile', '', 'settings', '.json', JSON.stringify(get()));
  }
  else {
    Files.text.update('user://profile', '', 'settings', '.json', JSON.stringify(settings));
  }
}
