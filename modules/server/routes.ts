import { HttpMethod } from "mod/utils/http-types";
import { middlewareFactory } from "./middleware-manager";

import { HTMLodyPlugin, htmlodyBuilder } from "mod/htmlody";
import type {
  InferMiddlewareDataMap,
  MiddlewareConfigMap,
} from "./middleware-types";

export type RouteHandler<M = {}> = (
  request: Request,
  middlewareData: M
) => Response | Promise<Response>;

type RouteTypeOptsT = {
  middleware?: MiddlewareConfigMap;
  htmlody?: {
    plugins?: HTMLodyPlugin[];
    builder: typeof htmlodyBuilder;
  };

  htmlodyBuilder?: typeof htmlodyBuilder;
};

export type Routes<
  RouteType extends RouteTypeOptsT = RouteTypeOptsT,
  InferredMiddlewareData = RouteType["middleware"] extends MiddlewareConfigMap
    ? InferMiddlewareDataMap<RouteType["middleware"]>
    : never
> = {
  [path: string]: Partial<{
    [K in HttpMethod]: RouteHandler<InferredMiddlewareData>;
  }>;
};

export type RouteOptionsMiddlewareManger<
  MiddlewareFactory extends ReturnType<typeof middlewareFactory>,
  MiddlewareDataMap = InferMiddlewareDataMap<MiddlewareFactory>
> = {
  [path: string]: Partial<{
    [K in HttpMethod]: RouteHandler<MiddlewareDataMap>;
  }>;
};
