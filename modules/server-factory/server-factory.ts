import { Server } from "bun";
import {
  BaseRouteRequestType,
  CORSOptions,
  Middleware,
  ResponseBodyTypes,
  RouteHandler,
  RouteMap,
  RouteOptions,
  StartServerOptions,
} from "utils/http-types";
import { bodyParserMiddleware, getParsedBody } from "./body-parser-middleware";
import { checkFileSizeMiddleware } from "./check-file-size-middleware";
import { createCorsMiddleware } from "./create-cors-middleware";

// TODO: figure out a way to set cors up for local dev automatically.
export function createServerFactory(
  {
    wsPaths,
    enableBodyParser,
    cors,
    maxFileSize,
  }: {
    wsPaths?: string[];
    enableBodyParser?: boolean;
    cors?: CORSOptions;
    /*
    max file size in bytes, if passed in then the check file middleware will be passed in
    to validate file sizes
    */
    maxFileSize?: number;
  } = {
    wsPaths: [],
    enableBodyParser: true,
  }
) {
  const routes: RouteMap = {};
  let server: Server;
  let middlewares: Middleware[] = [];

  // cors must come first in the middleware
  if (cors) {
    middlewares.push(createCorsMiddleware(cors));
  }

  if (enableBodyParser) {
    middlewares.push(bodyParserMiddleware);
  }

  if (maxFileSize) {
    middlewares.push(checkFileSizeMiddleware(maxFileSize));
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

        jsonRes: <JSONBodyGeneric extends ResponseGeneric>(
          body: JSONBodyGeneric,
          options?: ResponseInit
        ) => Response;
        htmlRes: (body: string, options?: ResponseInit) => Response;
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

          const jsonRes = (
            body: ResponseGeneric,
            options?: ResponseInit
          ): Response => {
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
          const htmlRes = (body: string, options?: ResponseInit) => {
            return new Response(body, {
              headers: {
                "Content-Type": "text/html",
                ...options?.headers,
              },
              ...options,
            });
          };

          return await handler({
            request,
            getBody,
            parseQueryParams,
            parseHeaders,
            jsonRes,
            htmlRes,
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
          console.info("websocket msg");
        },
      },
      verbose: false,
    }
  ) => {
    try {
      if (verbose) console.info(`Starting server on port ${port}...`);

      server = Bun.serve({
        fetch,
        port,
        hostname,
        websocket: websocket || {
          message: () => {
            console.info("msg");
          },
        },
      });

      if (verbose)
        console.info(
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
