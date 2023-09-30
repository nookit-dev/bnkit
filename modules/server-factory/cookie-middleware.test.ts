import { describe, jest, beforeEach, it, expect } from "bun:test";
import { createCookieMiddleware } from "./cookie-middlware";
import { MiddlewareNext } from "mod/utils/http-types";
import { parseCookies } from "mod/cookie-factory/server-side-cookie-factory";

describe("createCookieMiddleware", () => {
  let middleware: ReturnType<typeof createCookieMiddleware>, mockRequest: Request, mockResponse: Response, mockNext: MiddlewareNext;

  beforeEach(() => {
    middleware = createCookieMiddleware();

    mockRequest = new Request("http://example.com", {
      headers: new Headers({
        Cookie: "testCookie=testValue",
      }),
    });
    mockResponse = new Response();
    mockNext = jest.fn(() => mockResponse);
  });

  it("should get a cookie from the request", async () => {
    await middleware({ request: mockRequest, next: mockNext, context: {} });
    const cookieContext = mockNext.mock.calls[0][0];
    const cookie = cookieContext.getCookie("testCookie");

    expect(cookie).toBe("testValue");
  });

  it("should check existence of a cookie", async () => {
    await middleware({ request: mockRequest, next: mockNext, context: {} });
    const cookieContext = mockNext.mock.calls[0][0];
    const hasCookie = cookieContext.checkCookie("testCookie");

    expect(hasCookie).toBe(true);
  });

  it("should set a cookie on response", async () => {
    const setCookieValue = "newValue";

    await middleware({ request: mockRequest, next: mockNext, context: {} });
    const cookieContext = mockNext.mock.calls[0][0];
    cookieContext.setCookie("newCookie", setCookieValue);

    const rawCookies = mockResponse.headers.get("Set-Cookie");
    const cookies = parseCookies(rawCookies || "");
    expect(cookies.newCookie).toBe(setCookieValue);
  });

  it("should delete a cookie on response", async () => {
    await middleware({ request: mockRequest, next: mockNext, context: {} });
    const cookieContext = mockNext.mock.calls[0][0];
    cookieContext.deleteCookie("testCookie");
    const rawCookies = mockResponse.headers.get("Set-Cookie");
    const cookies = parseCookies(rawCookies || "");
    expect(cookies.testCookie).toBe("");
  });
});
