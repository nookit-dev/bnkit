import { describe, expect, jest, test } from "bun:test";
import {
  createCorsMiddleware,
  isMethodAllowed,
  isOriginAllowed,
} from "./create-cors-middleware";

const defaultOrigin = "http://example.com";

import { CORSOptions } from "mod/utils/http-types";
import { setCORSHeaders } from "./create-cors-middleware";

describe("setCORSHeaders", () => {
  test('sets the Access-Control-Allow-Origin header to the request origin if the allowed origins do not include "*"', () => {
    const response = new Response();
    const options = { origins: ["https://example.com"] };
    const requestOrigin = "https://example.com";

    setCORSHeaders(response, options, requestOrigin);

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://example.com"
    );
  });

  test('sets the Access-Control-Allow-Origin header to "*" if the allowed origins include "*"', () => {
    const response = new Response();
    const options = { origins: ["*"] };
    const requestOrigin = "https://example.com";

    setCORSHeaders(response, options, requestOrigin);

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  test("sets the Access-Control-Allow-Methods header to the allowed methods", () => {
    const response = new Response();
    const options: CORSOptions = { methods: ["GET", "POST"] };
    const requestOrigin = "https://example.com";

    setCORSHeaders(response, options, requestOrigin);

    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, POST"
    );
  });

  test("sets the Access-Control-Allow-Headers header to the allowed headers", () => {
    const response = new Response();
    const options = { headers: ["Content-Type", "Authorization"] };
    const requestOrigin = "https://example.com";

    setCORSHeaders(response, options, requestOrigin);

    expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
      "Content-Type, Authorization"
    );
  });
});

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

