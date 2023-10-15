import Bun from "bun";
import { serverRequestHandler } from "./incoming-request-handler";
import {
  InferMiddlewareFromFactory,
  middlewareFactory,
} from "./middleware-manager";
import { RouteHandler, Routes, routeManager } from "./route-manager";
import { InferMiddlewareDataMap } from "./middleware-types";

export const startServer = <
  MidControl extends ReturnType<typeof middlewareFactory>,
  MiddlewareDataMap = InferMiddlewareDataMap<MidControl>
>(
  port: number,
  routes: Routes<MiddlewareDataMap>,
  fetchHandler: typeof serverRequestHandler,
  middlewareControl: MidControl
) => {
  return Bun.serve({
    port,
    fetch: (req) =>
      fetchHandler<MidControl, MiddlewareDataMap>({
        req,
        routes,
        middlewareRet: middlewareControl,
      }),
  });
};

export const serverFactory = <
  MidControl extends ReturnType<typeof middlewareFactory>,
  MiddlewareDataMap = InferMiddlewareDataMap<MidControl>
>({
  middlewareControl,
  router,
  settings,
  fetchHandler = serverRequestHandler,
  optionsHandler,
}: {
  settings?: {};
  middlewareControl?: MidControl;
  router: ReturnType<typeof routeManager<MiddlewareDataMap>>;
  fetchHandler?: typeof serverRequestHandler<MidControl, MiddlewareDataMap>;
  optionsHandler?: RouteHandler<MiddlewareDataMap>;
}) => {
  const { registerRoute, routes } = router;

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
    registerRoute,
  };
};
