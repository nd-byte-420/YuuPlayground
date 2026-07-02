import { Files, DirectoryBasePaths } from "./Files";
import { inflateSync } from "./zlib";
import { Color } from "./Basic Types/Color";
import { Vector2 } from "./Basic Types/Vector2";
import { Texture } from "./Texture";

export class PNGDecoder {
  private data: Uint8Array;
  private pos: number = 0;

  private width: number = 0;
  private height: number = 0;
  private bitDepth: number = 0;
  private colorType: number = 0;
  private palette: Uint8Array | null = null;
  private trns: Uint8Array | null = null;

  constructor(data: Uint8Array) {
    this.data = data;
  }

  private readByte(): number {
    if (this.pos >= this.data.length) throw new Error("EOF");
    return this.data[this.pos++];
  }

  private readUInt32(): number {
    const b1 = this.readByte();
    const b2 = this.readByte();
    const b3 = this.readByte();
    const b4 = this.readByte();
    return ((b1 << 24) | (b2 << 16) | (b3 << 8) | b4) >>> 0;
  }

  private readBytes(length: number): Uint8Array {
    if (this.pos + length > this.data.length) throw new Error("EOF");
    const res = this.data.subarray(this.pos, this.pos + length);
    this.pos += length;
    return res;
  }

  decode(): { width: number, height: number, pixels: Uint8Array } {
    // 1. Signature
    const sig = this.readBytes(8);
    const expectedSig = [137, 80, 78, 71, 13, 10, 26, 10];
    for (let i = 0; i < 8; i++) {
      if (sig[i] !== expectedSig[i]) throw new Error("Invalid PNG signature");
    }

    let idatBuffers: Uint8Array[] = [];

    // 2. Chunks
    while (this.pos < this.data.length) {
      const length = this.readUInt32();
      const type = String.fromCharCode(...this.readBytes(4));
      const chunkData = this.readBytes(length);
      const crc = this.readUInt32(); // read and ignore CRC

      if (type === "IHDR") {
        this.width = ((chunkData[0] << 24) | (chunkData[1] << 16) | (chunkData[2] << 8) | chunkData[3]) >>> 0;
        this.height = ((chunkData[4] << 24) | (chunkData[5] << 16) | (chunkData[6] << 8) | chunkData[7]) >>> 0;
        this.bitDepth = chunkData[8];
        this.colorType = chunkData[9];
        
        const compression = chunkData[10];
        const filter = chunkData[11];
        const interlace = chunkData[12];

        if (this.bitDepth !== 8) throw new Error(`Only 8-bit depth is supported. Got: ${this.bitDepth}`);
        if (compression !== 0) throw new Error("Only compression method 0 is supported");
        if (filter !== 0) throw new Error("Only filter method 0 is supported");
        if (interlace !== 0) throw new Error("Interlacing is not supported");
      } else if (type === "PLTE") {
        this.palette = chunkData;
      } else if (type === "tRNS") {
        this.trns = chunkData;
      } else if (type === "IDAT") {
        idatBuffers.push(chunkData);
      } else if (type === "IEND") {
        break;
      }
    }

    if (idatBuffers.length === 0) throw new Error("No IDAT chunks found");

    // Concatenate IDAT chunks
    let totalLen = 0;
    for (const buf of idatBuffers) totalLen += buf.length;
    const idatConcat = new Uint8Array(totalLen);
    let offset = 0;
    for (const buf of idatBuffers) {
      idatConcat.set(buf, offset);
      offset += buf.length;
    }

    // Decompress using zlib
    const decompressed = inflateSync(idatConcat);

    // Defilter scanlines
    const bpp = this.getBytesPerPixel();
    const rowBytes = 1 + this.width * bpp;
    if (decompressed.length < this.height * rowBytes) {
      throw new Error(`Decompressed data too short. Expected ${this.height * rowBytes}, got ${decompressed.length}`);
    }

    const unfiltered = new Uint8Array(this.width * this.height * 4); // Output RGBA8
    
    // Paeth Predictor
    const paethPredictor = (a: number, b: number, c: number): number => {
      const p = a + b - c;
      const pa = Math.abs(p - a);
      const pb = Math.abs(p - b);
      const pc = Math.abs(p - c);
      if (pa <= pb && pa <= pc) return a;
      else if (pb <= pc) return b;
      return c;
    };

    let decompressedOffset = 0;
    const priorRow = new Uint8Array(this.width * bpp);
    const currentRow = new Uint8Array(this.width * bpp);

    for (let y = 0; y < this.height; y++) {
      const filterType = decompressed[decompressedOffset++];
      
      for (let x = 0; x < this.width * bpp; x++) {
        const raw = decompressed[decompressedOffset++];
        
        let a = 0; // left
        if (x >= bpp) {
          a = currentRow[x - bpp];
        }
        
        let b = priorRow[x]; // up
        
        let c = 0; // up-left
        if (x >= bpp) {
          c = priorRow[x - bpp];
        }

        let val = 0;
        if (filterType === 0) {
          val = raw;
        } else if (filterType === 1) {
          val = (raw + a) & 0xff;
        } else if (filterType === 2) {
          val = (raw + b) & 0xff;
        } else if (filterType === 3) {
          val = (raw + Math.floor((a + b) / 2)) & 0xff;
        } else if (filterType === 4) {
          val = (raw + paethPredictor(a, b, c)) & 0xff;
        } else {
          throw new Error(`Unknown filter type: ${filterType}`);
        }
        
        currentRow[x] = val;
      }

      // Convert current row to RGBA8 output
      for (let x = 0; x < this.width; x++) {
        const outIdx = (this.width * y + x) * 4;
        
        if (this.colorType === 6) { // RGBA
          const idx = x * 4;
          unfiltered[outIdx] = currentRow[idx];
          unfiltered[outIdx + 1] = currentRow[idx + 1];
          unfiltered[outIdx + 2] = currentRow[idx + 2];
          unfiltered[outIdx + 3] = currentRow[idx + 3];
        } else if (this.colorType === 2) { // RGB
          const idx = x * 3;
          unfiltered[outIdx] = currentRow[idx];
          unfiltered[outIdx + 1] = currentRow[idx + 1];
          unfiltered[outIdx + 2] = currentRow[idx + 2];
          unfiltered[outIdx + 3] = 255;
        } else if (this.colorType === 3) { // Indexed
          const idx = currentRow[x];
          if (!this.palette) throw new Error("Missing palette");
          unfiltered[outIdx] = this.palette[idx * 3];
          unfiltered[outIdx + 1] = this.palette[idx * 3 + 1];
          unfiltered[outIdx + 2] = this.palette[idx * 3 + 2];
          let alpha = 255;
          if (this.trns && idx < this.trns.length) {
            alpha = this.trns[idx];
          }
          unfiltered[outIdx + 3] = alpha;
        } else if (this.colorType === 0) { // Grayscale
          const idx = x;
          const val = currentRow[idx];
          unfiltered[outIdx] = val;
          unfiltered[outIdx + 1] = val;
          unfiltered[outIdx + 2] = val;
          unfiltered[outIdx + 3] = 255;
        } else if (this.colorType === 4) { // Grayscale + Alpha
          const idx = x * 2;
          const val = currentRow[idx];
          unfiltered[outIdx] = val;
          unfiltered[outIdx + 1] = val;
          unfiltered[outIdx + 2] = val;
          unfiltered[outIdx + 3] = currentRow[idx + 1];
        }
      }

      priorRow.set(currentRow);
    }

    return { width: this.width, height: this.height, pixels: unfiltered };
  }

  private getBytesPerPixel(): number {
    if (this.colorType === 0) return 1; // Grayscale
    if (this.colorType === 2) return 3; // RGB
    if (this.colorType === 3) return 1; // Indexed
    if (this.colorType === 4) return 2; // Grayscale+Alpha
    if (this.colorType === 6) return 4; // RGBA
    throw new Error(`Unsupported color type: ${this.colorType}`);
  }
}

function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/\s/g, "");
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

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


