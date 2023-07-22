import { describe, it, expect } from "bun:test";
import {
  getOptionValue,
  parseArgument,
  OptionDefinition,
} from "./create-cli-factory";

describe("getOptionValue", () => {
  it("should return correct value for boolean type", () => {
    const arg = "--testArg";
    const nextArg = "true";
    const optionDef: OptionDefinition = {
      default: false,
      types: ["boolean"],
    };

    const value = getOptionValue(arg, nextArg, optionDef);
    expect(value).toBe(true);
  });

  it("should return default value if nextArg starts with '--'", () => {
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
  it("should return correct key and value", () => {
    const arg = "--testArg";
    const nextArg = "true";

    const { key, value } = parseArgument(arg, nextArg);
    expect(key).toBe("testArg");
    expect(value).toBe(true);
  });

  it("should throw error if arg does not start with '--'", async () => {
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
