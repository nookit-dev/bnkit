import { ResBodyT } from "../utils/http-types";

export function parseQueryParams<ParamsType>(request: Request): ParamsType {
  const url = new URL(request.url);
  return url.searchParams as unknown as ParamsType;
}

export function parseRequestHeaders<HeadersType>(request: Request): HeadersType {
  return request.headers as unknown as HeadersType;
}

export type JSONResType = <JSONBodyGeneric extends ResBodyT>(
  body: JSONBodyGeneric,
  options?: ResponseInit
) => Response;

export const jsonRes: JSONResType = (body, options): Response => {
  if (typeof body === "object") {
    return new Response(JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
  }
  return new Response(body, options);
};

export function htmlRes(body: string, options?: ResponseInit): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/html",
      ...options?.headers,
    },
    ...options,
  });
}
