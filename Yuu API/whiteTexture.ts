import { Color } from "./Basic Types/Color";
import { Vector2 } from "./Basic Types/Vector2";
import { Texture } from "./Texture";

const colorData: [number, number, number, number, [number, number][]][] = JSON.parse("[]");

let cachedTexture: Texture | undefined;

/**
 * Returns a cached singleton Texture instance populated with the PNG image pixels.
 */
export function getWhiteTexture(): Texture {
  if (!cachedTexture) {
    cachedTexture = new Texture(32, 32);
    applyWhiteTexture(cachedTexture);
  }
  return cachedTexture;
}

/**
 * Applies the PNG texture colors to an existing Texture instance.
 */
export function applyWhiteTexture(texture: Texture) {
  // Clear/fill the texture with the dominant color
  texture.fillWithColor(new Color(0.9725, 0.9882, 0.9725), 1);

  for (const [r, g, b, a, pixels] of colorData) {
    texture.setPixelsColor(
      pixels.map(([x, y]) => new Vector2(x, y)),
      new Color(r, g, b),
      a
    );
  }

  texture.updateTexture();
}
