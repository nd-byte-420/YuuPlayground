import { type DirectoryBasePaths, combineBaseAndSubPaths } from "./utils";

export function doesFolderExist(baseDirPath: DirectoryBasePaths, subDirPath: string): boolean {
  return Godot.files.folder.exists(combineBaseAndSubPaths(baseDirPath, subDirPath));
}

export function createFolder(baseDirPath: DirectoryBasePaths, subDirPath: string): void {
  Godot.files.folder.create(combineBaseAndSubPaths(baseDirPath, subDirPath));
}

export function deleteFolder(baseDirPath: DirectoryBasePaths, subDirPath: string): void {
  Godot.files.folder.delete(combineBaseAndSubPaths(baseDirPath, subDirPath));
}

export function deleteFolderContents(baseDirPath: DirectoryBasePaths, subDirPath: string): void {
  deleteFolder(baseDirPath, subDirPath);
  createFolder(baseDirPath, subDirPath);
}

export function getFolderContents(baseDirPath: DirectoryBasePaths, subDirPath: string, isRecursive: boolean): [string, string, string][] {
  return Godot.files.folder.getContents(combineBaseAndSubPaths(baseDirPath, subDirPath), isRecursive) || [];
}

export function transpileTSFolderToJSFolder(baseDirPathToTranspile: DirectoryBasePaths, subDirPathToTranspile: string, baseSaveToDirPath: DirectoryBasePaths, subSaveToDirPath: string): boolean {
  return Godot.files.folder.transpileTSFolderToJSFolder(combineBaseAndSubPaths(baseDirPathToTranspile, subDirPathToTranspile), combineBaseAndSubPaths(baseSaveToDirPath, subSaveToDirPath));
}
