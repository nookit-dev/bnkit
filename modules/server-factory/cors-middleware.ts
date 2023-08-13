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
    console.log("middleware running");
    console.log({
      headers: request.headers,
      request,
      options,
      allowedOrigins,
    });

    if (request.method === "OPTIONS") {
      // Create a new response object with no content
      let response = new Response(null, { status: 204 }); // 204 No Content

      // Attach the CORS headers
      const requestOrigin = request.headers.get("Origin");
      if (
        requestOrigin &&
        (allowedOrigins?.includes("*") ||
          allowedOrigins?.includes(requestOrigin))
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

      console.log(response);

      return response; // Return the response immediately without calling next()
    }

    // For non-OPTIONS requests, process as usual

    const response = await next();

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

    console.log(response);

    return response;
  };
};
