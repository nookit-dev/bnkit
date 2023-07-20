// ✗ createNonSecureHashFactory > hashWithAlgorithm generates different hash values with different seeds using 'crc32' algorithm [0.19ms]
// ✗ createNonSecureHashFactory > hashWithAlgorithm generates different hash values with different seeds using 'adler32' algorithm [0.09ms]
// ✗ createNonSecureHashFactory > hashWithAlgorithm generates different hash values with different seeds using 'cityHash32' algorithm [0.09ms]

// seeding doesn't seem to be working correctly with the above algorithms
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
    data: string | ArrayBuffer | SharedArrayBuffer,
    seed?: number
  ) => {
    return Bun.hash[algorithm](data, seed);
  };

  return {
    hash,
    hashWithAlgorithm,
  };
}
