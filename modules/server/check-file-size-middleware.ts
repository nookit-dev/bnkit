import { Middleware } from "../utils/http-types";

export function checkFileSizeMiddleware<MiddlewareDataCtx extends object = {}>(
  maxSize: number
): Middleware<MiddlewareDataCtx> {
  return ({ request, next }) => {
    if (Number(request.headers.get("Content-Length")) > maxSize) {
      return new Response("File too large", { status: 413 });
    }
    return next();
  };
}
