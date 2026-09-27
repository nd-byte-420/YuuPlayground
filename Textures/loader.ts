import { Texture } from "../Yuu API/Texture";
import { Entity } from "../Yuu API/Entity";
import { Vector2 } from "../Yuu API/Basic Types/Vector2";
import { Color } from "../Yuu API/Basic Types/Color";
import { PNGDecoder, hexToBytes } from "./pngDecoder";

export type LoadablePNG = {
  base: string;
  sub: string;
  name: string; // e.g. 'footpath_png'
  displayName: string; // e.g. 'footpath.png'
};

// Cached textures to prevent redundant re-decoding
const textureCache = new Map<string, Texture>();

/**
 * Resolves base directory path, translating 'vm' to the Godot VM folder path if available.
 */
function getBaseDirPath(baseDirPath: string): string {
  if (baseDirPath === 'vm') {
    try {
      const vmPath = (Godot.files.folder as any).getVMPath?.();
      if (vmPath) return vmPath;
    } catch {
      // ignore
    }
    return '';
  }
  return baseDirPath;
}

/**
 * Combines base directory path and sub directory path.
 */
function combineBaseAndSubPaths(baseDirPath: string, subDirPath: string): string {
  let dirPath = getBaseDirPath(baseDirPath);

  if (subDirPath && subDirPath.length > 0) {
    if (dirPath.length > 0 && !dirPath.endsWith('/') && !subDirPath.startsWith('/')) {
      dirPath += '/';
    }
    dirPath += subDirPath;
  }

  return dirPath;
}

/**
 * Reads a text file from the Godot file system.
 */
function getTextFile(baseDirPath: string, subDirPath: string, fileName: string, fileExtension: string = '.txt'): string | undefined {
  const dirPath = combineBaseAndSubPaths(baseDirPath, subDirPath);
  try {
    return Godot.files.text.get(dirPath, fileName, fileExtension);
  } catch (err: any) {
    console.log(`Failed to read text file ${dirPath}/${fileName}${fileExtension}: ${err.message || err}`);
    return undefined;
  }
}

/**
 * Searches the file system for any text files ending in '_png' (hex-encoded PNGs).
 */
export function findLoadablePNGs(): LoadablePNG[] {
  const list: LoadablePNG[] = [];
  const searchBases: string[] = ['vm', 'user://templates', 'user://worlds'];

  for (const base of searchBases) {
    try {
      const basePath = getBaseDirPath(base);
      if (!basePath && base === 'vm') continue;
      
      const files = Godot.files.folder.getContents(basePath, true) || [];
      for (const f of files) {
        const dirPath = f[0];
        const name = f[1];
        const ext = f[2];
        if (ext && ext.toLowerCase() === 'txt' && name.toLowerCase().endsWith('_png')) {
          let sub = '';
          if (dirPath.startsWith(basePath)) {
            sub = dirPath.substring(basePath.length);
          } else {
            sub = dirPath;
          }

          const cleanName = name.substring(0, name.length - 4); // Remove '_png'
          list.push({
            base,
            sub,
            name,
            displayName: `${cleanName}.png`
          });
        }
      }
    } catch (e: any) {
      console.log(`Failed listing files in ${base}: ${e.message}`);
    }
  }
  return list;
}

/**
 * Loads a hex-encoded PNG text file from the file system, decodes it, and returns a Texture.
 * @param baseDirPath Base directory ('vm', 'user://worlds', 'user://templates', etc.)
 * @param subDirPath Subdirectory inside baseDirPath (e.g. '', 'Textures', 'Textures/files')
 * @param fileName Name of the file without extension (e.g. 'footpath_png')
 */
