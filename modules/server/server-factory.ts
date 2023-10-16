import Bun from "bun";
import { serverRequestHandler } from "./incoming-request-handler";
import { middlewareFactory } from "./middleware-manager";
import {
  InferMiddlewareDataMap,
  MiddlewareConfigMap,
} from "./middleware-types";
import { RouteHandler, Routes } from "./routes";

export const serverFactory = <
  MiddlewareFactory extends ReturnType<typeof middlewareFactory>,
  MiddlewareConfig extends MiddlewareConfigMap = Parameters<
    typeof middlewareFactory
  >[0],
  MiddlewareDataMap extends InferMiddlewareDataMap<MiddlewareConfig> = InferMiddlewareDataMap<MiddlewareConfig>
>({
  middlewareControl,
  routes,
  settings,
  fetchHandler = serverRequestHandler,
  optionsHandler,
}: {
  settings?: {};
  middlewareControl?: MiddlewareFactory;
  routes: Routes<MiddlewareConfig>;
  fetchHandler?: typeof serverRequestHandler<
    MiddlewareFactory,
    MiddlewareConfig,
    MiddlewareDataMap
  >;
  optionsHandler?: RouteHandler<MiddlewareDataMap>;
}) => {
  const start = (port: number = 3000) => {
    return Bun.serve({
      port,
      fetch: (req) =>
        fetchHandler({
          req,
          routes,
          middlewareRet: middlewareControl,
          optionsHandler,
        }),
    });
  };

  return {
    start,
  };
};
