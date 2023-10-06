import { CookieOptions } from "./cookie-types";
import {
  parseCookieData,
  retrieveRawCookieValue,
  setCookie,
} from "./cookie-utils";

declare var document: {
  cookie: any;
};

export function createClientCookieFactory<T = string>(
  cookieKey: string,
  options?: CookieOptions
) {
  const handleSetCookie = (
    value: T,
    options?: CookieOptions & {
      cookieKey?: string; // optionally override cookie  key
    }
  ) => {
    setCookie(cookieKey, value, options || {});
  };
  const getRawCookie = (name: string = cookieKey) => {
    return retrieveRawCookieValue(name);
  };

  const deleteCookie = (name: string = cookieKey) => {
    handleSetCookie("" as T, { maxAge: -1 });
  };

  const checkCookie = (name: string = cookieKey) => {
    return getRawCookie(name) !== null;
  };

  const getParsedCookie = <T = string>(name: string = cookieKey): T | null => {
    const rawCookie = getRawCookie(name);
    return parseCookieData<T>(rawCookie);
  };

  return {
    setCookie: handleSetCookie,
    deleteCookie,
    checkCookie,
    getParsedCookie,
    getRawCookie,
  };
}
