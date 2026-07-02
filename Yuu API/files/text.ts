import { type DirectoryBasePaths, combineBaseAndSubPaths } from "./utils";

export function createTextFile(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string, content: string): void {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);
  Godot.files.text.create(dirPath, fileName, fileExtension, content);
}

export function updateTextFile(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string, content: string): void {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);
  Godot.files.text.update(dirPath, fileName, fileExtension, content);
}

export function getTextFile(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string): string | undefined {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);
  return Godot.files.text.get(dirPath, fileName, fileExtension);
}
