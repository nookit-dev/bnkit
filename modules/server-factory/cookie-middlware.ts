import { createServerCookieFactory } from "../cookie-factory";
import { CookieOptions } from "../cookie-factory/server-side-cookie-factory";
import { Middleware } from "../utils/http-types";

export type CookieContext = {
  getCookie: (name: string) => string | undefined;
  checkCookie: (name: string) => boolean;
  setCookie: (name: string, value: string, options?: CookieOptions) => void;
  deleteCookie: (name: string) => void;
};

export const createCookieMiddleware = (): Middleware<CookieContext> => {
  const cookieFactory = createServerCookieFactory();

  return async ({ request, next, context }) => {
    const getCookie = (name: string) => cookieFactory.getCookie(request, name);
    const checkCookie = (name: string) =>
      cookieFactory.checkCookie(request, name);

    const response = await next(context);

    const setCookie = (
      name: string,
      value: string,
      options: CookieOptions = {}
    ) => {
      cookieFactory.setCookie(response, name, value, options);
    };

    const deleteCookie = (name: string) =>
      cookieFactory.deleteCookie(response, name);

    if (context) {
      context.getCookie = getCookie;
      context.checkCookie = checkCookie;
      context.setCookie = setCookie;
      context.deleteCookie = deleteCookie;
    }

    return next({ checkCookie, getCookie, setCookie, deleteCookie });
  };
};
