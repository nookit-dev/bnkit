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
  it("should return a JSON response with the given body and headers", () => {
    const body = { foo: "bar" };
    const response = jsonRes(body, {
      status: 200,
      headers: { "X-Foo": "bar" },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json");
    expect(response.headers.get("x-foo")).toBe("bar");
    expect(response.body).toBe(JSON.stringify(body));
  });

  it("should return a plain text response if the body is not an object", () => {
    const body = "hello, world";
    const response = jsonRes(body);
    expect(response.headers.get("content-type")).toBe("application/json");
    expect(response.body).toBe(body);
  });
});

describe("htmlRes", () => {
  it("should return an HTML response with the given body and headers", () => {
    const body = "<h1>Hello, world!</h1>";
    const response = htmlRes(body, {
      status: 200,
      headers: { "X-Foo": "bar" },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/html");
    expect(response.headers.get("x-foo")).toBe("bar");
    expect(response.body).toBe(body);
  });
});
