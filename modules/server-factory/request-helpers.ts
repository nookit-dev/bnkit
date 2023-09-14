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
  options?: ResponseInit
) => Response;

export const jsonRes: JSONResType = (body, options): Response => {
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
