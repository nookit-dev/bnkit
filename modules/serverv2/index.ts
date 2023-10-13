import Bun from "bun";
import {
  InferMiddlewareDataMap,
  Middleware,
  middlewareManager,
} from "./middleware-manager";
import { RouteOptions, Routes, routeManager } from "./route-manager";
import { serverRequestHandler } from "./incoming-request-handler";

export const startServer = <M = {}>(
  port: number,
  routes: Routes<M>,
  fetchHandler: typeof serverRequestHandler,
  executeMiddlewares?: (req: Request) => Promise<any[]>
) => {
  return Bun.serve({
    port,
    fetch: (req) => fetchHandler(req, routes, executeMiddlewares),
  });
};

export const serverFactory = <M = {}>({
  middlewareControl,
  router,
  settings,
  fetchHandler,
}: {
  settings?: {};
  middlewareControl: ReturnType<typeof middlewareManager>;
  router: ReturnType<typeof routeManager<M>>;
  fetchHandler?: (req: Request) => Promise<Response>; // Optional custom fetch handler
}) => {
  const { registerRoute, routes } = router;
  const { executeMiddlewares } = middlewareControl;

  const start = (port: number = 3000) => {
    // Use the custom fetch handler if provided, otherwise default to handleFetchRequest
    const fetch =
      fetchHandler ||
      ((req: Request) => serverRequestHandler(req, routes, executeMiddlewares));
    return startServer(port, routes, fetch, executeMiddlewares);
  };

  return {
    start,
    registerRoute,
  };
};
// ***************************** EXAMPLE USAGE ***************************** //

