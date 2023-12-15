import { RouteMethods } from "../utils/http-types";
import { middlewareFactory } from "./middleware-manager";

import { HTMLodyPlugin, htmlodyBuilder } from "../htmlody";
import type { InferMiddlewareDataMap, MiddlewareConfigMap } from "./middleware-types";

export type RouteHandler<MidConfigMap extends MiddlewareConfigMap> = (
  request: Request,
  middlewareData: Partial<InferMiddlewareDataMap<MidConfigMap>>,
) => Response | Promise<Response>;

type RouteTypeOptsT = {
  middleware?: MiddlewareConfigMap;
  htmlody?: {
    plugins?: HTMLodyPlugin[];
    builder: typeof htmlodyBuilder;
  };

  htmlodyBuilder?: typeof htmlodyBuilder;
};

export type Routes<RouteType extends RouteTypeOptsT = RouteTypeOptsT> = {
  [path: string]: Partial<{
    [K in RouteMethods]: RouteType["middleware"] extends MiddlewareConfigMap
      ? RouteHandler<RouteType["middleware"]>
      : undefined;
  }>;
};

export type RouteOptionsMiddlewareManger<MiddlewareFactoryResult extends ReturnType<typeof middlewareFactory>> = {
  [path: string]: Partial<{
    [K in RouteMethods]: RouteHandler<MiddlewareFactoryResult>;
  }>;
};
