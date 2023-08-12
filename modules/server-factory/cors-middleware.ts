import { Middleware } from "./server-factory";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "OPTIONS"
  | "HEAD";

type CommonHttpHeaders =
  | "Accept"
  | "Authorization"
  | "Cache-Control"
  | "Content-Type"
  | "Date"
  | "Host"
  | "Origin"
  | "Referer"
  | "User-Agent"
  | "X-Requested-With"
  | "X-Forwarded-For"
  | "X-HTTP-Method-Override"
  | string; // This allows for custom headers in addition to the common ones.

type CorsOptions = {
  allowedOrigins?: string[];
  allAllOrigins?: boolean;
  allowedMethods?: HttpMethod[];
  allowedHeaders?: CommonHttpHeaders[];
};

export const createCorsMiddleware = (
  options?: Partial<CorsOptions>
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
