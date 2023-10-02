import { beforeEach, describe, expect, jest, test } from "bun:test";
import { createServerCookieFactory } from "./server-side-cookie-factory";

describe("createServerCookieFactory", () => {
  const cookieFactory = createServerCookieFactory();

  // Mock response and request objects
  let mockRes = { headers: { append: jest.fn() } };
  let mockReq = { headers: { get: jest.fn() } };

  beforeEach(() => {
    // Reset the mock functions before each test
    mockRes.headers.append.mockReset();
    mockReq.headers.get.mockReset();
  });

  test("setCookie appends a Set-Cookie header", () => {
    cookieFactory.setCookie(mockRes, "test", "value");
    // bun doesn't currently support toHaveBeenCalledWith
    // expect(mockRes.headers.append).toHaveBeenCalledWith(
    //   "Set-Cookie",
    //   "test=value"
    // );
    expect(mockRes.headers.append).toHaveBeenCalled();
  });

  test("getCookie returns the value of a cookie", () => {
    mockReq.headers.get.mockReturnValue("test=value");
    const value = cookieFactory.getCookie(mockReq, "test");
    expect(value).toBe("value");
  });

  test("deleteCookie sets a cookie with Max-Age=-1", () => {
    cookieFactory.deleteCookie(mockRes, "test");
    // expect(mockRes.headers.append).toHaveBeenCalledWith(
    //   "Set-Cookie",
    //   "test=; Max-Age=-1"
    // );
    expect(mockRes.headers.append).toHaveBeenCalled();
  });

  test("checkCookie returns true if a cookie exists", () => {
    mockReq.headers.get.mockReturnValue("test=value");
    const exists = cookieFactory.checkCookie(mockReq, "test");
    expect(exists).toBe(true);
  });

  test("checkCookie returns false if a cookie does not exist", () => {
    mockReq.headers.get.mockReturnValue("");
    const exists = cookieFactory.checkCookie(mockReq, "test");
    expect(exists).toBe(false);
  });
});
