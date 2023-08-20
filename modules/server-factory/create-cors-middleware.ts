import { CORSOptions, Middleware } from "utils/http-types";

export const createCorsMiddleware = (
  options?: Partial<CORSOptions>
): Middleware => {
  // Default values
  const defaultMethods = ["GET", "POST", "PUT", "DELETE"];
  const defaultHeaders = ["Content-Type"];

  // Merge default values with provided options
  let allowedOrigins = options?.allowedOrigins;

  if (options?.allAllOrigins) {
    allowedOrigins = ["*"];
  }

  const allowedMethods = options?.allowedMethods || defaultMethods;
  const allowedHeaders = options?.allowedHeaders || defaultHeaders;

  return async (request, next) => {
    const requestOrigin = request.headers.get("Origin");

    if (!requestOrigin) {
      console.error("Request does not have an Origin header.");
      return new Response("Bad Request: Missing Origin header.", {
        status: 400,
      });
    }

    if (
      !allowedOrigins?.includes("*") &&
      !allowedOrigins?.includes(requestOrigin)
    ) {
      console.error(`Origin ${requestOrigin} is not allowed.`);
      return new Response(
        `CORS Error: Origin ${requestOrigin} is not allowed.`,
        { status: 403 }
      );
    }

    if (request.method === "OPTIONS") {
      // Check if the request's method is allowed
      const requestMethod = request.headers.get(
        "Access-Control-Request-Method"
      );
      if (requestMethod && !allowedMethods.includes(requestMethod)) {
        console.error(`Method ${requestMethod} is not allowed.`);
        return new Response(
          `CORS Error: Method ${requestMethod} is not allowed.`,
          { status: 405 }
        );
      }

      let response = new Response(null, { status: 204 }); // 204 No Content

      // Attach the CORS headers
      response.headers.set("Access-Control-Allow-Origin", requestOrigin);
      response.headers.set(
        "Access-Control-Allow-Methods",
        allowedMethods.join(", ")
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        allowedHeaders.join(", ")
      );

      return response;
    }

    // For non-OPTIONS requests, process as usual
    const response = await next();

    response.headers.set("Access-Control-Allow-Origin", requestOrigin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      allowedMethods.join(", ")
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      allowedHeaders.join(", ")
    );

    return response;
  };
};
