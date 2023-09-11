import { describe, expect, jest, test } from "bun:test";
import {
    createCorsMiddleware,
    isMethodAllowed,
    isOriginAllowed,
} from "./create-cors-middleware";
const defaultOrigin = "http://example.com";

describe("CORS Middleware", () => {
  test("isOriginAllowed function", () => {
    expect(isOriginAllowed(["*"], defaultOrigin)).toBe(true);
    expect(isOriginAllowed([defaultOrigin], defaultOrigin)).toBe(true);
    expect(isOriginAllowed(["http://example.org"], defaultOrigin)).toBe(false);
  });

  test("isMethodAllowed function", () => {
    expect(isMethodAllowed(["GET", "POST"], "GET")).toBe(true);
    expect(isMethodAllowed(["GET", "POST"], "DELETE")).toBe(false);
  });

  test("default values", async () => {
    const middleware = createCorsMiddleware({
      allowedOrigins: [defaultOrigin],
      allowedMethods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type"],
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

    const response = await middleware(requester, next);

    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, POST, PUT, DELETE"
    );
    expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
      "Content-Type"
    );
  });

  test("missing Origin header", async () => {
    const middleware = createCorsMiddleware();
    const requester = new Request(defaultOrigin, { method: "GET" });
    const next = jest.fn(() => new Response());
    const response = await middleware(requester, next);

    expect(response.status).toBe(400);
  });

  test("OPTIONS request", async () => {
    const middleware = createCorsMiddleware({
      allowedMethods: ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
      allowedOrigins: [defaultOrigin],
    });
    const requester = new Request(defaultOrigin, {
      method: "OPTIONS",
      headers: new Headers({
        Origin: defaultOrigin,
        "Access-Control-Request-Method": "GET", 

      }),
    });
    const next = jest.fn(() => new Response());
    const response = await middleware(requester, next);

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "OPTIONS, GET, POST, PUT, DELETE"
    );
  });

  test("Allow all origins option", async () => {
    const middleware = createCorsMiddleware({
      allowAllOrigins: true,
      allowedMethods: ["GET", "PATCH"],
    });
    const requester = new Request(defaultOrigin, {
      method: "GET",
      headers: new Headers({
        Origin: defaultOrigin,
      }),
    });
    const next = jest.fn(() => new Response());
    const response = await middleware(requester, next);

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  test("unallowed method with OPTIONS request", async () => {
    const middleware = createCorsMiddleware({ allowedMethods: ["GET"] });
    const requester = new Request(defaultOrigin, {
      method: "OPTIONS",
      headers: new Headers({
        Origin: defaultOrigin,
        "Access-Control-Request-Method": "PATCH",
      }),
    });
    const next = jest.fn(() => new Response());
    const response = await middleware(requester, next);

    expect(response.status).toBe(405);
  });

  test("non-OPTIONS request", async () => {
    const middleware = createCorsMiddleware({
      allowedMethods: ["GET"],
      allowedOrigins: [defaultOrigin],
    });
    const requester = new Request(defaultOrigin, {
      method: "GET",
      headers: new Headers({
        Origin: defaultOrigin,
      }),
    });
    const next = jest.fn(() => new Response());
    const response = await middleware(requester, next);

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      defaultOrigin
    );
  });
});
