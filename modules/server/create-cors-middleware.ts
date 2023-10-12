import { CORSOptions, Middleware } from "../utils/http-types";
import {
  checkMethodAllowed,
  handleMissingOrigin,
  handleOptionsRequest,
  setCORSHeadersIfOriginPresent,
  validateOrigin,
} from "./cors-utils";

export const createCorsMiddleware = <MiddlewareCtx extends object = {}>(
  options: Partial<CORSOptions>
): Middleware<MiddlewareCtx> => {
  const origins = options.origins || [];
  const methods = options.methods || [];
  
  return ({ request, next }) => {
    const requestOrigin = request.headers.get("Origin");

    let response =
      handleMissingOrigin(requestOrigin, origins) ||
      validateOrigin(requestOrigin || "", origins) ||
      handleOptionsRequest(request, methods, requestOrigin, options) ||
      checkMethodAllowed(request.method, methods) ||
      next?.({}) ||
      new Response(null, { status: 204 });

    setCORSHeadersIfOriginPresent(options, requestOrigin, response);

    return response;
  };
};
