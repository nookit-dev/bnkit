import { CORSOptions, HttpMethod, Middleware } from "../utils/http-types";

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

export const setCORSHeaders = (
  response: Response,
  options: Partial<CORSOptions>,
  requestOrigin: string
) => {
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
};

export const createCorsMiddleware = (
  options: Partial<CORSOptions>
): Middleware => {
  const defaultMethods: HttpMethod[] = ["GET", "POST", "PUT", "DELETE"]; // Adjust type if HttpMethod[] is desired
  const defaultHeaders = ["Content-Type"];
  const allowedOrigins: CORSOptions["origins"] = options.origins || [];
  const allowedMethods: HttpMethod[] = options.methods || defaultMethods;
  const allowedHeaders: CORSOptions["headers"] =
    options.headers || defaultHeaders;

  return async ({ request, next }) => {
    const requestOrigin = request.headers.get("Origin");
    if (!requestOrigin) {
      console.error("Request does not have an Origin header.");
      return new Response("Bad Request: Missing Origin header.", {
        status: 400,
      });
    }

    if (!isOriginAllowed(allowedOrigins, requestOrigin)) {
      console.error(`Origin ${requestOrigin} is not allowed.`);
      return new Response(
        `CORS Error: Origin ${requestOrigin} is not allowed.`,
        { status: 403 }
      );
    }

    if (request.method === "OPTIONS") {
      const requestMethod = request.headers.get(
        "Access-Control-Request-Method"
      );

      const response = new Response(null, { status: 204 }); // Assuming allowed by default
      setCORSHeaders(
        response,
        {
          origins: allowedOrigins,
          methods: allowedMethods,
          headers: allowedHeaders,
        },
        requestOrigin
      );

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
    const response = await next();
    setCORSHeaders(
      response,
      {
        origins: allowedOrigins,
        methods: allowedMethods,
        headers: allowedHeaders,
      },
      requestOrigin
    );

    return response;
  };
};

export const allowAllOriginsMiddleware = (): Middleware => {
  return async ({ request, next }) => {
    const response = await next();

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  };
};
