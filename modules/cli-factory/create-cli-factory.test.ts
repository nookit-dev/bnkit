import { describe, expect,test} from "bun:test";
import {
    OptionDefinition,
    getOptionValue,
    parseArgument,
} from "./create-cli-factory";

describe("getOptionValue", () => {
  test("should return correct value for boolean type", () => {
    const arg = "--testArg";
    const nextArg = "true";
    const optionDef: OptionDefinition = {
      default: false,
      types: ["boolean"],
    };

    const value = getOptionValue(arg, nextArg, optionDef);
    expect(value).toBe(true);
  });

  test("should return default value if nextArg starts with '--'", () => {
    const arg = "--testArg";
    const nextArg = "--anotherArg";
    const optionDef: OptionDefinition = {
      default: "default",
      types: ["string"],
    };

    const value = getOptionValue(arg, nextArg, optionDef);
    expect(value).toBe("default");
  });
});

describe("parseArgument", () => {
  test("should return correct key and value", () => {
    const arg = "--testArg";
    const nextArg = "true";

    const { key, value } = parseArgument(arg, nextArg);
    expect(key).toBe("testArg");
    expect(value).toBe(true);
  });

  test("should throw error if arg does not start with '--'", async () => {
    const arg = "testArg";
    const nextArg = "true";

    let error: Error | null = null;
    try {
      parseArgument(arg, nextArg);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error!.message).toBe(`Invalid parameter: ${arg}`);
  });
});
