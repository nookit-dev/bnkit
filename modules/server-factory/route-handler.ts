import { getParsedBody } from ".";
import {
  Middleware,
  OnRequestHandler,
  OnRequestType,
  ResBodyT,
  RouteMap,
  RouteOptions,
  RouteReqT,
} from "../utils/http-types";
import { handleRequestError, onErrorHandler } from "./error-handler";
import { composeMiddlewares } from "./middleware-handlers";
import { htmlRes, jsonRes, parseRequestHeaders } from "./request-helpers";

export type CreateRouteArgs = {
  routePath: string;
  middlewares: Middleware[];
  options: RouteOptions;
  routes: RouteMap;
};

const defaultErrorMessage = "Internal Server Error";

const requestHandler = async <
  ReqT extends RouteReqT = RouteReqT,
  ResT extends ResBodyT = ResBodyT
>({
  request,
  onRequest,
  errorMessage,
  onError,
}: {
  request: Request;
  onRequest: OnRequestHandler<ReqT, ResT>;
  errorMessage?: string;
  onError?: onErrorHandler;
}) => {
  try {
    const getQueryParams = <ParamsType = ReqT["params"]>() => {
      const url = new URL(request.url);
      return url.searchParams as unknown as ParamsType;
    };

    const parseHeaders = <HeadersType = ReqT["headers"]>() =>
      parseRequestHeaders<HeadersType>(request);

    const getBody = async <BodyType = ReqT["body"]>() => {
      return await getParsedBody<BodyType>(request);
    };

    return onRequest({
      request,
      getBody,
      parseQueryParams: getQueryParams,
      parseHeaders,
      jsonRes,
      htmlRes,
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
  ResT extends ResBodyT = ResBodyT
>({ middlewares, options = {}, routePath, routes }: CreateRouteArgs) {
  const { errorMessage, onError } = options;

  const onRequest: OnRequestType<ReqT, ResT> = (
    handler: OnRequestHandler<ReqT, ResT>
  ) => {
    routes[routePath] = composeMiddlewares(
      middlewares,
      async (request: Request) =>
        requestHandler({
          request,
          onRequest: handler,
          errorMessage,
          onError
        })
    );
  };

  return {
    onRequest,
  };
}
