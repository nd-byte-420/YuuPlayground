import { doesFileExist } from "./exists";
import { createTextFile, updateTextFile, getTextFile } from "./text";
import { doesFolderExist, createFolder, deleteFolder, deleteFolderContents, getFolderContents, transpileTSFolderToJSFolder } from "./folder";
import { compressFolderToZip, extractFilesFromZip } from "./zip";
import { combineBaseAndSubPaths } from "./utils";

export const Files = {
  exists: doesFileExist,
  text: {
    create: createTextFile,
    update: updateTextFile,
    get: getTextFile,
  },
  folder: {
    exists: doesFolderExist,
    create: createFolder,
    delete: deleteFolder,
    deleteContents: deleteFolderContents,
    getContents: getFolderContents,
    transpileTSToJS: transpileTSFolderToJSFolder,
    areTSFilesTranspiled: Godot.files.folder.areTSFilesTranspiled,
    tsFilesRemainingToBeCompiled: Godot.files.folder.tsFilesRemainingToBeCompiled,
  },
  zip: {
    compressFolder: compressFolderToZip,
    extractFiles: extractFilesFromZip,
  },
  utils: {
    combineBaseAndSubPaths,
  },
};

export type { DirectoryBasePaths } from "./utils";
