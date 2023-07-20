import { describe, expect, jest, test } from "bun:test";
import { BaseError } from "../utils/base-error";
import { createErrorHandlerFactory } from "./create-error-handler-factory";

describe("createErrorHandlerFactory", () => {
  const mockLogger = {
    error: jest.fn(),
  };

  const errorHandlerFactory = createErrorHandlerFactory({
    defaultValue: "DEFAULT",
    logger: mockLogger,
  });

  test("returns an object with handleAsync and handleSync methods", () => {
    expect(errorHandlerFactory).toHaveProperty("handleAsync");
    expect(errorHandlerFactory).toHaveProperty("handleSync");
  });

  test("handleAsync returns the result of the passed function when it does not throw an error", async () => {
    const result = await errorHandlerFactory.handleAsync(async () => "SUCCESS");
    expect(result).toBe("SUCCESS");
  });

  test("handleSync returns the result of the passed function when it does not throw an error", () => {
    const result = errorHandlerFactory.handleSync(() => "SUCCESS");
    expect(result).toBe("SUCCESS");
  });

  test("handleAsync returns the default value when the passed function throws an error", async () => {
    const result = await errorHandlerFactory.handleAsync(() => {
      throw new Error("ERROR");
    });
    expect(result).toBe("DEFAULT");
  });

  test("handleSync returns the default value when the passed function throws an error", () => {
    const result = errorHandlerFactory.handleSync(() => {
      throw new Error("ERROR");
    });
    expect(result).toBe("DEFAULT");
  });

  test("handleAsync logs the error when the passed function throws a BaseError", async () => {
    await errorHandlerFactory.handleAsync(() => {
      throw new BaseError("ERROR", "ERROR_CODE");
    });
    expect(mockLogger.error).toHaveBeenCalled();
  });

  test("handleSync logs the error when the passed function throws a BaseError", () => {
    errorHandlerFactory.handleSync(() => {
      throw new BaseError("ERROR", "ERROR_CODE");
    });
    //  once bun adds support for toHaveBeenCalledWith, we can use this:
    // expect(mockLogger.error).toHaveBeenCalledWith(
    //   "ERROR",
    //   "ERROR_CODE",
    // );
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
