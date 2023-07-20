export function createClientCookieFactory() {
  const setCookie = (
    name: string,
    value: string,
    options: CookieOptions = {}
  ) => {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
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

    document.cookie = cookieString;
  };

  const getCookie = (name: string) => {
    const cookieArr = document.cookie.split("; ");

    for (let i = 0; i < cookieArr.length; i++) {
      const cookiePair = cookieArr[i].split("=");
      if (name == decodeURIComponent(cookiePair[0])) {
        return decodeURIComponent(cookiePair[1]);
      }
    }

    return null;
  };

  const deleteCookie = (name: string) => {
    setCookie(name, "", { maxAge: -1 });
  };

  const checkCookie = (name: string) => {
    return getCookie(name) !== null;
  };

  return {
    setCookie,
    getCookie,
    deleteCookie,
    checkCookie,
  };
}

type CookieOptions = {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
};
