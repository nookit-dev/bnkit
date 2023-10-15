import Bun from "bun";
import { serverRequestHandler } from "./incoming-request-handler";
import {
  InferMiddlewareFactory,
  middlewareManagerFactory,
} from "./middleware-manager";
import { RouteHandler, Routes, routeManager } from "./route-manager";

export const startServer = <
  MidTypes = ReturnType<
    // middleware manager returns a promise to execute all middlewares
    // and returns an object with the middleware data
    ReturnType<typeof middlewareManagerFactory>["inferTypes"]
  >
>(
  port: number,
  routes: Routes<MidTypes>,
  fetchHandler: typeof serverRequestHandler,
  middlewareControl: ReturnType<typeof middlewareManagerFactory>
) => {
  return Bun.serve({
    port,
    fetch: (req) =>
      fetchHandler<MidTypes>(req, routes, middlewareControl.executeMiddlewares),
  });
};

export const serverFactory = <
  MidFactoryRet extends ReturnType<typeof middlewareManagerFactory>,
  MidData = InferMiddlewareFactory<MidFactoryRet>
>({
  middlewareControl,
  router,
  settings,
  fetchHandler,
  optionsHandler,
}: {
  settings?: {};
  middlewareControl: MidFactoryRet;
  router: ReturnType<typeof routeManager<MidData>>;
  fetchHandler?: (req: Request) => Promise<Response>; // Optional custom fetch handler
  optionsHandler?: RouteHandler<MidData>;
}) => {
  const { registerRoute, routes } = router;
  const { executeMiddlewares } = middlewareControl;

  const start = (port: number = 3000) => {
    // Use the custom fetch handler if provided, otherwise default to handleFetchRequest
    const fetch =
      fetchHandler ||
      ((req: Request) =>
        serverRequestHandler(req, routes, executeMiddlewares, optionsHandler));
    return startServer(port, routes, fetch, middlewareControl);
  };

  return {
    start,
    registerRoute,
  };
};
