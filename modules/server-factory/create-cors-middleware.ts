import { CORSOptions, Middleware } from "../utils/http-types";

export const isOriginAllowed = (
  allowedOrigins: string[],
  requestOrigin: string
): boolean => {
  return allowedOrigins.includes("*") || allowedOrigins.includes(requestOrigin);
};

export const isMethodAllowed = (
  allowedMethods: string[],
  requestMethod: string
): boolean => {
  return allowedMethods.includes(requestMethod);
};

export const createCorsMiddleware = (
  options?: Partial<CORSOptions>
): Middleware => {
  // Default values
  const defaultMethods = ["GET", "POST", "PUT", "DELETE"];
  const defaultHeaders = ["Content-Type"];

  // Merge default values with provided options
  let allowedOrigins = options?.allowedOrigins;

  if (options?.allowAllOrigins) {
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

    if (request.method === "OPTIONS") {
      const requestMethod = request.headers.get(
        "Access-Control-Request-Method"
      );
      if (!isMethodAllowed(allowedMethods, requestMethod || "")) {
        console.error(`Method ${requestMethod} is not allowed.`);
        const response = new Response(
          `CORS Error: Method ${requestMethod} is not allowed.`,
          { status: 405 }
        );
        response.headers.set("Access-Control-Allow-Origin", requestOrigin);
        return response;
      }
    }

    if (!isOriginAllowed(allowedOrigins || [], requestOrigin)) {
      console.error(`Origin ${requestOrigin} is not allowed.`);
      return new Response(
        `CORS Error: Origin ${requestOrigin} is not allowed.`,
        { status: 403 }
      );
    }

    if (request.method === "OPTIONS") {
      let response = new Response(null, { status: 204 }); // 204 No Content

      // Attach the CORS headers
      if (options?.allowAllOrigins) {
        response.headers.set("Access-Control-Allow-Origin", "*");
      } else {
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
    }

    // For non-OPTIONS requests, process as usual
    const response = await next();

    if (options?.allowAllOrigins) {
      response.headers.set("Access-Control-Allow-Origin", "*");
    } else {
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
