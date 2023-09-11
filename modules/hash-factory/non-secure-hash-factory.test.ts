import { describe, expect, test } from "bun:test";
import { createNonSecureHashFactory } from "./non-secure-hash-factory";

describe("NonSecureHashFactory", () => {
  const factory = createNonSecureHashFactory();

  describe("hash function", () => {
    test("should hash string input", () => {
      const input = "test";
      const hashedValue = factory.hash(input);

      expect(typeof hashedValue).toBe("bigint"); // assuming wyhash returns bigint
    });

    test("should hash ArrayBuffer input", () => {
      const buffer = new ArrayBuffer(8);
      const hashedValue = factory.hash(buffer);

      expect(typeof hashedValue).toBe("bigint");
    });

    test("should hash with a provided seed", () => {
      const input = "test";
      const seed = 1234;
      const hashedValueWithSeed = factory.hash(input, seed);
      const hashedValueWithoutSeed = factory.hash(input);

      expect(hashedValueWithSeed).not.toEqual(hashedValueWithoutSeed);
    });
  });

  describe("hashWithAlgorithm function", () => {
    test.each([
      ["wyhash", "test"],
      ["crc32", new ArrayBuffer(8)],
      ["adler32", "another test"],
      //... add other algorithms and data samples
    ])(
      "should hash using the %s algorithm with provided data",
      (algorithm, data) => {
        const hashedValue = factory.hashWithAlgorithm(algorithm, data);

        expect(hashedValue).toBeDefined();
      }
    );

    test("should throw error for an unsupported algorithm", () => {
      expect(() => {
        factory.hashWithAlgorithm("unsupportedAlgorithm", "test");
      }).toThrow();
    });
  });
});
