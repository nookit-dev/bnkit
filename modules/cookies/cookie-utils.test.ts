import { afterEach, describe, expect, it } from "bun:test";
import {
  parseCookieData,
  retrieveRawCookieValue,
  setCookie,
  stringifyCookieData,
} from "./cookie-utils";
import { CookieOptions } from "./cookie-types";

describe("Cookie Helpers", () => {
  describe("parseCookieData", () => {
    it("should parse JSON string to object", () => {
      const jsonString = '{"key": "value"}';
      expect(parseCookieData(jsonString)).toEqual({ key: "value" });
    });

    it("should return string if parsing fails", () => {
      const invalidJson = "{key: 'value'}";
      expect(parseCookieData(invalidJson)).toBe(invalidJson);
    });

    it("should return null if input is null", () => {
      expect(parseCookieData(null)).toBeNull();
    });
  });

  describe("stringifyCookieData", () => {
    it("should stringify object to JSON string", () => {
      const obj = { key: "value" };
      expect(stringifyCookieData(obj)).toBe('{"key":"value"}');
    });

    it("should return string as is", () => {
      const str = "testString";
      expect(stringifyCookieData(str)).toBe(str);
    });
  });
});

describe("retrieveRawCookieValue", () => {
  // Save original document.cookie
  const originalDocumentCookie = document.cookie;

  afterEach(() => {
    // Restore original document.cookie after each test
    document.cookie = originalDocumentCookie;
  });

  it("should return the correct cookie value", () => {
    document.cookie = "testCookie=testValue; anotherCookie=anotherValue";
    expect(retrieveRawCookieValue("testCookie")).toBe("testValue");
  });

  it("should return null if cookie is not found", () => {
    document.cookie = "testCookie=testValue; anotherCookie=anotherValue";
    expect(retrieveRawCookieValue("nonExistentCookie")).toBeNull();
  });

  it("should decode URI encoded cookie names and values", () => {
    document.cookie =
      "encodedName%3D=encodedValue%3D; anotherCookie=anotherValue";
    expect(retrieveRawCookieValue("encodedName=")).toBe("encodedValue=");
  });

  it("should handle cookies with no value", () => {
    document.cookie = "emptyCookie=; anotherCookie=anotherValue";
    expect(retrieveRawCookieValue("emptyCookie")).toBe("");
  });
});

export const encodeCookie = <T>(
  cookieKey: string,
  value: T,
  options: CookieOptions
): string => {
  let cookieString = `${encodeURIComponent(cookieKey)}=${encodeURIComponent(
    typeof value === "string" ? value : JSON.stringify(value)
  )}`;

  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += `; secure`;
  }

  if (options.httpOnly) {
    cookieString += `; httpOnly`;
  }

  return cookieString;
};

describe("setCookie", () => {
  it("should set a cookie with options", () => {
    setCookie("foo", "bar", {
      maxAge: 60,
      path: "/",
      domain: "example.com",
      secure: true,
      httpOnly: true,
    });

    expect(document.cookie).toContain("foo=bar");
    expect(document.cookie).toContain("max-age=60");
    expect(document.cookie).toContain("path=/");
    expect(document.cookie).toContain("domain=example.com");
    expect(document.cookie).toContain("secure");
    expect(document.cookie).toContain("httpOnly");
  });
});
