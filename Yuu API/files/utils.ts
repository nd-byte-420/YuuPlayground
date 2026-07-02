export type DirectoryBasePaths = 'user://worlds' | 'user://profile' | 'vm' | 'user://templates';

let vmFolderPath = '';

export function getBaseDirPath(baseDirPath: DirectoryBasePaths): string {
  if (baseDirPath === 'vm') {
    if (vmFolderPath === '') {
      vmFolderPath = Godot.files.folder.getVMPath();
    }
    
    return vmFolderPath;
  }
  else {
    return baseDirPath;
  }
}

export function combineBaseAndSubPaths(baseDirPath: DirectoryBasePaths, subDirPath: string): string {
  let dirPath = getBaseDirPath(baseDirPath);

  if (subDirPath.length > 0 && subDirPath.charAt(0) !== '/') {
    dirPath += '/';
  }

  dirPath += subDirPath;

  return dirPath;
}
