export type NonSecureHashAlgorithm =
  | "wyhash"
  | "crc32"
  | "adler32"
  | "cityHash32"
  | "cityHash64"
  | "murmur32v3"
  | "murmur64v2";

export function createNonSecureHashFactory() {
  const hash = (
    data: string | ArrayBuffer | SharedArrayBuffer,
    seed?: number
  ) => {
    return Bun.hash(data, seed);
  };

  const hashWithAlgorithm = (
    algorithm: NonSecureHashAlgorithm,
    data: string | ArrayBuffer | SharedArrayBuffer
  ) => {
    return Bun.hash[algorithm](data);
  };

  return {
    hash,
    hashWithAlgorithm,
  };
}
