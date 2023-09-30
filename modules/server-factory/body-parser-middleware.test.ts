import { jest, describe, expect, it, spyOn } from "bun:test";
import { bodyParser, getParsedBody } from "./body-parser-middleware";

describe("bodyParser middleware", () => {
  it("should correctly parse JSON content", async () => {
    const mockRequest = {
      headers: new Map([["Content-Type", "application/json"]]),
      text: jest.fn().mockResolvedValue(JSON.stringify({ key: "value" })),
    } as unknown as Request;

    const mockNext = jest.fn();

    await bodyParser({ request: mockRequest, next: mockNext });

    expect(getParsedBody<{ key: string }>(mockRequest)).toEqual({
      key: "value",
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it("should handle non-JSON content", async () => {
    const mockRequest = {
      headers: new Map([["Content-Type", "text/plain"]]),
      text: jest.fn().mockResolvedValue("plain text"),
    } as unknown as Request;

    const mockNext = jest.fn();

    await bodyParser({ request: mockRequest, next: mockNext });

    expect(getParsedBody<string>(mockRequest)).toBe("plain text");
    expect(mockNext).toHaveBeenCalled();
  });

  it("should handle invalid JSON gracefully", async () => {
    const consoleErrorSpy = spyOn(console, "error").mockImplementation(() =>'');
    const mockRequest = {
      headers: new Map([["Content-Type", "application/json"]]),
      text: jest.fn().mockResolvedValue("invalid json"),
    } as unknown as Request;

    const mockNext = jest.fn();

    await bodyParser({ request: mockRequest, next: mockNext });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  // ... any additional tests for other scenarios.
});
