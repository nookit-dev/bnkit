export function getTimestampForV6(): bigint {
  return BigInt(Date.now()) * BigInt(10000) + BigInt(0x01b21dd213814000);
}

export function getTimestampForV7(): bigint {
  return BigInt(Date.now());
}

export function getRandomClockSeq(): bigint {
  return BigInt(Math.floor(Math.random() * 0x3fff));
}

export function getRandomNode(): bigint {
  return BigInt(Math.floor(Math.random() * 0xffffffffffff));
}

export function getRandomValues(): bigint {
  return BigInt(Math.floor(Math.random() * 0x3fffffffffffffff));
}

export function formatTimeLow(timeLow: bigint): string {
  return (timeLow & BigInt("0xFFFFFFFF")).toString(16).padStart(8, "0");
}

export function formatTimeMid(timeMid: bigint): string {
  return (timeMid & 0xffffn).toString(16).padStart(4, "0");
}

export function formatTimeHighAndVersion(
  timeHi: bigint,
  version: bigint
): string {
  return (((timeHi & 0x0fffn) << 4n) | version).toString(16).padStart(4, "0");
}

export function formatClockSeq(clockSeq: bigint): string {
  return (
    ((clockSeq >> 8n) & 0xffn).toString(16).padStart(2, "0") +
    (clockSeq & 0xffn).toString(16).padStart(2, "0")
  );
}
export function formatNode(node: bigint): string {
  return node.toString(16).padStart(12, "0");
}

export function generateUuidV6(): string {
  const timestamp = getTimestampForV6();
  const timeLow = (timestamp & BigInt(0xffffffff00000000)) >> 32n;
  const timeMid = (timestamp & BigInt(0x00000000ffff0000)) >> 16n;
  const timeHi = timestamp & BigInt(0x0000000000000fff);
  const clockSeq = getRandomClockSeq();
  const node = getRandomNode();

  return (
    formatTimeLow(timeLow) +
    formatTimeMid(timeMid) +
    formatTimeHighAndVersion(timeHi, 6n) +
    formatClockSeq(clockSeq) +
    formatNode(node)
  );
}

export function generateUuidV7(): string {
  const timestamp = getTimestampForV7();
  const randA = getRandomValues();
  const randB = getRandomValues();

  const segment1 = timestamp.toString(16).padStart(12, "0");
  const segment2 = (((randA & 0xfffn) << 4n) | 7n)
    .toString(16)
    .padStart(4, "0");
  const segment3 = (0x80n | (randB >> 56n)).toString(16).padStart(2, "0");
  const segment4 = (randB & BigInt(0x00ffffffffffffff))
    .toString(16)
    .padStart(14, "0");

  return segment1 + segment2 + segment3 + segment4;
}

export function generateUuidV8(customData: bigint[] = [0n, 0n, 0n]): string {
  console.log({ customData });
  if (customData.length !== 3) {
    console.log("got here");
    console.error("Invalid custom data", customData);
    throw new Error(`Invalid custom data for UUIDv8 must be 3 bigints`);
  }

  return (
    customData[0].toString(16).padStart(12, "0") +
    ((customData[1] << 4n) | 8n).toString(16).padStart(4, "0") +
    (0x80n | (customData[2] >> 56n)).toString(16).padStart(2, "0") +
    (customData[2] & BigInt(0x00ffffffffffffff)).toString(16).padStart(14, "0")
  );
}

export function generateUuid(
  version: 6 | 7 | 8,
  customData?: bigint[]
): string {
  if (version === 6) {
    return generateUuidV6();
  } else if (version === 7) {
    return generateUuidV7();
  } else if (version === 8) {
    return generateUuidV8(customData);
  } else {
    throw new Error("Invalid version or custom data for UUIDv8");
  }
}
