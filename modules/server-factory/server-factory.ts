import { Server, WebSocketHandler } from "bun";
import { bodyParser, getParsedBody } from "./body-parser-middleware";
import {
  CorsOptions as CORSOptions,
  createCorsMiddleware,
} from "./cors-middleware";

export type RouteHandler = (request: Request) => Response | Promise<Response>;

export type ResponseBodyTypes =
  | ReadableStream
  | BlobPart
  | BlobPart[]
  | FormData
  | URLSearchParams
  | object
  | null;

export type Middleware = (
  request: Request,
  next: MiddlewareNext
) => Response | Promise<Response>;

export type MiddlewareNext = () => Response | Promise<Response>;

export interface RouteMap {
  [route: string]: RouteHandler;
}

export interface StartServerOptions {
  port?: number;
  hostname?: string;
  websocket?: WebSocketHandler;
  verbose?: boolean;
}

export interface RouteOptions {
  errorMessage?: string;
  onError?: (error: Error, request: Request) => Response | Promise<Response>;
}

export type ErrorHandler = (error: any, request: Request) => Response;

type BaseRouteRequestType = {
  body?: any;
  params?: object;
  headers?: object;
};

export type JSONRequest = BaseRouteRequestType & {
  body: object;
};

// figure out a way to set cors up for local dev automatically.

export function createServerFactory(
  {
    wsPaths,
    enableBodyParser,
    cors,
  }: { wsPaths?: string[]; enableBodyParser?: boolean; cors?: CORSOptions } = {
    wsPaths: [],
    enableBodyParser: true,
  }
) {
  const routes: RouteMap = {};
  let server: Server;
  let middlewares: Middleware[] = [];

  if (enableBodyParser) {
    middlewares.push(bodyParser);
  }

  if (cors) {
    middlewares.push(createCorsMiddleware(cors));
  }

  const middle = (middleware: Middleware) => {
    middlewares.push(middleware);
  };

  const compose = (
    middlewares: Middleware[],
    handler: RouteHandler
  ): RouteHandler => {
    return (request: Request) => {
      const invokeHandler: Middleware = (req, next) => handler(req);

      const finalMiddleware = middlewares.reduceRight(
        (nextMiddleware: Middleware, currentMiddleware: Middleware) => {
          return (currentRequest: Request) => {
            return currentMiddleware(currentRequest, () =>
              nextMiddleware(currentRequest, () => handler(request))
            );
          };
        },
        invokeHandler
      );

      return finalMiddleware(request, () => handler(request));
    };
  };

  const handleError = (
    err: Error,
    errorMessage: string,
    onErrorHandler?: (
      error: Error,
      request: Request
    ) => Response | Promise<Response>,
    request?: Request
  ) => {
    if (onErrorHandler) {
      return onErrorHandler(err, request!);
    }
    console.error("Error processing request:", err);
    return new Response(errorMessage || "Internal Server Error", {
      status: 500,
    });
  };

  const route = <
    RequestGeneric extends BaseRouteRequestType = BaseRouteRequestType,
    ResponseGeneric extends ResponseBodyTypes = ResponseBodyTypes
  >(
    routePath: string,
    options: RouteOptions = {}
  ) => {
    const { errorMessage, onError } = options;
    const defaultErrorMessage = "Internal Server Error";

    const onRequest = (
      handler: (args: {
        request: Request;
        getBody: <
          BodyType extends RequestGeneric["body"]
        >() => Promise<BodyType>;
        parseQueryParams: <ParamsType>() => ParamsType;
        parseHeaders: <HeadersType>() => HeadersType;
        // a function that allows you to pass in an object and it will stringify it if it's an object,
        // otherwise it will return whatever else is passed in

        JSONRes: <JSONBodyGeneric extends ResponseGeneric>(
          body: JSONBodyGeneric,
          options?: ResponseInit
        ) => Response;
      }) => Promise<Response>
    ) => {
      routes[routePath] = compose(middlewares, async (request: Request) => {
        try {
          const parseQueryParams = <
            ParamsType = RequestGeneric["params"]
          >() => {
            const url = new URL(request.url);
            return url.searchParams as ParamsType;
          };

          const parseHeaders = <HeadersType = RequestGeneric["headers"]>() => {
            return request.headers as HeadersType;
          };

          const getBody = async <BodyType = RequestGeneric["body"]>() => {
            return await getParsedBody<BodyType>(request);
          };

          const createJsonRes = (
            body: ResponseGeneric,
            options?: ResponseInit
          ): Response => {
            if (typeof body === "object") {
              return new Response(JSON.stringify(body), options);
            }
            return new Response(body, options);
          };

          return await handler({
            request,
            getBody,
            parseQueryParams,
            parseHeaders,
            JSONRes: createJsonRes,
          });
        } catch (error) {
          if (error instanceof Error) {
            return handleError(
              error,
              errorMessage || defaultErrorMessage,
              onError,
              request
            );
          } else {
            console.error("Caught a non-Error exception:", error);
            return new Response(errorMessage || defaultErrorMessage, {
              status: 500,
            });
          }
        }
      });
    };

    return {
      onRequest,
    };
  };

  const fetch = (
    request: Request
  ): undefined | Response | Promise<Response> => {
    const url = new URL(request.url);
    if (wsPaths?.includes(url.pathname)) {
      const success = server.upgrade(request);
      return success
        ? undefined
        : new Response("WebSocket upgrade error", { status: 400 });
    }

    const handler = routes[url.pathname];

    if (handler) {
      try {
        return handler(request);
      } catch (error) {
        console.error("Error processing request:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    } else {
      return new Response("404: Not Found", { status: 404 });
    }
  };

  const start = (
    { port, hostname = "0.0.0.0", websocket, verbose }: StartServerOptions = {
      hostname: "0.0.0.0",
      port: 3000,
      websocket: {
        message: () => {
          console.log("msg");
        },
      },
      verbose: false,
    }
  ) => {
    try {
      if (verbose) console.log(`Starting server on port ${port}...`);

      server = Bun.serve({
        fetch,
        port,
        hostname,
        websocket: websocket || {
          message: () => {
            console.log("msg");
          },
        },
      });

      if (verbose)
        console.log(
          `Server started on port ${port}, press Ctrl+C to stop, http://${hostname}:${port}`
        );

      return server;
    } catch (error) {
      if (verbose) console.error("Error starting server:", error);
      throw error;
    }
  };

  return {
    middle,
    route,
    start,
  };
}
