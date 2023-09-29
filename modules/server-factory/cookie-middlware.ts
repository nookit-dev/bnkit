import { createServerCookieFactory } from "../cookie-factory";
import { Middleware } from "../utils/http-types";

export const createCookieMiddleware = (): Middleware => {
  const cookieFactory = createServerCookieFactory();

  return async ({ request, next }) => {
    const getCookie = (name: string) => cookieFactory.getCookie(request, name);
    const checkCookie = (name: string) =>
      cookieFactory.checkCookie(request, name);

    const originalResponse = await next();

    // Clone the original response to make it editable
    const response = new Response(originalResponse.body, {
      status: originalResponse.status,
      statusText: originalResponse.statusText,
      headers: originalResponse.headers,
    });

    const setCookie = (
      name: string,
      value: string,
      options: CookieOptions = {}
    ) => {
      cookieFactory.setCookie(response, name, value, options);
    };

    const deleteCookie = (name: string) =>
      cookieFactory.deleteCookie(response, name);

    return {
      ...response,
      setCookie,
      deleteCookie,
    };
  };
};
