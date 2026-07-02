import { DirectoryBasePaths, combineBaseAndSubPaths } from "./utils";

export function compressFolderToZip(baseDirPathToCompress: DirectoryBasePaths, subDirPathToCompress: string, baseSaveZipToDirPath: DirectoryBasePaths, subSaveZipToDirPath: string, zipFileName: string): boolean {
  return Godot.files.zip.compressFolder(combineBaseAndSubPaths(baseDirPathToCompress, subDirPathToCompress), combineBaseAndSubPaths(baseSaveZipToDirPath, subSaveZipToDirPath), zipFileName);
}

export function extractFilesFromZip(baseDirPathOfZip: DirectoryBasePaths, subDirPathOfZip: string, baseSaveDirPath: DirectoryBasePaths, subSaveDirPath: string): boolean {
  return Godot.files.zip.extractFiles(combineBaseAndSubPaths(baseDirPathOfZip, subDirPathOfZip), combineBaseAndSubPaths(baseSaveDirPath, subSaveDirPath));
}
