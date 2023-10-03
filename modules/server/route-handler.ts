import { getParsedBody } from ".";
import {
  Middleware,
  OnRequestT,
  ReqHandler,
  ResBodyT,
  RouteMap,
  RouteOptions,
  RouteReqT,
} from "../utils/http-types";
import { handleRequestError, onErrorHandler } from "./error-handler";
import { composeMiddlewares } from "./middleware-handlers";
import { htmlRes, jsonRes, parseRequestHeaders } from "./request-helpers";

export type CreateRouteArgs<MiddlewareCtx extends object = {}> = {
  routePath: string;
  middlewares: Middleware<MiddlewareCtx>[];
  options: RouteOptions;
  routes: RouteMap;
};

const defaultErrorMessage = "Internal Server Error";

export const requestHandler = async <
  ReqT extends RouteReqT = RouteReqT,
  ResT extends ResBodyT = ResBodyT
>({
  request,
  onRequest,
  errorMessage,
  onError,
}: {
  request: Request;
  onRequest: ReqHandler<ReqT, ResT>;
  errorMessage?: string;
  onError?: onErrorHandler;
}) => {
  try {
    const getQueryParams = <ParamsT = ReqT["params"]>() => {
      const url = new URL(request.url);
      return url.searchParams as unknown as ParamsT;
    };

    const parseHeaders = <HeadersT = ReqT["headers"]>() =>
      parseRequestHeaders<HeadersT>(request);

    const getBody = async <BodyT = ReqT["body"]>() => {
      return await getParsedBody<BodyT>(request);
    };

    return onRequest({
      request,
      getBody,
      parseQueryParams: getQueryParams,
      parseHeaders,
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
  ReqT extends RouteReqT = RouteReqT,
  ResT extends ResBodyT = ResBodyT,
  MiddlewareCtx extends object = {}
>({
  middlewares,
  options = {},
  routePath,
  routes,
}: CreateRouteArgs<MiddlewareCtx>) {
  const { errorMessage, onError } = options;

  const onRequest: OnRequestT<ReqT, ResT> = (
    handler: ReqHandler<ReqT, ResT>
  ) => {
    routes[routePath] = composeMiddlewares<MiddlewareCtx>(
      middlewares,
      async (request: Request) =>
        requestHandler({
          request,
          onRequest: handler,
          errorMessage,
          onError,
        })
    );
  };

  return {
    onReq: onRequest,
  };
}
