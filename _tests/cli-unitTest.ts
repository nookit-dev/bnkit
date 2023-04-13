import { expect, test, describe } from "bun:test";
import { getUserInput, parseCliArgs, getModulesFromPath } from "./module";

describe("Module Tests", () => {
  describe("getUserInput", () => {
    test("should return a string", async () => {
      const input = await getUserInput();
      expect(typeof input).toBe("string");
    });
  });

  describe("parseCliArgs", () => {
    test("should return parsed arguments", async () => {
      const args = await parseCliArgs();
      expect(args).toEqual({}); // change this to test specific arguments once defined
    });
  });

  describe("getModulesFromPath", () => {
    test("should return an array of module names", () => {
      const modules = getModulesFromPath("./testModules");
      expect(modules).toEqual(["module1", "module2"]);
    });
  });
});
```