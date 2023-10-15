import Bun from "bun";
import { serverRequestHandler } from "./incoming-request-handler";
import {
  InferMiddlewareFactory,
  middlewareManagerFactory,
} from "./middleware-manager";
import { Routes, routeManager } from "./route-manager";

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

export const serverFactory = async <
  MidFactory extends ReturnType<typeof middlewareManagerFactory>,
  MidData = InferMiddlewareFactory<MidFactory>
>({
  middlewareControl,
  router,
  settings,
  fetchHandler,
}: {
  settings?: {};
  middlewareControl: MidFactory;
  router: ReturnType<typeof routeManager<MidData>>;
  fetchHandler?: (req: Request) => Promise<Response>; // Optional custom fetch handler
}) => {
  console.log({
    middlewareControl,
    router,
    settings,
    fetchHandler,
  });
  const { registerRoute, routes } = router;
  const { executeMiddlewares } = middlewareControl;

  const middlewares = await executeMiddlewares(new Request("http://localhost:8000"));

  console.log({ middlewares });

  const start = (port: number = 3000) => {
    // Use the custom fetch handler if provided, otherwise default to handleFetchRequest
    const fetch =
      fetchHandler ||
      ((req: Request) => serverRequestHandler(req, routes, executeMiddlewares));
    return startServer(port, routes, fetch, middlewareControl);
  };

  return {
    start,
    registerRoute,
  };
};
