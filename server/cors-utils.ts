import { CORSOptions, HttpMethod } from "../utils/http-types";

export const log = (message: string) => {
  console.error(message);
};

export const addHeaderIfOptionSet = (
  headers: Headers,
  headerName: string,
  option?: string | boolean
) => {
  if (option) {
    headers.set(headerName, option.toString());
  }
};

export const createCORSErrorResponse = (message: string, status: number) => {
  console.error(message);
  return new Response(`CORS Error: ${message}`, { status });
};

export const isOriginAllowed = (
  allowedOrigins: string[],
  requestOrigin: string
): boolean =>
  allowedOrigins.includes("*") || allowedOrigins.includes(requestOrigin);

export const isMethodAllowed = (
  allowedMethods: string[],
  requestMethod: string
): boolean => allowedMethods.includes(requestMethod);

export const buildControlHeaders = ({
  options,
  requestOrigin,
  headersRef,
}: {
  options: Partial<CORSOptions>;
  requestOrigin: string;
  headersRef?: Headers;
}) => {
  const headers = headersRef || new Headers();

  addHeaderIfOptionSet(
    headers,
    "Access-Control-Allow-Origin",
    options.origins?.includes("*") ? "*" : requestOrigin
  );
  addHeaderIfOptionSet(
    headers,
    "Access-Control-Allow-Methods",
    options.methods?.join(", ")
  );
  addHeaderIfOptionSet(
    headers,
    "Access-Control-Allow-Headers",
    options.headers?.join(", ")
  );
  addHeaderIfOptionSet(
    headers,
    "Access-Control-Allow-Credentials",
    options.credentials
  );

  return headers;
};

export type SetCorsHeaders = {
  options: Partial<CORSOptions>;
  requestOrigin: string;
  response: Response;
};

export const setCORSHeaders = ({
  options,
  requestOrigin,
  response,
}: SetCorsHeaders) =>
  buildControlHeaders({ options, requestOrigin, headersRef: response.headers });

export const setCORSHeadersAsync = async ({
  options,
  requestOrigin,
  response,
}: SetCorsHeaders & {
  response: Promise<Response>;
}) => {
  const res = await response;
  return buildControlHeaders({
    options,
    requestOrigin,
    headersRef: res.headers,
  });
};

export const createErrorResponse = (
  message: string,
  status: number,
  logMessage?: string
) => {
  logMessage && log(logMessage);
  return new Response(`CORS Error: ${message}`, { status });
};

export function setCORSHeadersIfOriginPresent(
  options: Partial<CORSOptions>,
  requestOrigin: string | null,
  response: Response
) {
  if (requestOrigin !== null) {
    setCORSHeaders({
      response,
      options,
      requestOrigin,
    });
  }
}

export function applyResponseHeaders(
  response: Response,
  requestOrigin: Request,
  options: Partial<CORSOptions>
) {
  const origin = requestOrigin.headers.get("Origin");
  setCORSHeadersIfOriginPresent(options, origin, response);
}

export function checkMethodAllowed(
  method: string,
  allowedMethods: HttpMethod[]
): Response | null {
  if (!isMethodAllowed(allowedMethods, method)) {
    console.error(`Method ${method} is not allowed.`);
    return createErrorResponse(`Method ${method} is not allowed.`, 405);
  }
  return null;
}

export function handleOptionsRequest(
  request: Request,
  allowedMethods: HttpMethod[],
  requestOrigin: string | null,
  options: Partial<CORSOptions>
): Response | null {
  if (request.method === "OPTIONS") {
    const requestMethod = request.headers.get("Access-Control-Request-Method");
    const response = new Response(null, { status: 204 });
    setCORSHeadersIfOriginPresent(options, requestOrigin, response);

    if (!isMethodAllowed(allowedMethods, requestMethod || "")) {
      console.error(`Method ${requestMethod} is not allowed.`);
      return createErrorResponse(
        `Method ${requestMethod} is not allowed.`,
        405
      );
    }
    return response;
  }
  return null;
}

export function validateOrigin(
  requestOrigin: string,
  allowedOrigins: string[]
): Response | null {
  if (!isOriginAllowed(allowedOrigins, requestOrigin)) {
    return createCORSErrorResponse(
      `Origin ${requestOrigin} is not allowed.`,
      403
    );
  }
  return null;
}

export function handleMissingOrigin(
  requestOrigin: string | null,
  allowedOrigins: string[]
): Response | null {
  if (!requestOrigin && !allowedOrigins.includes("*")) {
    return createCORSErrorResponse("Missing Origin header.", 400);
  }
  return null;
}
