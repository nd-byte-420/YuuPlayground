

export const Crypto = {
  generateRandomV4UUID,
  generateRandomBytes,
  getSHA256Hash,
}


/**
 * Generate a cryptographically secure v4 UUID using the format 4-2-2-2-6: "00000000-0000-0000-0000-00000000000"
 * @returns string UUID, if there is an error an empty string is returned
 */
function generateRandomV4UUID(): string {
  return Godot.crypto.generateRandomV4UUID() ?? '';
}

/**
 * Generate an array of cryptographically secure bytes
 * @param amount of bytes to generate
 * @returns Uint8Array byte array, if there is an error, an empty array is returned
 */
function generateRandomBytes(amount: number): Uint8Array {
  const buffer = Godot.crypto.generateRandomBytes(amount);

  return buffer ? new Uint8Array(buffer) : new Uint8Array();
}

/**
 * Get the SHA-256 hash of a string
 * @param content to hash
 * @returns string
 */
function getSHA256Hash(content: string): string {
  return Godot.crypto.getSHA256Hash(content);
}