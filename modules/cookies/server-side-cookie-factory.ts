import { CookieOptions } from "./cookie-types";
import {
  encodeCookie,
  parseCookieData,
  parseCookies,
  stringifyCookieData,
} from "./cookie-utils";

type CookieReqParams = {
  req?: Request;
  key?: string;
};

export function createServerCookieFactory<
  T = string,
  FactoryRequest extends Request = Request,
  FactoryRes extends Response = Response
>({
  cookieKey,
  options: optionsCfg,
  request,
  response,
}: {
  cookieKey: string;
  request?: FactoryRequest;
  response?: FactoryRes;
  options?: CookieOptions;
}) {
  const setCookie = (
    value: T,
    {
      options = optionsCfg || {},
      res = response,
    }: {
      options?: CookieOptions;
      res?: Response | undefined;
    } = {}
  ) => {
    let cookieValue =
      typeof value === "string" ? value : stringifyCookieData(value);

    const cookieString = encodeCookie(cookieKey, cookieValue, options);

    if (!res) {
      throw new Error("No response object provided");
    }

    res?.headers.append("Set-Cookie", cookieString);
  };

  const getAllCookies = <T extends object>(req = request): T => {
    const cookies = parseCookies(req?.headers.get("Cookie") || "");
    const parsedCookies: any = {};
    for (const [name, value] of Object.entries(cookies)) {
      parsedCookies[name] = parseCookieData(value) as any;
    }

    return parsedCookies as T;
  };

  const deleteCookie = (res = response) => {
    if (!res) {
      throw new Error("No response object provided");
    }
    setCookie("" as unknown as T, {
      options: { maxAge: -1 },
      res,
    });
  };

  const getCookie = (req = request): T | null => {
    if (!req) {
      throw new Error("No request object provided");
    }
    const cookies = parseCookies(req.headers.get("Cookie") || "");
    return parseCookieData<T>(cookies[cookieKey]);
  };

  const checkCookie = (req = request) => {
    return getCookie(req) !== null;
  };

  const getRawCookie = (req = request): string | null => {
    if (!req) {
      throw new Error("No request object provided");
    }

    const cookies = parseCookies(req.headers.get("Cookie") || "");
    return cookies[cookieKey] || null;
  };

  return {
    setCookie,
    getCookie,
    deleteCookie,
    checkCookie,
    getRawCookie,
    getAllCookies,
  };
}
