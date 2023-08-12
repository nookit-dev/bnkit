import { Server, WebSocketHandler } from "bun";
import { bodyParser, getParsedBody } from "./body-parser-middleware";

export type RouteHandler = (request: Request) => Response | Promise<Response>;

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
  body: any;
  params: any;
  headers: any;
};

// figure out a way to set cors up for local dev automatically.

export function createServerFactory(
  {
    wsPaths,
    enableBodyParser,
  }: { wsPaths?: string[]; enableBodyParser: boolean } = {
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

  const use = (middleware: Middleware) => {
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
    RouteRequestType extends BaseRouteRequestType,
    ResponseType extends URLSearchParams
  >(
    routePath: string,
    options: RouteOptions = {}
  ): {
    onRequest: (handler: RouteHandler) => void;
    parseQueryParams: <ParamsType = RouteRequestType["params"]>(
      request: Request
    ) => ParamsType;
    parseHeaders: <HeadersType = RouteRequestType["headers"]>(
      request: Request
    ) => HeadersType;
    getBody: (request: Request) => RouteRequestType["body"];
    createRes: (res: ResponseType) => Response;
  } => {
    const { errorMessage, onError } = options;

    const defaultErrorMessage = "Internal Server Error";

    const onRequest = (handler: RouteHandler) => {
      routes[routePath] = compose(middlewares, async (request: Request) => {
        try {
          return handler(request);
        } catch (error) {
          if (error instanceof Error) {
            return handleError(error, defaultErrorMessage, onError, request);
          } else {
            // Handle or log non-Error exceptions here
            console.error("Caught a non-Error exception:", error);
            return new Response(defaultErrorMessage, { status: 500 });
          }
        }
      });
    };

    const parseQueryParams = <ParamsType = RouteRequestType["params"]>(
      request: Request
    ) => {
      const url = new URL(request.url);
      // parse params from url and return as casted type,
      // or return null if there are no params
      const params = url.searchParams;

      // extract params as object

      // TODO: Add validation function as a optional second param
      return params as ParamsType;
    };

    const parseHeaders = <HeadersType = RouteRequestType["headers"]>(
      request: Request
    ) => {
      //  TODO: Add validation function as a optional second param
      return request.headers as HeadersType;
    };

    // TODO: maybe the onRequest returns these functions? that way you wouldnt even need to pass in the request
    const getBody = (request: Request): RouteRequestType["body"] => {
      return getParsedBody<RouteRequestType["body"]>(request);
    };

    const createRes = (responseData: ResponseType) => {
      // if responseData is an object then we need to stringify it
      if (typeof responseData === "object") {
        return new Response(JSON.stringify(responseData));
      }

      // anything else needs to be just a string
      return new Response(responseData);
    };

    return { onRequest, parseQueryParams, getBody, parseHeaders, createRes };
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
    use,
    route,
    start,
  };
}
