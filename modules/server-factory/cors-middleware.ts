import { Middleware, CORSOptions } from "utils/http-types";

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
    const response = await next(); // Call the next middleware or handler

    // Check if the request's origin is in the list of allowed origins
    const requestOrigin = request.headers.get("Origin");
    if (
      requestOrigin &&
      (allowedOrigins?.includes("*") || allowedOrigins?.includes(requestOrigin))
    ) {
      response.headers.set("Access-Control-Allow-Origin", requestOrigin);
    }

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
