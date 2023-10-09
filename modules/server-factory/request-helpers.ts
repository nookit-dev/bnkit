export function parseQueryParams<ParamsType extends object = {}>(
  request: Request
): ParamsType {
  const url = new URL(request.url);
  const params: ParamsType = {} as ParamsType;

  url.searchParams.forEach((value, key) => {
    // @ts-ignore
    params[key] = value as any;
  });

  return params;
}

export function parseRequestHeaders<HeadersType>(
  request: Request
): HeadersType {
  return request.headers.toJSON() as unknown as HeadersType;
}

export type JSONResType = <JSONBodyGeneric extends object>(
  body: JSONBodyGeneric,
  options?: ResponseInit,
  response?: Response
) => Response;

// json res creates it's own response object, but if one is passed in, it will copy headers
export const jsonRes: JSONResType = (body, options = {}, response) => {
  // handle if a response is passed in, we mostly want to copy cors/cookie headers
  //combine options and  response  headers
  const combinedHeaders: HeadersInit = {
    ...options?.headers,
    ...new Headers(response?.headers),
  };
  const headers = new Headers(combinedHeaders);

  return new Response(JSON.stringify(body), {
    ...options,
    headers: {
      ...headers,
      // jsonRes should allows have json content type
      "Content-Type": "application/json",
    },
  });
}

export function htmlRes(body: string, options?: ResponseInit): Response {
  return new Response(body, {
    ...options,
    headers: {
      "Content-Type": "text/html",
      ...options?.headers,
    },
  });
}
