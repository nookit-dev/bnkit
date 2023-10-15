import { CORSOptions } from "../utils/http-types";
import {
  checkMethodAllowed,
  handleMissingOrigin,
  handleOptionsRequest,
  setCORSHeadersIfOriginPresent,
  validateOrigin,
} from "./cors-utils";
import { Middleware } from "./middleware-manager";

type CORSMidWareRet = {
  // headers: Headers;
  // headersToObj: (headers: Headers) => Record<string, string>;
  response: Response;
};

export const corsMiddleware: Middleware<
  Partial<CORSOptions>,
  CORSMidWareRet
> = (request, options): CORSMidWareRet => {
  const headers = new Headers();
  const origins = options?.origins || [];
  const methods = options?.methods || [];

  const headersToObj = (headers: Headers) => {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  };

  const requestOrigin = request.headers.get("Origin");

  let response =
    handleMissingOrigin(requestOrigin, origins) ||
    validateOrigin(requestOrigin || "", origins) ||
    handleOptionsRequest(request, methods, requestOrigin, options || {}) ||
    checkMethodAllowed(request.method, methods) ||
    new Response(null, { status: 204 });
  // next?.({}) ||

  setCORSHeadersIfOriginPresent(options || {}, requestOrigin, response);

  return {
    response,
    // headers, headersToObj };
  };
};
