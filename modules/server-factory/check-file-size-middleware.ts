import { Middleware } from "utils/http-types";

export function checkFileSizeMiddleware(maxSize: number): Middleware {
  return (request, next) => {
    if (Number(request.headers.get("Content-Length")) > maxSize) {
      return new Response("File too large", { status: 413 });
    }
    return next();
  };
}
