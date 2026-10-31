import { Async } from "./Async";
import { Crypto } from "./Crypto";
import { WatchProgress } from "./WatchProgress";


export const Files = {
  exists: doesFileExist,
  text: {
    create: createTextFile,
    update: updateTextFile,
    get: getTextFile,
    duplicate: duplicateTextFile,
  },
  folder: {
    exists: doesFolderExist,
    create: createFolder,
    delete: deleteFolder,
    deleteContents: deleteFolderContents,
    getContents: getFolderContents,
  },
  transpileTS: {
    folderToFolder: transpileTSFolderToJSFolderOptimized,

    queue: {
      addFileTask: transpileTSQueueAddFileTask,
      start: Godot.files.transpileTS.queue.start,

      isCompleted: Godot.files.transpileTS.queue.isCompleted,
      filesRemaining: Godot.files.transpileTS.queue.filesRemaining,
    },
  },
  zip: {
    compressFolder: compressFolderToZip,
    extractFiles: extractFilesFromZip,
  },
  utils: {
    combineBaseAndSubPaths,
  },
}


/**
 * Options used to select where a file will be saved (a few examples for now)
 * Eventually we need to consider how to make this into an accessible file system like on a desktop OS
 * - 'user://worlds' a place where the vm and world files are stored
 * - 'user://profile' a place to save user settings into
 * - 'user://assets' a place to save user assets into
 * - 'user://cache' a place to save data that is used across all worlds and speeds up processing but can be deleted without breaking anything
 * - 'vm' uses the path of the current vm
 *  */
export type DirectoryBasePaths = 'user://worlds' | 'user://profile' | 'user://assets' | 'user://cache' | 'vm';

type FilePath = { baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string };


let vmFolderPath = '';

function getBaseDirPath(baseDirPath: DirectoryBasePaths): string {
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


/**
 * Check if a file exists
 * @param baseDirPath all files must be stored in one of these base directories
 * @param subDirPathToFile path to the file from the base directory, inclusive of the file name and extension
 * @returns boolean true if it exists
 */
function doesFileExist(baseDirPath: DirectoryBasePaths, subDirPathToFile: string) {
  return Godot.files.exists(combineBaseAndSubPaths(baseDirPath, subDirPathToFile));
}

/**
 * Check if a folder exists
 * @param baseDirPath all files must be stored in one of these base directories
 * @param subDirPath path to the folder from the base directory
 * @returns boolean true if it exists
 */
function doesFolderExist(baseDirPath: DirectoryBasePaths, subDirPath: string) {
  return Godot.files.folder.exists(combineBaseAndSubPaths(baseDirPath, subDirPath));
}


/**
 * Create a text file (overwrites if it already exists)
 * @param baseDirPath all files must be stored in one of these base directories
 * @param subDirPath optional sub directory, can be left empty, ie '', otherwise formatted 'folder name' or '/folder name'
 * @param fileName to save the text to
 * @param fileExtension to append at the end of the text file, ie. '.json' or '.txt'
 * @param content to save into the text file
 */
function createTextFile(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string, content: string) {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);

  Godot.files.text.create(dirPath, fileName, fileExtension, content);
}

/**
 * Update a text file (creates a file if it doesn't already exist)
 * @param baseDirPath all files must be stored in one of these base directories
 * @param subDirPath optional sub directory, can be left empty, ie '', otherwise formatted 'folder name' or '/folder name'
 * @param fileName to save the text to
 * @param fileExtension to append at the end of the text file, ie. '.json' or '.txt'
 * @param content to save into the text file
 */
function updateTextFile(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string, content: string) {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);

  Godot.files.text.update(dirPath, fileName, fileExtension, content);
}

/**
 * Get the contents of a text file
 * @param baseDirPath all files are stored in one of these base directories
 * @param subDirPath optional sub directory, can be left empty, ie '', otherwise formatted 'folder name' or '/folder name'
 * @param fileName to get
 * @param fileExtension ie. '.txt'
 * @returns string contents, or undefined if unsuccessful
 */
function getTextFile(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string, fileExtension: string): string | undefined {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);

  return Godot.files.text.get(dirPath, fileName, fileExtension);
}

function duplicateTextFile(fileToDuplicate: FilePath, saveToPath: FilePath) {
  const contents = Files.text.get(fileToDuplicate.baseDirPath, fileToDuplicate.subDirPath, fileToDuplicate.fileName, fileToDuplicate.fileExtension);

  if (contents) {
    Files.text.create(saveToPath.baseDirPath, saveToPath.subDirPath, saveToPath.fileName, saveToPath.fileExtension, contents);
  }
}


function createFolder(baseDirPath: DirectoryBasePaths, subDirPath: string) {
  Godot.files.folder.create(combineBaseAndSubPaths(baseDirPath, subDirPath));
}

