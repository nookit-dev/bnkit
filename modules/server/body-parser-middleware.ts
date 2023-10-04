import { MiddlwareParams } from "../utils/http-types";

const parsedBodies = new WeakMap<Request, any>();

export const bodyParser = async <MiddlewareCtx extends object = {}>({
  request,
  next,
  context,
  response,
}: MiddlwareParams<MiddlewareCtx>) => {
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

  if (!next) return response;

  return next({ request, context, response });
};

export function getParsedBody<T>(request: Request): T {
  return parsedBodies.get(request) as T;
}
