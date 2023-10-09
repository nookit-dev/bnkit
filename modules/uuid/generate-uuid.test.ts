import { beforeAll, describe, expect, jest, test } from "bun:test";
import {
    formatClockSeq,
    formatNode,
    formatTimeHighAndVersion,
    formatTimeLow,
    formatTimeMid,
    generateUuid,
    generateUuidV6,
    generateUuidV7,
    generateUuidV8,
    getRandomClockSeq,
    getRandomNode,
    getRandomValues,
    getTimestampForV6,
    getTimestampForV7,
} from "./generate-uuid"; // Update this with your actual file name

describe("UUID Generation Functions", () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1627524478387);
    Math.random = jest.fn(() => 0.123456789);
  });

  test("getTimestampForV6 returns a predictable bigint", () => {
    const MOCK_TIMESTAMP = 1627524478387;
    Date.now = jest.fn(() => MOCK_TIMESTAMP);

    const expectedTimestamp =
      BigInt(MOCK_TIMESTAMP) * BigInt(10000) + BigInt(0x01b21dd213814000);

    expect(getTimestampForV6()).toBe(expectedTimestamp);
  });

  test("getRandomClockSeq returns a predictable bigint", () => {
    Math.random = jest.fn(() => 1);
    expect(getRandomClockSeq()).toBe(BigInt(0x3fff)); // If you expect the max value
  });

  test("getTimestampForV6 returns a bigint", () => {
    expect(typeof getTimestampForV6()).toBe("bigint");
  });

  test("getTimestampForV7 returns a bigint", () => {
    expect(typeof getTimestampForV7()).toBe("bigint");
  });

  test("getRandomClockSeq returns a bigint", () => {
    expect(typeof getRandomClockSeq()).toBe("bigint");
  });

  test("getRandomNode returns a bigint", () => {
    expect(typeof getRandomNode()).toBe("bigint");
  });

  test("getRandomValues returns a bigint", () => {
    expect(typeof getRandomValues()).toBe("bigint");
  });

  // failing
  test("formatTimeLow truncates correctly", () => {
    expect(formatTimeLow(BigInt("0x123456789abcdef0"))).toBe("9abcdef0");
  });

  test("formatTimeLow pads correctly", () => {
    expect(formatTimeLow(BigInt("0x1f"))).toBe("0000001f");
  });

  test("formatTimeLow returns a string of length 8", () => {
    expect(formatTimeLow(BigInt(12345678901234))).toHaveLength(8);
  });

  test("formatTimeMid returns a string of length 4", () => {
    expect(formatTimeMid(BigInt(12345678901234))).toHaveLength(4);
  });

  test("formatTimeHighAndVersion returns a string of length 4", () => {
    expect(
      formatTimeHighAndVersion(BigInt(12345678901234), BigInt(6))
    ).toHaveLength(4);
  });

  test("formatClockSeq returns a string of length 4", () => {
    expect(formatClockSeq(BigInt(12345678901234))).toHaveLength(4);
  });

  test("formatNode returns a string of length 12", () => {
    expect(formatNode(BigInt(12345678901234))).toHaveLength(12);
  });

  test("generateUuidV6 returns a UUID string of length 32", () => {
    expect(generateUuidV6()).toHaveLength(32);
  });

  test("generateUuidV7 returns a UUID string of length 32", () => {
    expect(generateUuidV7()).toHaveLength(32);
  });

  test("generateUuidV8 returns a UUID string of length 32", () => {
    const customData = [
      BigInt(0x123456789abc),
      BigInt(0x123),
      BigInt(0x3fffffffffffffff),
    ];
    expect(generateUuidV8(customData)).toHaveLength(32);
  });

  test("generateUuid returns a UUID string of length 32 for 6, 7, and 8", () => {
    expect(generateUuid(6)).toHaveLength(32);
    expect(generateUuid(7)).toHaveLength(32);
    expect(generateUuid(8)).toHaveLength(32);
  });

  test("generateUuid returns a UUID string of length 32 with custom data", () => {
    const customData: bigint[] = [
      BigInt(0x123456789abc),
      BigInt(0x123),
      BigInt(0x3fffffffff),
    ];

    expect(generateUuid(8, customData)).toHaveLength(32);
  });

  test("generateUuid throws an error for invalid UUIDv8 input", () => {
    expect(() =>
      generateUuid(8, [BigInt(0x123456789abc), BigInt(0x123)])
    ).toThrow("Invalid custom data for UUIDv8 must be 3 bigints");
  });
});
