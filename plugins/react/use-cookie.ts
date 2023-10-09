import { CookieOptions } from "@u-tools/core/modules/cookies/cookie-types";
import { createClientCookieFactory } from "@u-tools/core/modules/cookies/create-client-side-cookie-factory";
import { useEffect, useState } from "react";

export function useCookie<T = string>(
  cookieKey: string,
  options?: CookieOptions
) {
  const cookie = createClientCookieFactory(cookieKey);

  const [cookieData, setCookieData] = useState<{ value: T | null }>(() => {
    return {
      value: cookie.getParsedCookie(),
    };
  });

  const getCookie = () => {
    return cookie.getRawCookie();
  };

  useEffect(() => {
    setCookieData({
      value: cookie.getParsedCookie(),
    });
  }, []);

  const refreshCookie = () => {
    setCookieData({
      value: cookie.getParsedCookie(),
    });
  };

  const updateCookie = (
    value: T,
    updateOptions: CookieOptions & {
      cookieKey?: string; // optionally override cookie  key
    } = options || {}
  ) => {
    const stringifiedValue = stringifyCookieData(value);
    cookie.setCookie(stringifiedValue, {
      ...options,
      ...updateOptions,
    });
    setCookieData({ value: value });
  };

  const removeCookie = () => {
    cookie.deleteCookie();
    setCookieData({ value: null });
  };

  const stringifyCookieData = (data: T): string => {
    if (typeof data === "string") {
      return data;
    } else {
      return JSON.stringify(data);
    }
  };

  const checkCookie = () => {
    return cookie.checkCookie();
  };

  return {
    cookie: cookieData.value,
    updateCookie,
    removeCookie,
    checkCookie,
    getCookie,
    refreshCookie,
  };
}

export default useCookie;
