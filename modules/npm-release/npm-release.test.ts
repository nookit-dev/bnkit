import { describe, expect, jest, test } from "bun:test";
import { isTestFile } from "mod/test-utils";
import { getCurrentVersion, npmPublish, updateVersion } from "./npm-release";
describe("getCurrentVersion", () => {
  test("returns the version from the package.json", async () => {
    const packagePath = isTestFile(import.meta)
      ? import.meta.dir + "/mock-package.json"
      : "./package.json";

    const version = await getCurrentVersion(packagePath);
    const hasThreeParts = version.split(".").length === 3;

    expect(hasThreeParts).toBe(true);
  });
});

describe("updateVersion", () => {
  test("increments patch version by default", () => {
    const version = updateVersion("1.0.0", false);
    expect(version).toEqual("1.0.1");
  });

  test("increments alpha version with hash", () => {
    const version = updateVersion("1.0.0", true);
    expect(version).toMatch(/1\.0\.0-alpha\.[a-z0-9]{8}/);
  });
});

describe("npmPublish", () => {
  test("retries on version conflict", async () => {
    // Mock failed publish due to version conflict
    Bun.spawnSync = jest
      .fn()
      .mockReturnValueOnce({
        stdout: "",
        stderr: "Cannot publish over previously published version",
      })
      .mockReturnValueOnce({
        stdout: "Published",
        stderr: "",
      });

    await npmPublish({
      packagePath: "./package.json",
      isAlpha: false,
      maxRetries: 2,
    });

    expect(Bun.spawnSync).toHaveBeenCalledTimes(2);
  });
});
