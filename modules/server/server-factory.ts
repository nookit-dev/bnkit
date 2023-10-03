import { Server } from "bun";
import {
  Middleware,
  RouteMap,
  RouteOptions,
  ServerFactoryParams,
} from "../utils/http-types";
import { generateMiddlewares } from "./middleware-handlers";
import { processRequest } from "./request-handler";
import { createRoute } from "./route-handler";
import { StartServerOptions, startServer } from "./start-server";

export type CreateServerFactoryRoute<
  ServerRouteMap extends RouteMap,
  RouteKeys extends keyof ServerRouteMap = keyof ServerRouteMap,
  MiddlewareCtx extends object = {}
> = {
  middlewares?: Middleware<MiddlewareCtx>[];
  options?: RouteOptions;
  routes?: ServerRouteMap;
};

export function createServerFactory(
  { wsPaths, enableBodyParser, cors, maxFileSize }: ServerFactoryParams = {
    wsPaths: [],
    enableBodyParser: true,
  }
) {
  const routes: RouteMap = {};
  let server: Server;

  // cors must come first in the middleware
  let middlewares = generateMiddlewares({
    cors,
    enableBodyParser,
    maxFileSize,
  });

  type MiddlewareCtx = typeof middlewares extends Middleware<infer Ctx>[]
    ? Ctx
    : never;

  const createServerRoute = (
    routePath: keyof typeof routes,
    {
      options = {},
      middlewares: routeMiddlewares = middlewares,
      routes: routeMap = routes,
    }: CreateServerFactoryRoute<
      typeof routes,
      keyof typeof routes,
      MiddlewareCtx
    >
  ) => {
    return createRoute({
      routePath: String(routePath),
      options,
      middlewares: routeMiddlewares,
      routes: routeMap,
    });
  };

  const middle = (middleware: Middleware<MiddlewareCtx>) => {
    middlewares.push(middleware);
  };

  const start = (
    options: StartServerOptions = {
      hostname: "0.0.0.0",
      port: 3000,
      websocket: { message: () => console.info("websocket msg") },
      verbose: false,
    }
  ) => {
    server = startServer(options, (request) =>
      processRequest({ request, routes, wsPaths: wsPaths || [], server })
    );

    return server;
  };

  const getRoutes = () => routes;

  return {
    middle,
    route: createServerRoute,
    start,
    getRoutes,
  };
}
