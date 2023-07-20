import { describe, expect, test } from "bun:test";
import { createSecureHashFactory } from "./secure-hash-factory";

describe("createSecureHashFactory", () => {
  const secureHashService = createSecureHashFactory();
  const testPassword = "some-password";

  test("hashPassword hashes a password asynchronously", async () => {
    const hash = await secureHashService.hashPassword(testPassword);
    expect(hash).toBeDefined();
    expect(typeof hash).toBe("string");
  });

  test("verifyPassword verifies a password asynchronously", async () => {
    const hash = await secureHashService.hashPassword(testPassword);
    const isValid = await secureHashService.verifyPassword(testPassword, hash);
    expect(isValid).toBe(true);
  });

  test("hashPasswordSync hashes a password synchronously", () => {
    const hash = secureHashService.hashPasswordSync(testPassword);
    expect(hash).toBeDefined();
    expect(typeof hash).toBe("string");
  });

  test("verifyPasswordSync verifies a password synchronously", () => {
    const hash = secureHashService.hashPasswordSync(testPassword);
    const isValid = secureHashService.verifyPasswordSync(testPassword, hash);
    expect(isValid).toBe(true);
  });
});
