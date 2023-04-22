const { generateEncryptionKey } = require("./module");

describe("generateEncryptionKey", () => {
  test("should return a string of length 32", () => {
    const key = generateEncryptionKey();
    expect(key).toHaveLength(32);
  });

  test("should only contain alphanumeric characters", () => {
    const key = generateEncryptionKey();
    expect(key).toMatch(/^[A-Za-z0-9]+$/);
  });

  test("should return a different key each time it is called", () => {
    const key1 = generateEncryptionKey();
    const key2 = generateEncryptionKey();
    expect(key1).not.toEqual(key2);
  });

  test("should handle possibleChars with length 1", () => {
    const possibleChars = "a";
    const key = generateEncryptionKey(possibleChars);
    expect(key).toEqual("a".repeat(32));
  });

  test("should handle possibleChars with length 0", () => {
    const possibleChars = "";
    const key = generateEncryptionKey(possibleChars);
    expect(key).toEqual("");
  });

  test("should handle possibleChars with length greater than 64", () => {
    const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[]|\\;:'\",./<>?";
    const key = generateEncryptionKey(possibleChars);
    expect(key).toMatch(/^[A-Za-z0-9!@#$%^&*()_+\-={}[\]|\\;:'",./<>?]+$/);
    expect(key).toHaveLength(32);
  });
});