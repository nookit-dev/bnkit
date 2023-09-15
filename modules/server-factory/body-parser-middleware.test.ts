import { describe, expect, it, mock } from "bun:test";

import { bodyParser, getParsedBody } from "./body-parser-middleware"; // assuming this is where your middleware resides

describe("bodyParser middleware", () => {
  it("parses JSON content correctly", async () => {
    const request = new Request("http://localhost:3000/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "data" }),
    });
    const next = mock(() => {});
    await bodyParser(request, next);
    expect(getParsedBody(request)).toEqual({ test: "data" });
    expect(next.mock.calls.length).toBe(1);
  });

  it("handles non-JSON content correctly", async () => {
    const request = new Request("http://localhost:3000/test", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "test data",
    });
    const next = mock(() => {});
    await bodyParser(request, next);
    expect(getParsedBody(request)).toBe("test data");
    expect(next.mock.calls.length).toBe(1);
  });

  it("handles invalid JSON content gracefully", async () => {
    const request = new Request("http://localhost:3000/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid json",
    });
    const next = mock(() => {});
    await bodyParser(request, next);
    expect(getParsedBody(request)).toBeUndefined();
    expect(next.mock.calls.length).toBe(1);
  });
});
