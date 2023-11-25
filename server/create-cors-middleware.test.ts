import { describe, expect, test } from "bun:test";
import { corsMiddleware } from "./create-cors-middleware";

const defaultOrigin = "http://example.com";

const testReq = (origin: string = defaultOrigin) => {
  return new Request(origin, {
    method: "get",
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
      methods: ["get", "post", "put", "delete"],
      headers: ["Content-Type"],
    });

    const { response } = result;

    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "get, post, put, delete"
    );
    expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
      "Content-Type"
    );
  });

  test("missing Origin header", async () => {
    const requester = new Request(defaultOrigin, { method: "get" });
    const result = await corsMiddleware(requester, {
      origins: [defaultOrigin],
      methods: ["get", "post", "put", "delete"],
      headers: ["Content-Type"],
    });

    const { response } = result;

    expect(response.status).toBe(400);
  });

  test("options request", async () => {
    const requester = new Request(defaultOrigin, {
      method: "options",
      headers: new Headers({
        Origin: defaultOrigin,
        "Access-Control-Request-Method": "get",
      }),
    });
    const { response } = await corsMiddleware(requester, {
      methods: ["options", "get", "post", "put", "delete"],
      origins: [defaultOrigin],
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "options, get, post, put, delete"
    );
  });

  test("Allow all origins option", async () => {
    const requester = new Request(defaultOrigin, {
      method: "get",
      headers: new Headers({
        Origin: defaultOrigin,
      }),
    });
    const { response } = await corsMiddleware(requester, {
      methods: ["get", "PATCH"],
      origins: ["*"],
    });

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  test("unallowed method with options request", async () => {
    const request = new Request("http://example.com", {
      method: "options",
      headers: {
        Origin: "http://example.com",
        "Access-Control-Request-Method": "PATCH",
      },
    });
    const { response } = await corsMiddleware(request, {
      methods: ["get"],
      origins: ["http://example.com"],
    });

    expect(response.status).toBe(405);
  });

  test("non-options request", async () => {
    const requester = new Request(defaultOrigin, {
      method: "get",
      headers: new Headers({
        Origin: defaultOrigin,
      }),
    });
    const { response } = await corsMiddleware(requester, {
      methods: ["get"],
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
      methods: ["get", "post"],
      origins: ["http://example.com"],
    });

    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "get, post"
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
      method: "post",
      headers: {
        Origin: "http://example.com",
        "Access-Control-Request-Method": "post",
      },
    });
    const { response } = await corsMiddleware(request, {
      methods: ["get"],
      origins: ["http://example.com"],
    });

    expect(response.status).toBe(405);
  });

  test("should return 204 No Content if request method is options and allowed", async () => {
    const request = new Request("http://example.com", {
      method: "options",
      headers: {
        Origin: "http://example.com",
        "Access-Control-Request-Method": "get",
      },
    });
    const { response } = await corsMiddleware(request, {
      methods: ["get"],
      origins: ["http://example.com"],
    });
    expect(response.status).toBe(204);
  });
});