function deleteFolder(baseDirPath: DirectoryBasePaths, subDirPath: string) {
  Godot.files.folder.delete(combineBaseAndSubPaths(baseDirPath, subDirPath));
}

function deleteFolderContents(baseDirPath: DirectoryBasePaths, subDirPath: string) {
  deleteFolder(baseDirPath, subDirPath);
  createFolder(baseDirPath, subDirPath);
}

/**
 * Get the contents of a dirPath
 * @param baseDirPath all files are stored in one of these base directories
 * @param subDirPath to get contents of
 * @param isRecursive if true will return contents of sub folders as well
 * @returns array of [directory path, file/folder name, file extension, "?" if no extension, or "" empty string for folders]
 */
function getFolderContents(baseDirPath: DirectoryBasePaths, subDirPath: string, isRecursive: boolean): [string, string, string][] {
  return Godot.files.folder.getContents(combineBaseAndSubPaths(baseDirPath, subDirPath), isRecursive);
}

/**
 * Transpile TS Files to JS, runs async, use areTSFilesTranspiled to check when it is completed
 * @param baseDirPathToTranspile folder to transpile
 * @param subDirPathToTranspile folder to transpile
 * @param baseSaveToDirPath folder to store js files into
 * @param subSaveToDirPath folder to store js files into
 * @returns boolean true if successfully queued
 */
function transpileTSFolderToJSFolder(baseDirPathToTranspile: DirectoryBasePaths, subDirPathToTranspile: string, baseSaveToDirPath: DirectoryBasePaths, subSaveToDirPath: string): boolean {
  return Godot.files.transpileTS.folderToFolder(combineBaseAndSubPaths(baseDirPathToTranspile, subDirPathToTranspile), combineBaseAndSubPaths(baseSaveToDirPath, subSaveToDirPath));
}


type JSHashMapData = {
  fileName: string,
  lastAccessedMs: number,
}

type JSHashCache = {
  hashMap: Map<string, JSHashMapData>,
}

const jsHashCache: JSHashCache = { hashMap: new Map<string, JSHashMapData>() };

if (!Files.exists('user://cache', 'js/HashCache.json')) {
  saveJSCacheMapFile();
}
else {
  const payload = Files.text.get('user://cache','js', 'HashCache', 'json');
  
  if (payload) {
    const data: JSHashCache = JSON.parse(payload);

    jsHashCache.hashMap = new Map(data.hashMap ?? []);
  }
}

function saveJSCacheMapFile() {
  const content = JSON.stringify({ hashMap: Array.from(jsHashCache.hashMap) });
  Files.text.create('user://cache', 'js', 'HashCache', 'json', content);
}


async function transpileTSFolderToJSFolderOptimized(baseDirPathToTranspile: DirectoryBasePaths, subDirPathToTranspile: string, baseSaveToDirPath: DirectoryBasePaths, subSaveToDirPath: string, progressWatcherFunction: undefined | ((progress: number) => void)): Promise<undefined> {
  const files = Files.folder.getContents(baseDirPathToTranspile, subDirPathToTranspile, true);

  const duplicateTextFileQueue: [FilePath, FilePath][] = [];

  files.forEach(([directoryPath, fileOrFolderName, extension]) => {
    if (extension === 'ts') {
      const isTypesFile = fileOrFolderName.toLowerCase().endsWith('.d');

      if (!isTypesFile) {
        if (directoryPath.startsWith(baseDirPathToTranspile)) {
          const subDirectoryPathOfFile = directoryPath.substring(baseDirPathToTranspile.length + 1);

          const contents = Files.text.get(baseDirPathToTranspile, subDirectoryPathOfFile, fileOrFolderName, 'ts');

          if (contents) {
            const contentsHash = Crypto.getSHA256Hash(contents);

            let hashCacheData: JSHashMapData | undefined = jsHashCache.hashMap.get(contentsHash);

            if (hashCacheData) {
              hashCacheData.lastAccessedMs = Date.now();
            }
            else {
              const cacheFileName = contentsHash + '_' + fileOrFolderName + '.js';

              hashCacheData = { fileName: cacheFileName, lastAccessedMs: Date.now() };
              jsHashCache.hashMap.set(contentsHash, hashCacheData);

              Files.transpileTS.queue.addFileTask('user://cache', 'js', cacheFileName, contents);

              // **Next Steps**

              // Seems to not have access to the Cache Map, or some other reason it compiles first but not second.
              // Slight headlock during file copy paste

              // Consider while we are at this, making the downloading of files async in C++ so that
              // we no longer get headlock. Just makes sense to fix that too.

              // How do we include the files transpiled by C++ when initializing the VM? Or do we not care ^^'

              // Does the copying step take any time and need to become async?
            }

            if (hashCacheData) {
              if (subDirectoryPathOfFile.startsWith(subDirPathToTranspile)) {
                const relativePath = subDirectoryPathOfFile.substring(subDirPathToTranspile.length + 1);

                const subDirectoryPathOfSaveLocation = combineDirectoryPaths(subSaveToDirPath, relativePath);

                duplicateTextFileQueue.push([{ baseDirPath: 'user://cache', subDirPath: 'js', fileName: hashCacheData.fileName, fileExtension: 'js' }, { baseDirPath: baseSaveToDirPath, subDirPath: subDirectoryPathOfSaveLocation, fileName: fileOrFolderName, fileExtension: 'js' }]);
              }
            }
          }

          // BUT a bigger problem is that the JS folder is deleted in a step prior to calling this function
          // Do we care about only deleting files that have changed? It technically is better for the SSD. But with
          // code files being so small it might be negligible (compared to something like a model/visual/audio asset)
        }
      }
    }
  });

  if (progressWatcherFunction !== undefined) {
    const startCount = Files.transpileTS.queue.filesRemaining();

    if (startCount !== 0) {
      WatchProgress.onUpdate(progressWatcherFunction, () => {
        const curCount = Files.transpileTS.queue.filesRemaining();
        return (startCount - curCount) / startCount;
      });
    }
    else {
      progressWatcherFunction(1);
    }
  }

  Files.transpileTS.queue.start();

  let i = 0;

  while (i < 500) {
    await Async.wait(100);

    if (Files.transpileTS.queue.isCompleted()) {
      i = 500;
    }

    i++;
  }

  duplicateTextFileQueue.forEach(([copyPath, pastePath]) => {
    Files.text.duplicate(copyPath, pastePath);
  });

  saveJSCacheMapFile();
}


