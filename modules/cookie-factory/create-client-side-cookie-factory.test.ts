import { beforeEach, describe, expect, jest, test } from "bun:test";
import { createClientCookieFactory } from "./create-client-side-cookie-factory";


const mockDocument = {
  _cookie: "",
  get cookie() {
    return this._cookie;
  },
  set cookie(value) {
    this._cookie = value;
  },
};

Object.defineProperty(globalThis, "document", {
  value: mockDocument,
  writable: true,
  configurable: true,
});

describe("createClientCookieFactory", () => {
  const cookieFactory = createClientCookieFactory();

  // Mock document.cookie
  let mockCookie = "";

  beforeEach(() => {
    // Reset the mock document.cookie before each test
    mockCookie = "";
  });

  Object.defineProperty(document, "cookie", {
    get: jest.fn(() => mockCookie),
    set: jest.fn((newCookie) => {
      mockCookie = newCookie;
    }),
  });

  test("setCookie sets a cookie", () => {
    cookieFactory.setCookie("test", "value");
    expect(document.cookie).toBe("test=value");
  });

  test("getCookie returns the value of a cookie", () => {
    document.cookie = "test=value";
    const value = cookieFactory.getCookie("test");
    expect(value).toBe("value");
  });

  test("deleteCookie sets a cookie with Max-Age=-1", () => {
    cookieFactory.deleteCookie("test");
    expect(document.cookie).toBe("test=; max-age=-1");
  });

  test("checkCookie returns true if a cookie exists", () => {
    document.cookie = "test=value";
    const exists = cookieFactory.checkCookie("test");
    expect(exists).toBe(true);
  });

  test("checkCookie returns false if a cookie does not exist", () => {
    const exists = cookieFactory.checkCookie("test");
    expect(exists).toBe(false);
  });
});