describe("createCorsMiddleware function", () => {
  test("default values", async () => {
    const middleware = createCorsMiddleware({
      origins: [defaultOrigin],
      methods: ["GET", "POST", "PUT", "DELETE"],
      headers: ["Content-Type"],
    });

    const requester = new Request(defaultOrigin, {
      method: "GET",
      headers: new Headers({
        Origin: defaultOrigin,
      }),
    });

    const next = jest.fn(() => {
      const res = new Response();
      res.headers.append("Content-Type", "application/json"); // Add a header for demonstration purposes
      return res;
    });

    const response = await middleware({ request: requester, next });

    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, POST, PUT, DELETE"
    );
    expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
      "Content-Type"
    );
  });

  test("missing Origin header", async () => {
    const middleware = createCorsMiddleware({});
    const requester = new Request(defaultOrigin, { method: "GET" });
    const next = jest.fn(() => new Response());
    const response = await middleware({ request: requester, next });

    expect(response.status).toBe(400);
  });

  test("OPTIONS request", async () => {
    const middleware = createCorsMiddleware({
      methods: ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
      origins: [defaultOrigin],
    });
    const requester = new Request(defaultOrigin, {
      method: "OPTIONS",
      headers: new Headers({
        Origin: defaultOrigin,
        "Access-Control-Request-Method": "GET",
      }),
    });
    const next = jest.fn(() => new Response());
    const response = await middleware({ request: requester, next });

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "OPTIONS, GET, POST, PUT, DELETE"
    );
  });

  test("Allow all origins option", async () => {
    const middleware = createCorsMiddleware({
      methods: ["GET", "PATCH"],
      origins: ["*"],
    });
    const requester = new Request(defaultOrigin, {
      method: "GET",
      headers: new Headers({
        Origin: defaultOrigin,
      }),
    });
    const next = jest.fn(() => new Response());
    const response = await middleware({ request: requester, next });

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  test("unallowed method with OPTIONS request", async () => {
    const middleware = createCorsMiddleware({
      methods: ["GET"],
      origins: ["http://example.com"],
    });
    const request = new Request("http://example.com", {
      method: "OPTIONS",
      headers: {
        Origin: "http://example.com",
        "Access-Control-Request-Method": "PATCH",
      },
    });
    const next = jest.fn(() => new Response());
    const response = await middleware({ request, next });

    expect(response.status).toBe(405);
  });

  test("non-OPTIONS request", async () => {
    const middleware = createCorsMiddleware({
      methods: ["GET"],
      origins: [defaultOrigin],
    });
    const requester = new Request(defaultOrigin, {
      method: "GET",
      headers: new Headers({
        Origin: defaultOrigin,
      }),
    });
    const next = jest.fn(() => new Response());
    const response = await middleware({ request: requester, next });

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      defaultOrigin
    );
  });
  test("should return a middleware function", () => {
    const middleware = createCorsMiddleware({});
    expect(typeof middleware).toBe("function");
  });

  test("should set Access-Control-Allow-Origin header to request origin", async () => {
    const middleware = createCorsMiddleware({
      origins: ["http://example.com"],
    });

    // Add the 'Origin' header to the request.
    const request = new Request("http://example.com", {
      headers: { Origin: "http://example.com" },
    });

    const response = await middleware({
      request,
      next: async () => new Response("Hello, world!"),
    });
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://example.com"
    );
  });

  test("should set Access-Control-Allow-Origin header to * if allowedOrigins includes *", async () => {
    const middleware = createCorsMiddleware({ origins: ["*"] });
    const request = new Request("http://example.com", {
      headers: { Origin: "http://example.com" },
    });
    const response = await middleware({
      request,
      next: async () => new Response("Hello, world!"),
    });
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  test("should set Access-Control-Allow-Methods header to allowedMethods", async () => {
    const middleware = createCorsMiddleware({
      methods: ["GET", "POST"],
      origins: ["http://example.com"],
    });
    const request = new Request("http://example.com", {
      headers: { Origin: "http://example.com" },
    });

    const response = await middleware({
      request,
      next: async () => new Response("Hello, world!"),
    });
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, POST"
    );
  });

  test("should set Access-Control-Allow-Headers header to allowedHeaders", async () => {
    const middleware = createCorsMiddleware({
      headers: ["Content-Type"],
      origins: ["http://example.com"],
    });
    const request = new Request("http://example.com", {
      headers: {
        Origin: "http://example.com",
        "Content-Type": "application/json",
      },
    });
    const response = await middleware({
      request,
      next: async () => new Response("Hello, world!"),
    });
    expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
      "Content-Type"
    );
  });

  test("should return 400 Bad Request if request does not have Origin header", async () => {
    const middleware = createCorsMiddleware({});
    const request = new Request("http://example.com");
    const response = await middleware({
      request,
      next: async () => new Response("Hello, world!"),
    });

    expect(response.status).toBe(400);
  });

  test("should return 403 Forbidden if request origin is not allowed", async () => {
    const middleware = createCorsMiddleware({
      origins: ["http://example.com"],
    });
    const request = new Request("http://example.org", {
      headers: { Origin: "http://example.org" },
    });
    const response = await middleware({
      request,
      next: async () => new Response("Hello, world!"),
    });
    expect(response.status).toBe(403);
  });

  test("should return 405 Method Not Allowed if request method is not allowed", async () => {
    const middleware = createCorsMiddleware({
      methods: ["GET"],
      origins: ["http://example.com"],
    });
    const request = new Request("http://example.com", {
      method: "POST",
      headers: {
        Origin: "http://example.com",
        "Access-Control-Request-Method": "POST",
      },
    });
    const response = await middleware({
      request,
      next: async () => new Response("Hello, world!"),
    });
    expect(response.status).toBe(405);
  });

  test("should return 204 No Content if request method is OPTIONS and allowed", async () => {
    const middleware = createCorsMiddleware({
      methods: ["GET"],
      origins: ["http://example.com"],
    });
    const request = new Request("http://example.com", {
      method: "OPTIONS",
      headers: {
        Origin: "http://example.com",
        "Access-Control-Request-Method": "GET",
      },
    });
    const response = await middleware({
      request,
      next: async () => new Response("Hello, world!"),
    });
    expect(response.status).toBe(204);
  });

  test("should allow request if no origin is passed in and all origins are allowed", async () => {
    const middleware = createCorsMiddleware({ origins: ["*"] });
    const request = new Request("https://example.com");
    const next = () => new Response("Hello, world!");
    const response = await middleware({ request, next });
    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});