/**
 * Compress the contents of a folder into a zip file at a specified location
 * @param baseDirPathToCompress folder to compress into a zip
 * @param subDirPathToCompress folder to compress into a zip
 * @param baseSaveZipToDirPath folder to save the zip file to
 * @param subSaveZipToDirPath folder to save the zip file to
 * @param zipFileName to use, without extension (ie. 'File_Name')
 * @returns boolean true if successful
 */
function compressFolderToZip(baseDirPathToCompress: DirectoryBasePaths, subDirPathToCompress: string, baseSaveZipToDirPath: DirectoryBasePaths, subSaveZipToDirPath: string, zipFileName: string): boolean {
  return Godot.files.zip.compressFolder(combineBaseAndSubPaths(baseDirPathToCompress, subDirPathToCompress), combineBaseAndSubPaths(baseSaveZipToDirPath, subSaveZipToDirPath), zipFileName);
}

/**
 * Extract files from a zip into a folder
 * @param baseDirPathOfZip to extract from, inclusive of extension (ie. user://worlds/folder_name/world_name.zip)
 * @param subDirPathOfZip to extract from, inclusive of extension (ie. user://worlds/folder_name/world_name.zip)
 * @param baseSaveDirPath location to save the uncompressed files to
 * @param subSaveDirPath location to save the uncompressed files to
 * @returns boolean true if successful
 */
function extractFilesFromZip(baseDirPathOfZip: DirectoryBasePaths, subDirPathOfZip: string, baseSaveDirPath: DirectoryBasePaths, subSaveDirPath: string): boolean {
  return Godot.files.zip.extractFiles(combineBaseAndSubPaths(baseDirPathOfZip, subDirPathOfZip), combineBaseAndSubPaths(baseSaveDirPath, subSaveDirPath));
}

/**
 * Add file to transpile queue
 * @param baseSaveDirPath to save the file to
 * @param subSaveDirPath to save the file to
 * @param fileName to be saved (without extension)
 * @param contents of the ts file to be transpiled to js
 */
function transpileTSQueueAddFileTask(baseSaveDirPath: DirectoryBasePaths, subSaveDirPath: string, fileName: string, contents: string) {
  Godot.files.transpileTS.queue.addFileTask(combineBaseAndSubPaths(baseSaveDirPath, subSaveDirPath), fileName, contents);
}


function combineBaseAndSubPaths(baseDirPath: DirectoryBasePaths, subDirPath: string): string {
  let dirPath = getBaseDirPath(baseDirPath);

  if (subDirPath.length > 0 && subDirPath.charAt(0) !== '/') {
    dirPath += '/';
  }

  dirPath += subDirPath;

  return dirPath;
}

/**
 * Does not work for `DirectoryBasePaths`
 * @param frontDirPath first part to combine
 * @param endDirPath last part to combine
 * @returns combined paths
 */
function combineDirectoryPaths(frontDirPath: string, endDirPath: string): string {
  let dirPath = frontDirPath;

  if (endDirPath.length > 0 && endDirPath.charAt(0) !== '/') {
    dirPath += '/';
  }

  dirPath += endDirPath;

  return dirPath;
}