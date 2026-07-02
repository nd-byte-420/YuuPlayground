import { DirectoryBasePaths, combineBaseAndSubPaths } from "./utils";

export function doesFileExist(baseDirPath: DirectoryBasePaths, subDirPathToFile: string): boolean {
  return Godot.files.exists(combineBaseAndSubPaths(baseDirPath, subDirPathToFile));
}
