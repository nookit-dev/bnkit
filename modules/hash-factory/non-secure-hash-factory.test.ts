import { describe, expect, test } from "bun:test";
import type { NonSecureHashAlgorithm } from "./non-secure-hash-factory";
import { createNonSecureHashFactory } from "./non-secure-hash-factory";

describe("createNonSecureHashFactory", () => {
  const nonSecureHashService = createNonSecureHashFactory();
  const testData = "some data";
  const testSeed = 12345;

  test("hash generates a hash value", () => {
    const result = nonSecureHashService.hash(testData);
    expect(result).toBeDefined();
    expect(typeof result).toBe("number");
  });

  test("hash generates different hash values with different seeds", () => {
    const result1 = nonSecureHashService.hash(testData, testSeed);
    const result2 = nonSecureHashService.hash(testData, testSeed + 1);
    expect(result1).not.toEqual(result2);
  });

  const testAlgorithms: NonSecureHashAlgorithm[] = [
    "wyhash",
    "crc32",
    "adler32",
    "cityHash32",
    "cityHash64",
    "murmur32v3",
    "murmur64v2",
  ];

  testAlgorithms.forEach((algorithm) => {
    test(`hashWithAlgorithm generates a hash value using '${algorithm}' algorithm`, () => {
      const result = nonSecureHashService.hashWithAlgorithm(
        algorithm,
        testData
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe("number");
    });

    test(`hashWithAlgorithm generates different hash values with different seeds using '${algorithm}' algorithm`, () => {
      const result1 = nonSecureHashService.hashWithAlgorithm(
        algorithm,
        testData,
        testSeed
      );
      const result2 = nonSecureHashService.hashWithAlgorithm(
        algorithm,
        testData,
        testSeed + 50
      );
      expect(result1).not.toEqual(result2);
    });
  });
});
