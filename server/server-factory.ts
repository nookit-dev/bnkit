import Bun from "bun";
import { serverRequestHandler } from "./incoming-request-handler";
import { middlewareFactory } from "./middleware-manager";
import { InferMiddlewareDataMap, MiddlewareConfigMap } from "./middleware-types";
import { RouteHandler, Routes } from "./routes";

export const serverFactory = <
  MiddlewareFactory extends ReturnType<typeof middlewareFactory>,
  MiddlewareConfig extends MiddlewareConfigMap = Parameters<typeof middlewareFactory>[0],
  MiddlewareDataMap extends InferMiddlewareDataMap<MiddlewareConfig> = InferMiddlewareDataMap<MiddlewareConfig>,
>({
  middleware,
  routes,
  fetchHandler = serverRequestHandler,
  optionsHandler,
  serve = Bun.serve,
}: {
  middleware?: MiddlewareFactory;
  routes: Routes<MiddlewareConfig>;
  fetchHandler?: typeof serverRequestHandler<MiddlewareFactory, MiddlewareConfig, MiddlewareDataMap>;
  optionsHandler?: RouteHandler<MiddlewareDataMap>;
  serve?: typeof Bun.serve;
}) => {
  const start = (port = 3000) => {
    try {
      if (Bun?.env.NODE_ENV === "development") {
        console.log("Starting server on port: ", port);
      }
      const server = serve({
        port,
        fetch: (req) => {
          console.log(req);
          return fetchHandler({
            req,
            routes,
            middlewareRet: middleware,
            optionsHandler,
          });
        },
      });


      return server;
    } catch (e) {
      // exit
      console.error(e);
      process.exit(1);
    }
  };

  return {
    start,
  };
};
