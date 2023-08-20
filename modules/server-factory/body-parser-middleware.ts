import { Middleware } from "../utils/http-types";

const parsedBodies = new WeakMap<Request, any>();

export const bodyParserMiddleware: Middleware = async (request, next) => {
  const contentType = request.headers.get("Content-Type");

  if (contentType && contentType.includes("application/json")) {
    const rawBody = await request.text();
    try {
      const parsed = JSON.parse(rawBody);
      parsedBodies.set(request, parsed);
    } catch (error) {
      console.error("Failed to parse JSON body:", error);
      // Consider returning an error response here, if required
    }
  } else {
    // Handle other content types here
    parsedBodies.set(request, await request.text());
  }

  return next();
};

export function getParsedBody<T>(request: Request): T {
  return parsedBodies.get(request) as T;
}
