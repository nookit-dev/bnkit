import { HttpMethod } from "mod/utils/http-types";
import { middlewareFactory } from "./middleware-manager";

import type {
  InferMiddlewareDataMap,
  MiddlewareConfigMap,
} from "./middleware-types";

export type RouteHandler<M = {}> = (
  request: Request,
  middlewareData: M
) => Response | Promise<Response>;

export type Routes<
MiddlewareConfig extends MiddlewareConfigMap ={},
  InferredMiddlewareData = InferMiddlewareDataMap<MiddlewareConfig>
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
