import { CookieOptions } from "./cookie-types";

declare var document: {
  cookie: any;
};

export const parseCookieData = <T = string>(data: string | null): T | null => {
  if (data === null) return null;

  try {
    return JSON.parse(data) as T;
  } catch (e) {
    // If parsing fails, assume the data is a string
    return data as unknown as T;
  }
};

export const stringifyCookieData = <T>(data: T): string => {
  if (typeof data === "string") {
    return data;
  } else {
    return JSON.stringify(data);
  }
};

export const retrieveRawCookieValue = (name: string): string | null => {
  const cookieArr = document.cookie.split("; ");

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split("=");
    if (name === decodeURIComponent(cookiePair[0])) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
};

export const encodeCookie = <T>(cookieKey: string, value: T, options:CookieOptions): string => {
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
}


export const setCookie = <T>(
  cookieKey: string,
  value: T,
  options: CookieOptions
) => {
  document.cookie = encodeCookie(cookieKey, value, options);
};

export function parseCookies(cookiesString: string) {
  const cookies: { [name: string]: string } = {};
  const pairs = cookiesString.split(";");

  pairs.forEach((pair) => {
    const [name, ...rest] = pair.split("=");
    cookies[name.trim()] = rest.join("=").trim();
  });

  return cookies;
}
