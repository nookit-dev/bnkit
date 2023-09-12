import { Server } from "bun";
import {
  BaseRouteRequestType,
  CORSOptions,
  Middleware,
  ResponseBodyTypes,
  RouteHandler,
  RouteMap,
  RouteOptions,
} from "../utils/http-types";
import { getParsedBody } from "./body-parser-middleware";
import { generateMiddlewares } from "./generate-middleware";
import { processRequest } from "./request-handler";
import { htmlRes, jsonRes } from "./request-helpers";
import { StartServerOptions, startServer } from "./start-server";

type CreateServerFactory = {
  wsPaths?: string[];
  enableBodyParser?: boolean;
  cors?: CORSOptions;
  // max file size in bytes, if passed in then the check file middleware will be passed in
  // to validate file sizes
  maxFileSize?: number;
};
// TODO: figure out a way to set cors up for local dev automatically.
export function createServerFactory(
  { wsPaths, enableBodyParser, cors, maxFileSize }: CreateServerFactory = {
    wsPaths: [],
    enableBodyParser: true,
  }
) {
  const routes: RouteMap = {};
  let server: Server;

  // cors must come first in the middleware
  let middlewares: Middleware[] = generateMiddlewares({
    cors,
    enableBodyParser,
    maxFileSize,
  });

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

          const parseHeaders = <HeadersType = RequestGeneric["headers"]>() =>
            parseHeaders<HeadersType>();

          const getBody = async <BodyType = RequestGeneric["body"]>() => {
            return await getParsedBody<BodyType>(request);
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

  const start = (
    options: StartServerOptions = {
      hostname: "0.0.0.0",
      port: 3000,
      websocket: { message: () => console.info("websocket msg") },
      verbose: false,
    }
  ) => {
    return startServer(options, (request) =>
      processRequest({ request, routes, wsPaths: wsPaths || [], server })
    );
  };

  return {
    middle,
    route,
    start,
  };
}
