import { describe, expect, test } from "bun:test";
import { corsMiddleware } from "./create-cors-middleware";

const defaultOrigin = "http://example.com";

const testReq = (origin: string = defaultOrigin) => {
  return new Request(origin, {
    method: "GET",
    headers: new Headers({
      Origin: origin,
    }),
  });
};

describe("createCorsMiddleware function", () => {
  test("default values", async () => {
    const requester = testReq(defaultOrigin);
    const result = await corsMiddleware(requester, {
      origins: [defaultOrigin],
      methods: ["GET", "POST", "PUT", "DELETE"],
      headers: ["Content-Type"],
    });

    const { response } = result;

    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, POST, PUT, DELETE"
    );
    expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
      "Content-Type"
    );
  });

  test("missing Origin header", async () => {
    const requester = new Request(defaultOrigin, { method: "GET" });
    const result = await corsMiddleware(requester, {
      origins: [defaultOrigin],
      methods: ["GET", "POST", "PUT", "DELETE"],
      headers: ["Content-Type"],
    });

    const { response } = result;

    expect(response.status).toBe(400);
  });

  test("OPTIONS request", async () => {
    const requester = new Request(defaultOrigin, {
      method: "OPTIONS",
      headers: new Headers({
        Origin: defaultOrigin,
        "Access-Control-Request-Method": "GET",
      }),
    });
    const { response } = await corsMiddleware(requester, {
      methods: ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
      origins: [defaultOrigin],
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "OPTIONS, GET, POST, PUT, DELETE"
    );
  });

  test("Allow all origins option", async () => {
    const requester = new Request(defaultOrigin, {
      method: "GET",
      headers: new Headers({
        Origin: defaultOrigin,
      }),
    });
    const { response } = await corsMiddleware(requester, {
      methods: ["GET", "PATCH"],
      origins: ["*"],
    });

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  test("unallowed method with OPTIONS request", async () => {
    const request = new Request("http://example.com", {
      method: "OPTIONS",
      headers: {
        Origin: "http://example.com",
        "Access-Control-Request-Method": "PATCH",
      },
    });
    const { response } = await corsMiddleware(request, {
      methods: ["GET"],
      origins: ["http://example.com"],
    });

    expect(response.status).toBe(405);
  });

  test("non-OPTIONS request", async () => {
    const requester = new Request(defaultOrigin, {
      method: "GET",
      headers: new Headers({
        Origin: defaultOrigin,
      }),
    });
    const { response } = await corsMiddleware(requester, {
      methods: ["GET"],
      origins: [defaultOrigin],
    });

    expect(response?.headers.get("Access-Control-Allow-Origin")).toBe(
      defaultOrigin
    );
  });

  test("should set Access-Control-Allow-Origin header to request origin", async () => {
    // Add the 'Origin' header to the request.
    const request = new Request("http://example.com", {
      headers: { Origin: "http://example.com" },
    });

    const { response } = await corsMiddleware(request, {
      origins: ["http://example.com"],
    });

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://example.com"
    );
  });

  test("should set Access-Control-Allow-Origin header to * if allowedOrigins includes *", async () => {
    const request = new Request("http://example.com", {
      headers: { Origin: "http://example.com" },
    });
    const { response } = await corsMiddleware(request, { origins: ["*"] });

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  test("should set Access-Control-Allow-Methods header to allowedMethods", async () => {
    const request = new Request("http://example.com", {
      headers: { Origin: "http://example.com" },
    });

    const { response } = await corsMiddleware(request, {
      methods: ["GET", "POST"],
      origins: ["http://example.com"],
    });

    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, POST"
    );
  });

  test("should set Access-Control-Allow-Headers header to allowedHeaders", async () => {
    const request = new Request("http://example.com", {
      headers: {
        Origin: "http://example.com",
        "Content-Type": "application/json",
      },
    });

    const { response } = await corsMiddleware(request, {
      headers: ["Content-Type"],
      origins: ["http://example.com"],
    });

    expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
      "Content-Type"
    );
  });

  test("should return 400 Bad Request if request does not have Origin header", async () => {
    const request = new Request("http://example.com");
    const { response } = await corsMiddleware(request, {});

    expect(response.status).toBe(400);
  });

  test("should return 403 Forbidden if request origin is not allowed", async () => {
    const request = new Request("http://example.org", {
      headers: { Origin: "http://example.org" },
    });

    const { response } = await corsMiddleware(request, {
      origins: ["http://example.com"],
    });

    expect(response.status).toBe(403);
  });

  test("should return 405 Method Not Allowed if request method is not allowed", async () => {
    const request = new Request("http://example.com", {
      method: "POST",
      headers: {
        Origin: "http://example.com",
        "Access-Control-Request-Method": "POST",
      },
    });
    const { response } = await corsMiddleware(request, {
      methods: ["GET"],
      origins: ["http://example.com"],
    });

    expect(response.status).toBe(405);
  });

  test("should return 204 No Content if request method is OPTIONS and allowed", async () => {
    const request = new Request("http://example.com", {
      method: "OPTIONS",
      headers: {
        Origin: "http://example.com",
        "Access-Control-Request-Method": "GET",
      },
    });
    const { response } = await corsMiddleware(request, {
      methods: ["GET"],
      origins: ["http://example.com"],
    });
    expect(response.status).toBe(204);
  });
});
