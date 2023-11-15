import { describe, expect, it, test } from "bun:test";
import { CORSOptions } from "../utils/http-types";
import {
  buildControlHeaders,
  isMethodAllowed,
  isOriginAllowed,
  setCORSHeaders,
  setCORSHeadersIfOriginPresent,
} from "./cors-utils";

const defaultOrigin = "http://example.com";

describe("isOriginAllowed", () => {
  test("allows catch all (*)", () => {
    expect(isOriginAllowed(["*"], defaultOrigin)).toBe(true);
  });
  test("allows specific origins", () => {
    expect(isOriginAllowed([defaultOrigin], defaultOrigin)).toBe(true);
  });

  test("disallows non-matching origins", () => {
    expect(isOriginAllowed(["http://example.org"], defaultOrigin)).toBe(false);
  });
});

describe("isMethodAllowed", () => {
  test("allows allowed methods", () => {
    expect(isMethodAllowed(["GET", "POST"], "GET")).toBe(true);
  });

  test("disallows disallowed methods", () => {
    expect(isMethodAllowed(["GET", "POST"], "DELETE")).toBe(false);
  });
});

describe("setCORSHeaders", () => {
  test('sets the Access-Control-Allow-Origin header to the request origin if the allowed origins do not include "*"', () => {
    const response = new Response();
    const options = { origins: ["https://example.com"] };
    const requestOrigin = "https://example.com";

    setCORSHeaders({ response, options, requestOrigin });

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://example.com"
    );
  });

  test('sets the Access-Control-Allow-Origin header to "*" if the allowed origins include "*"', () => {
    const response = new Response();
    const options = { origins: ["*"] };
    const requestOrigin = "https://example.com";

    setCORSHeaders({ response, options, requestOrigin });

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  test("sets the Access-Control-Allow-Methods header to the allowed methods", () => {
    const response = new Response();
    const options: CORSOptions = { methods: ["GET", "POST"] };
    const requestOrigin = "https://example.com";

    setCORSHeaders({ response, options, requestOrigin });

    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, POST"
    );
  });

  test("sets the Access-Control-Allow-Headers header to the allowed headers", () => {
    const response = new Response();
    const options = { headers: ["Content-Type", "Authorization"] };
    const requestOrigin = "https://example.com";

    setCORSHeaders({ response, options, requestOrigin });

    expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
      "Content-Type, Authorization"
    );
  });
});

describe("setCORSHeadersIfOriginPresent", () => {
  it("should set headers if origin is present", () => {
    const response = new Response();
    const options: CORSOptions = {
      origins: ["http://example.com"],
      methods: ["GET", "POST"],
      headers: ["Content-Type"],
      credentials: true,
    };
    setCORSHeadersIfOriginPresent(options, "http://example.com", response);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://example.com"
    );
  });

  it("should not set headers if origin is null", () => {
    const response = new Response();
    const options: CORSOptions = {
      origins: ["http://example.com"],
      methods: ["GET", "POST"],
      headers: ["Content-Type"],
      credentials: true,
    };
    setCORSHeadersIfOriginPresent(options, null, response);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });
});

describe("buildControlHeaders", () => {
  it("should build control headers based on provided options", () => {
    const options: CORSOptions = {
      origins: ["http://example.com"],
      methods: ["GET", "POST"],
      headers: ["Content-Type"],
      credentials: true,
    };
    const headers = buildControlHeaders({
      options,
      requestOrigin: "http://example.com",
    });
    expect(headers.get("Access-Control-Allow-Origin")).toBe(
      "http://example.com"
    );
    expect(headers.get("Access-Control-Allow-Methods")).toBe("GET, POST");
  });
});
