export function parseQueryParams<ParamsT extends object = {}>(
  request: Request
): ParamsT {
  const url = new URL(request.url);
  const params: ParamsT = {} as ParamsT;

  url.searchParams.forEach((value, key) => {
    // @ts-ignore
    params[key] = value as any;
  });

  return params;
}

export function parseRequestHeaders<HeadersT>(
  request: Request
): HeadersT {
  return request.headers.toJSON() as unknown as HeadersT;
}

export type JSONResType = <JSONBodyGeneric extends object>(
  body: JSONBodyGeneric,
  options?: ResponseInit
) => Response | Promise<Response>;

export const jsonRes: JSONResType = (body, options) => {
  return new Response(JSON.stringify(body), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

export function htmlRes(body: string, options?: ResponseInit): Response {
  return new Response(body, {
    ...options,
    headers: {
      "Content-Type": "text/html",
      ...options?.headers,
    },
  });
}
