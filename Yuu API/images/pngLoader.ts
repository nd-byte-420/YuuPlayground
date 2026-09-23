import { Files, type DirectoryBasePaths } from "../files/index";
import { Texture } from "./Texture";
import { PNGDecoder, hexToBytes } from "./pngDecoder";
import { Color } from "../Basic Types/Color";
import { Vector2 } from "../Basic Types/Vector2";

export function loadPNGToTexture(baseDirPath: DirectoryBasePaths, subDirPath: string, fileName: string): Texture | undefined {
  console.log(`loadPNGToTexture: Loading hex text file ${fileName}.txt from base=${baseDirPath}, sub=${subDirPath}`);
  const content = Files.text.get(baseDirPath, subDirPath, fileName, ".txt");
  if (!content) {
    console.log(`loadPNGToTexture: Files.text.get returned undefined or empty for ${fileName}.txt`);
    return undefined;
  }

  console.log(`loadPNGToTexture: File read successful. Length: ${content.length} characters.`);
  
  let bytes: Uint8Array;
  try {
    bytes = hexToBytes(content);
    console.log(`loadPNGToTexture: Hex decode successful. Decoded length: ${bytes.length} bytes.`);
  } catch (err: any) {
    console.log(`loadPNGToTexture: Hex decode failed: ${err.message || err}`);
    return undefined;
  }

  try {
    const decoder = new PNGDecoder(bytes);
    const { width, height, pixels } = decoder.decode();

    console.log(`loadPNGToTexture: Decode successful. Dimensions: ${width}x${height}`);

    const texture = new Texture(width, height);
    
    // Group pixels by color for optimized batch updates
    const colorGroups = new Map<string, Vector2[]>();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) * 4;
        const r = pixels[idx] / 255;
        const g = pixels[idx + 1] / 255;
        const b = pixels[idx + 2] / 255;
        const a = pixels[idx + 3] / 255;

        const key = `${r.toFixed(4)},${g.toFixed(4)},${b.toFixed(4)},${a.toFixed(4)}`;

        if (!colorGroups.has(key)) {
          colorGroups.set(key, []);
        }
        colorGroups.get(key)!.push(new Vector2(x, y));
      }
    }

    texture.fillWithColor(Color.black, 1);

    for (const [colorStr, points] of colorGroups.entries()) {
      const [r, g, b, a] = colorStr.split(',').map(Number);
      texture.setPixelsColor(points, new Color(r, g, b), a);
    }

    texture.updateTexture();
    console.log(`loadPNGToTexture: Texture update complete.`);
    return texture;
  } catch (err: any) {
    console.log("Error loading PNG texture:", err.message || err);
    return undefined;
  }
}
