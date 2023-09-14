import { describe, expect, it } from "bun:test";
import {
  htmlRes,
  jsonRes,
  parseQueryParams,
  parseRequestHeaders,
} from "./request-helpers";

describe("parseQueryParams", () => {
  it("should parse query params from a request", () => {
    const request = new Request("https://example.com/path?foo=bar&baz=qux");
    const params = parseQueryParams(request);

    expect(params).toEqual({ foo: "bar", baz: "qux" });
  });
});

describe("parseRequestHeaders", () => {
  it("should parse headers from a request", () => {
    const request = new Request("https://example.com/path", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer abc123",
      },
    });
    const headers = parseRequestHeaders(request);

    expect(headers).toEqual({
      "content-type": "application/json",
      authorization: "Bearer abc123",
    });
  });
});

describe("jsonRes", () => {
  it("should return a JSON response with the given body and headers", async () => {
    const body = { foo: "bar" };
    const response = jsonRes(body, {
      status: 200,
      headers: { "X-Foo": "bar" },
    });

    const test = await response.json();

    expect(await response.status).toBe(200);
    expect(await response.headers.get("x-foo")).toBe("bar");
    expect(await response.headers.get("Content-Type")).toBe("application/json");
    expect(JSON.stringify(test)).toBe(JSON.stringify(body));
  });
});

describe("htmlRes", () => {
  it("should return an HTML response with the given body and headers", async () => {
    const body = "<h1>Hello, world!</h1>";
    const response = htmlRes(body, {
      status: 200,
      headers: { "X-Foo": "bar" },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/html");
    expect(response.headers.get("x-foo")).toBe("bar");
    expect(await response.text()).toBe(body);
  });
});
