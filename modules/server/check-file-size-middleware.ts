import { Middleware } from "../utils/http-types";

export function checkFileSizeMiddleware<MiddlewareCtx extends object = {}>(
  maxSize: number
): Middleware<MiddlewareCtx> {
  return ({ request, next }) => {
    if (Number(request.headers.get("Content-Length")) > maxSize) {
      return new Response("File too large", { status: 413 });
    }
    return next();
  };
}
