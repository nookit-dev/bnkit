import { CookieOptions } from "./cookie-types";
import { parseCookieData, retrieveRawCookieValue } from "./cookie-utils";

declare var document: {
  cookie: any;
};

export function createClientCookieFactory<T = string>(
  cookieKey: string,
  options?: CookieOptions
) {
  const setCookie = (
    name: string = cookieKey,
    value: T,
    setOptions: CookieOptions = options || {}
  ) => {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      typeof value === "string" ? value : JSON.stringify(value)
    )}`;

    if (setOptions.maxAge) {
      cookieString += `; max-age=${setOptions.maxAge}`;
    }

    if (setOptions.path) {
      cookieString += `; path=${setOptions.path}`;
    }

    if (setOptions.domain) {
      cookieString += `; domain=${setOptions.domain}`;
    }

    if (setOptions.secure) {
      cookieString += `; secure`;
    }

    if (setOptions.httpOnly) {
      cookieString += `; httpOnly`;
    }

    document.cookie = cookieString;
  };

  const getRawCookie = (name: string = cookieKey) => {
    return retrieveRawCookieValue(name);
  };

  const deleteCookie = (name: string = cookieKey) => {
    setCookie(name, "" as T, { maxAge: -1 });
  };

  const checkCookie = (name: string = cookieKey) => {
    return getRawCookie(name) !== null;
  };

  const getParsedCookie = <T = string>(name: string = cookieKey): T | null => {
    const rawCookie = getRawCookie(name);
    return parseCookieData<T>(rawCookie);
  };

  return {
    setCookie,
    deleteCookie,
    checkCookie,
    getParsedCookie,
    getRawCookie,
  };
}
