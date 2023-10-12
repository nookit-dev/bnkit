import { getParsedBody } from ".";
import {
  Middleware,
  ReqHandler,
  RouteMap,
  RouteOptions,
  RouteReqDataOpts,
} from "../utils/http-types";
import { handleRequestError, onErrorHandler } from "./error-handler";
import { composeMiddlewares } from "./middleware-handlers";
import { parseRequestHeaders } from "./request-helpers";

export type CreateRouteArgs<MiddlewareCtx extends object = {}> = {
  routePath: string;
  middlewares: Middleware<MiddlewareCtx>[];
  options: RouteOptions;
  routes: RouteMap;
};

const defaultErrorMessage = "Internal Server Error";

export const composeRequest = <
  RouteReq extends RouteReqDataOpts = RouteReqDataOpts
>({
  request,
  onRequest,
  errorMessage,
  onError,
  response,
}: {
  request: Request;
  onRequest: ReqHandler<RouteReq>;
  errorMessage?: string;
  onError?: onErrorHandler;
  response: Response;
}) => {
  try {
    const parseQueryParams = <ParamsT = RouteReq["params"]>() => {
      const url = new URL(request.url);
      return url.searchParams as unknown as ParamsT;
    };

    const parseHeaders = <HeadersT = RouteReq["headers"]>() =>
      parseRequestHeaders<HeadersT>(request);

    const parseBodyJson = async <BodyT = RouteReq["body"]>() => {
      return await getParsedBody<BodyT>(request);
    };

    return onRequest({
      request,
      parseBodyJson,
      parseQueryParams,
      parseHeaders,
      response,
    });
  } catch (error) {
    if (error instanceof Error) {
      return handleRequestError(
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
};

export function createRoute<
  ReqT extends RouteReqDataOpts,
  MiddlewareCtx extends object = {}
>({
  middlewares,
  options = {},
  routePath,
  routes,
}: CreateRouteArgs<MiddlewareCtx>) {
  const { errorMessage, onError } = options;

  const onRequest = async (handler: ReqHandler<ReqT>) => {
    const response = new Response();
    routes[routePath] = composeMiddlewares<MiddlewareCtx>(
      middlewares,
      (request: Request) => {
        return composeRequest<RouteReqDataOpts>({
          request,
          onRequest: handler,
          errorMessage,
          onError,
          response,
        });
      },
      response
    );

    return response;
  };

  return onRequest;
}
