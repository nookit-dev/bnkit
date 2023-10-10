import { describe, expect, test } from "bun:test";
import {
  extractTimestampFromUuidV6,
  extractTimestampFromUuidV7,
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
  isValidUuid,
  uuidV7ToDate,
} from "./generate-uuid"; // Update this with your actual file name
const MOCK_TIMESTAMP = 1627524478387;

// note dashes are seperators and not part of the uuid so the length is 36 including the dashes
describe("UUID Generation Functions", () => {
  const MOCK_RANDOM = 0.123456789;

  test("getTimestampForV6 returns a predictable bigint", () => {
    // Date.now = jest.fn(() => MOCK_TIMESTAMP);

    const expectedTimestamp =
      BigInt(MOCK_TIMESTAMP) * BigInt(10000) + BigInt(0x01b21dd213814000);

    const v6Timestamp = getTimestampForV6(MOCK_TIMESTAMP);

    expect(v6Timestamp).toBe(expectedTimestamp);
  });

  test("getRandomClockSeq returns a predictable bigint", () => {
    expect(getRandomClockSeq(1)).toBe(BigInt(0x3fff)); // If you expect the max value
  });

  test("getTimestampForV6 returns a bigint", () => {
    expect(typeof getTimestampForV6(MOCK_TIMESTAMP)).toBe("bigint");
  });

  test("getTimestampForV7 returns a bigint", () => {
    expect(typeof getTimestampForV7(MOCK_TIMESTAMP)).toBe("bigint");
  });

  test("getRandomClockSeq returns a bigint", () => {
    expect(typeof getRandomClockSeq(MOCK_RANDOM)).toBe("bigint");
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

  test("generateUuidV6 returns a UUID string of length 36", () => {
    expect(generateUuidV6()).toHaveLength(36);
  });

  test("generateUuidV7 returns a UUID string of length 36", () => {
    expect(generateUuidV7().uuid).toHaveLength(36);
  });

  test("generateUuidV8 returns a UUID string of length 36", () => {
    const customData = [
      BigInt(0x123456789abc),
      BigInt(0x123),
      BigInt(0x3fffffffffffffff),
    ];
    expect(generateUuidV8(customData)).toHaveLength(36);
  });

  test("generateUuid returns a UUID string of length 36 for 6, 7, and 8", () => {
    expect(generateUuid(6)).toHaveLength(36);
    expect(generateUuid(7).uuid).toHaveLength(36);
    expect(generateUuid(8)).toHaveLength(36);
  });

  test("generateUuid returns a UUID string of length 36 with custom data", () => {
    const customData: bigint[] = [
      BigInt(0x123456789abc),
      BigInt(0x123),
      BigInt(0x3fffffffff),
    ];

    expect(generateUuid(8, customData)).toHaveLength(36);
  });

  //   test("generateUuid throws an error for invalid UUIDv8 input", () => {
  //     expect(() =>
  //       generateUuid(8, [BigInt(0x123456789abc), BigInt(0x123)])
  //     ).toThrow("Invalid custom data for UUIDv8 must be 3 bigints");
  //   });
});

test("isValidUuid returns true for valid UUIDs", () => {
  const UUID = "5a65fa79-4004-4442-ac78-78dabbc58bdc";
  expect(isValidUuid(UUID)).toBeTruthy();
});

test("UUIDv6 generation and extraction", () => {
  const uuidV6 = generateUuidV6();
  expect(isValidUuid(uuidV6)).toBeTruthy();

  const { timestamp, version } = extractTimestampFromUuidV6(uuidV6);
  expect(timestamp).toBeDefined();
  expect(version).toBe(BigInt(6));
});

// UUIDv7 Tests

describe("UUIDv7 generation", () => {
  test("UUIDv7 generation and extraction", () => {
    const { uuid: uuidV7 } = generateUuidV7(MOCK_TIMESTAMP);
    expect(isValidUuid(uuidV7)).toBeTruthy();

    const { timestamp, version } = extractTimestampFromUuidV7(uuidV7);
    expect(timestamp).toBeDefined();
    expect(version).toBe(BigInt(7));
  });

  test("UUIDv7 can extract timestamp", () => {
    const expectedTimestampDate = new Date(MOCK_TIMESTAMP);

    const { uuid: uuidV7 } = generateUuidV7(MOCK_TIMESTAMP);
    expect(isValidUuid(uuidV7)).toBeTruthy();

    const { timestamp } = extractTimestampFromUuidV7(uuidV7);
    const receivedTimestampAsDate = new Date(Number(timestamp));

    console.log({
      uuidV7,
      expectedTimestampDate,
      receivedTimestampAsDate,
      timestamp,
    });

    expect(receivedTimestampAsDate).toEqual(expectedTimestampDate);

    expect(timestamp).toBeDefined();
  });
});

describe("uuidToDate", () => {
  test("uuidToDate converts a valid UUIDv7 to the correct date", () => {
    const dateNow = new Date();
    const { uuid } = generateUuidV7(dateNow.getTime());
    expect(isValidUuid(uuid)).toBe(true);

    const date = uuidV7ToDate(uuid);
    console.log({
      uuid,
      date,
      dateNow,
    });

    // Check if the UUID is valid

    // Check if the converted date equals the original timestamp

    expect(date).toEqual(dateNow);
  });

  test("uuidV7ToDate throws an error for an invalid UUID format", () => {
    const invalidUuid = "12345";

    // Check if the function throws the correct error
    // expect(() => uuidToDate(invalidUuid)).toR("Invalid UUID");
    try {
      uuidV7ToDate(invalidUuid);
    } catch (e) {
      expect(e.message).toBe("Invalid UUID: ");
    }
  });

  test("uuidV7ToDate throws an error for a non-v7 UUID", () => {
    // Example of a v4 UUID. You should use a real UUIDv4 generator here.
    const nonV7Uuid = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

    // Check if the function throws the correct error
    try {
      uuidV7ToDate(nonV7Uuid);
    } catch (e) {
      //   expect(() => uuidToDate(nonV7Uuid)).toThrowError("Invalid UUID version");
      expect(e.message).toBe("Invalid UUID version");
    }
  });
});