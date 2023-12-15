import { CORSOptions } from "../utils/http-types";
import { Middleware } from "./middleware-types";

const setAllowOrigin = (headers: Headers, originToSet: string) =>
  headers.set("Access-Control-Allow-Origin", originToSet || "");
const setAllowMethods = (headers: Headers, methods: string[]) =>
  headers.set("Access-Control-Allow-Methods", methods.join(", "));
const addAllowHeader = (headers: Headers, options?: CORSOptions) => {
  if (options?.allowedHeaders?.join) {
    headers.set("Access-Control-Allow-Headers", options.allowedHeaders.join(", "));
  }
};

const setAllowCredentials = (headers: Headers, options?: CORSOptions) =>
  options?.credentials && headers.set("Access-Control-Allow-Credentials", "true");

export const configCorsMW = (options?: CORSOptions, debug = false) => {
  const allowedMethods: string[] = options?.allowedMethods || [];

  const log = (input: unknown[] | unknown) => {
    if (debug) {
      console.log(input);
    }
  };

  const sendErrorResponse = (status: number, statusText: string, detail: string, headers?: Headers) => {
    const errorResponse = { statusText, detail };
    if (debug) {
      console.error(errorResponse);
    }

    const finalHeaders = headers;

    finalHeaders?.set("Content-Type", "application/json");

    return new Response(JSON.stringify(errorResponse), {
      status,
      headers: finalHeaders,
    });
  };

  const requestHandler: Middleware<{}> = (request: Request, next: () => Promise<Response>) => {
    const reqMethod = request.method;
    const reqOrigin = request.headers.get("Origin");
    const allowedOrigins = options?.allowedOrigins || [];
    const originAllowed = allowedOrigins.includes(reqOrigin || "");

    if (debug && !originAllowed) {
      log({
        allowedOrigins,
        reqOrigin,
        originAllowed,
      });
    }

    // if (originToSet) {
    const headers = new Headers();
    const originToSet = allowedOrigins.includes("*") ? "*" : reqOrigin;

    if (!reqOrigin) {
      return sendErrorResponse(400, "Bad Request", "Origin header missing");
    }

    // Set Access-Control-Allow-Origin header
    setAllowOrigin(headers, originToSet || "");

    // Set Access-Control-Allow-Methods header
    setAllowMethods(headers, allowedMethods);

    // Set Access-Control-Allow-Headers header
    addAllowHeader(headers, options);

    // Set Access-Control-Allow-Credentials header
    setAllowCredentials(headers, options);

    if (originAllowed && allowedMethods.includes(request.method)) {
      return next();
    }

    // check if request method is options and allowed
    if (reqMethod === "OPTIONS") {
      const optionRequestMethod = request.headers.get("Access-Control-Allow-Methods");

      if (!allowedMethods.includes(optionRequestMethod || "")) {
        return sendErrorResponse(405, "Method Not Allowed", `Method ${optionRequestMethod} is not allowed`, headers);
      }

      if (!headers) {
        return sendErrorResponse(500, "Internal Server Error", "Missing headers for options return", headers);
      }

      // Set Access-Control-Max-Age for caching preflight request
      // headers.set("Access-Control-Max-Age", "600"); // 10 minutes
      return new Response(null, { status: 204, headers });
    }

    if (!allowedOrigins.includes(reqOrigin || "")) {
      setAllowMethods(headers, allowedMethods);
      return sendErrorResponse(403, "Forbidden", `Origin ${reqOrigin} not allowed`, headers);
    }

    if (!allowedMethods.includes(request.method)) {
      return sendErrorResponse(405, "Method Not Allowed", `Method ${reqMethod} not allowed`, headers);
    }

    return new Response(null, { status: 200, headers });
  };

  return requestHandler;
};
