export function createServerCookieFactory() {
  const setCookie = (
    res: Response,
    name: string,
    value: string,
    options: CookieOptions = {}
  ) => {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    if (options.maxAge) {
      cookieString += `; Max-Age=${options.maxAge}`;
    }

    if (options.path) {
      cookieString += `; Path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; Domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += `; Secure`;
    }

    if (options.httpOnly) {
      cookieString += `; HttpOnly`;
    }

    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }

    // For HTTP/2, multiple Set-Cookie headers are allowed
    res.headers.append("Set-Cookie", cookieString);
  };

  const getCookie = (req: Request, name: string) => {
    const cookies = parseCookies(req.headers.get("Cookie") || "");
    return cookies[name];
  };

  const deleteCookie = (res: Response, name: string) => {
    setCookie(res, name, "", { maxAge: -1 });
  };

  const checkCookie = (req: Request, name: string) => {
    return getCookie(req, name) !== undefined;
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
  sameSite?: "Strict" | "Lax" | "None";
};

function parseCookies(cookiesString: string) {
  const cookies: { [name: string]: string } = {};
  const pairs = cookiesString.split(";");

  pairs.forEach((pair) => {
    const [name, ...rest] = pair.split("=");
    cookies[name.trim()] = rest.join("=").trim();
  });

  return cookies;
}
