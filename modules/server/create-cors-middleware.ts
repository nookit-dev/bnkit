import { CORSOptions, HttpMethod, Middleware } from "../utils/http-types";

const DEFAULT_METHODS = ["POST", "GET", "OPTIONS"];
const DEFAULT_HEADERS = ["Content-Type"];
const ALLOW_ALL_ORIGINS = "*";

// Example: Error Handling Utility
const createCORSErrorResponse = (message: string, status: number) => {
  console.error(message);
  return new Response(`CORS Error: ${message}`, { status });
};

// Example: Validation Utility
const isValidOrigin = (
  allowedOrigins: string[],
  requestOrigin: string
): boolean => {
  return (
    allowedOrigins.includes(ALLOW_ALL_ORIGINS) ||
    allowedOrigins.includes(requestOrigin)
  );
};

// Example: Set Default Headers
const setDefaultHeaders = (response: Response, reqOrigin: string) => {
  response.headers.append("Access-Control-Allow-Origin", reqOrigin);
  response.headers.append(
    "Access-Control-Allow-Methods",
    DEFAULT_METHODS.join(", ")
  );
  response.headers.append(
    "Access-Control-Allow-Headers",
    DEFAULT_HEADERS.join(", ")
  );
  response.headers.append("Access-Control-Allow-Credentials", "true");
  response.headers.append("Content-Type", "application/json");
};

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

export const setCORSHeaders = ({
  options,
  requestOrigin,
  response,
}: {
  response: Response;
  options: Partial<CORSOptions>;
  requestOrigin: string;
}) => {
  if (options.origins?.includes("*")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
  } else {
    response.headers.set("Access-Control-Allow-Origin", requestOrigin);
  }
  if (options.methods) {
    response.headers.set(
      "Access-Control-Allow-Methods",
      options.methods.join(", ")
    );
  }
  if (options.headers) {
    response.headers.set(
      "Access-Control-Allow-Headers",
      options.headers.join(", ")
    );
  }

  if (options.credentials) {
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
};

export const createCorsMiddleware = <MiddlewareCtx extends object = {}>(
  options: Partial<CORSOptions>
): Middleware<MiddlewareCtx> => {
  const defaultMethods: HttpMethod[] = ["GET", "POST", "PUT", "DELETE"]; // Adjust type if HttpMethod[] is desired
  const defaultHeaders = ["Content-Type"];
  const allowedOrigins: CORSOptions["origins"] = options.origins || [];
  const allowedMethods: HttpMethod[] = options.methods || defaultMethods;
  const allowedHeaders: CORSOptions["headers"] =
    options.headers || defaultHeaders;
  const enableCredentials = options.credentials || false;

  const allOriginsAllowed = allowedOrigins.includes("*");

  return ({ request, next }) => {
    const requestOrigin = request.headers.get("Origin");

    if (!requestOrigin && !allowedOrigins.includes(ALLOW_ALL_ORIGINS)) {
      return createCORSErrorResponse("Missing Origin header.", 400);
    }

    if (!isValidOrigin(allowedOrigins, requestOrigin || "")) {
      return createCORSErrorResponse(
        `Origin ${requestOrigin} is not allowed.`,
        403
      );
    }

    if (request.method === "OPTIONS") {
      if (requestOrigin === null) {
        console.error("Request does not have an Origin header.");
        return new Response("Bad Request: Missing Origin header.", {
          status: 400,
        });
      }

      const requestMethod = request.headers.get(
        "Access-Control-Request-Method"
      );

      const response = new Response(null, { status: 204 }); // Assuming allowed by default
      setCORSHeaders({
        response,
        options: {
          origins: allowedOrigins,
          methods: allowedMethods,
          headers: allowedHeaders,
          credentials: enableCredentials,
        },
        requestOrigin,
      });

      if (!isMethodAllowed(allowedMethods, requestMethod || "")) {
        console.error(`Method ${requestMethod} is not allowed.`);

        return new Response(
          `CORS Error: Method ${requestMethod} is not allowed.`,
          {
            status: 405,
            statusText: `CORS Error: Method ${requestMethod} is not allowed.`,
          }
        );
      }
      return response;
    }

    if (!isMethodAllowed(allowedMethods, request.method)) {
      console.error(`Method ${request.method} is not allowed.`);
      return new Response(
        `CORS Error: Method ${request.method} is not allowed.`,
        {
          status: 405,
          statusText: `CORS Error: Method ${request.method} is not allowed.`,
        }
      );
    }

    const response = next?.({}) || new Response(null, { status: 204 });
    if (allowedOrigins.includes(ALLOW_ALL_ORIGINS)) {
      setDefaultHeaders(response, requestOrigin || ALLOW_ALL_ORIGINS);
    }

    // If all origins are allowed, then set the Access-Control-Allow-Origin header to "*"
    // regardless of whether the request had an Origin header or not.
    if (allOriginsAllowed) {
      response.headers.set("Access-Control-Allow-Origin", "*");
    } else if (requestOrigin !== null) {
      setCORSHeaders({
        response,
        options: {
          origins: allowedOrigins,
          methods: allowedMethods,
          headers: allowedHeaders,
          credentials: enableCredentials,
        },
        requestOrigin,
      });
    }

    if (requestOrigin !== null) {
      setCORSHeaders({
        response,
        options: {
          origins: allowedOrigins,
          methods: allowedMethods,
          headers: allowedHeaders,
          credentials: enableCredentials,
        },
        requestOrigin,
      });
    }

    return response;
  };
};

export const allowAllOriginsMiddleware = <
  MiddlewareCtx extends object = {}
>(): Middleware<MiddlewareCtx> => {
  return ({ request, next }) => {
    const response = next?.({}) || new Response();

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  };
};