export function loadPNGToTexture(baseDirPath: string, subDirPath: string, fileName: string): Texture | undefined {
  const cacheKey = `${baseDirPath}::${subDirPath}::${fileName}`;
  const cached = textureCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  console.log(`loadPNGToTexture: Loading ${fileName}.txt from base=${baseDirPath}, sub=${subDirPath}`);
  const content = getTextFile(baseDirPath, subDirPath, fileName, ".txt");
  if (!content) {
    console.log(`loadPNGToTexture: File not found or empty: ${fileName}.txt`);
    return undefined;
  }

  let bytes: Uint8Array;
  try {
    bytes = hexToBytes(content);
  } catch (err: any) {
    console.log(`loadPNGToTexture: Hex decode failed: ${err.message || err}`);
    return undefined;
  }

  try {
    const decoder = new PNGDecoder(bytes);
    const { width, height, pixels } = decoder.decode();

    const texture = new Texture(width, height);

    // Group pixels by color for optimized batch update
    const colorGroups = new Map<string, Vector2[]>();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) * 4;
        const r = pixels[idx] / 255;
        const g = pixels[idx + 1] / 255;
        const b = pixels[idx + 2] / 255;
        const a = pixels[idx + 3] / 255;

        const key = `${r.toFixed(4)},${g.toFixed(4)},${b.toFixed(4)},${a.toFixed(4)}`;

        let group = colorGroups.get(key);
        if (!group) {
          group = [];
          colorGroups.set(key, group);
        }
        group.push(new Vector2(x, y));
      }
    }

    texture.fillWithColor(Color.black, 1);

    for (const [colorStr, points] of colorGroups.entries()) {
      const [r, g, b, a] = colorStr.split(',').map(Number);
      texture.setPixelsColor(points, new Color(r, g, b), a);
    }

    texture.updateTexture();
    textureCache.set(cacheKey, texture);
    console.log(`loadPNGToTexture: Successfully loaded ${fileName} (${width}x${height})`);
    return texture;
  } catch (err: any) {
    console.log("Error loading PNG texture:", err.message || err);
    return undefined;
  }
}

/**
 * Convenience function to search for and load a texture by simple name (e.g. 'footpath' or 'footpath.png').
 */
export function loadTextureByName(name: string): Texture | undefined {
  const cleanName = name.replace(/\.png$/i, '').replace(/_png$/i, '');
  const fileName = `${cleanName}_png`;

  // Check cache with clean name first
  for (const [key, tex] of textureCache.entries()) {
    if (key.endsWith(`::${fileName}`)) {
      return tex;
    }
  }

  // Search through loadable PNGs in the filesystem
  const loadables = findLoadablePNGs();
  const match = loadables.find(l => l.name === fileName || l.displayName.toLowerCase() === `${cleanName}.png`.toLowerCase());
  if (match) {
    return loadPNGToTexture(match.base, match.sub, match.name);
  }

  // Fallback search in standard directories
  const candidateBases = [
    { base: 'vm', sub: '' },
    { base: 'vm', sub: 'Textures' },
    { base: 'vm', sub: 'Textures/files' },
    { base: 'user://worlds', sub: '' },
    { base: 'user://templates', sub: '' },
    { base: '', sub: '' },
    { base: '', sub: 'Textures' },
    { base: '', sub: 'Textures/files' },
  ];

  for (const candidate of candidateBases) {
    const tex = loadPNGToTexture(candidate.base, candidate.sub, fileName);
    if (tex) return tex;
  }

  console.log(`loadTextureByName: Unable to find texture matching '${name}'`);
  return undefined;
}

/**
 * Applies a texture (loaded from file, cache, or passed directly) to an Entity node's mesh.
 * @param entity The Entity node whose mesh texture should be set
 * @param source A LoadablePNG descriptor, a Texture object, or a texture name string (e.g. 'footpath')
 * @param useMipMaps Whether to enable mipmaps (default: false)
 */
export function applyTextureToEntity(
  entity: Entity,
  source: LoadablePNG | Texture | string,
  useMipMaps: boolean = false
): Texture | undefined {
  if (!entity || !entity.mesh) {
    console.log("applyTextureToEntity: Entity or entity mesh is undefined");
    return undefined;
  }

  let texture: Texture | undefined;

  if (source instanceof Texture) {
    texture = source;
  } else if (typeof source === 'string') {
    texture = loadTextureByName(source);
  } else if (typeof source === 'object' && source && 'base' in source) {
    texture = loadPNGToTexture(source.base, source.sub, source.name);
  }

  if (texture) {
    entity.mesh.texture.set(texture, useMipMaps);
    return texture;
  }

  console.log(`applyTextureToEntity: Failed to apply texture for:`, source);
  return undefined;
}
