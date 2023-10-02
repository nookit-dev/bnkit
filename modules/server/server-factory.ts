import { Server } from "bun";
import {
  CreateServerFactory,
  Middleware,
  RouteMap,
  RouteOptions,
} from "../utils/http-types";
import { generateMiddlewares } from "./middleware-handlers";
import { processRequest } from "./request-handler";
import { createRoute } from "./route-handler";
import { StartServerOptions, startServer } from "./start-server";

export type CreateServerFactoryRoute<
  ServerRouteMap extends RouteMap,
  RouteKeys extends keyof ServerRouteMap = keyof ServerRouteMap,
  MiddlewareDataCtx extends object = {}
> = {
  routePath: RouteKeys;
  middlewares?: Middleware<MiddlewareDataCtx>[];
  options?: RouteOptions;
  routes?: ServerRouteMap;
};

export function createServerFactory<MiddlewareDataCtx extends object = {}>(
  { wsPaths, enableBodyParser, cors, maxFileSize }: CreateServerFactory = {
    wsPaths: [],
    enableBodyParser: true,
  }
) {
  const routes: RouteMap = {};
  let server: Server;

  // cors must come first in the middleware
  let middlewares: Middleware<MiddlewareDataCtx>[] = generateMiddlewares({
    cors,
    enableBodyParser,
    maxFileSize,
  });

  const createServerRoute = ({
    routePath,
    options = {},
    middlewares: routeMiddlewares = middlewares,
    routes: routeMap = routes,
  }: // }: CreateServerFactoryRoute<typeof routes, keyof typeof routes, CookieContext >) => {
  CreateServerFactoryRoute<
    typeof routes,
    keyof typeof routes,
    MiddlewareDataCtx
  >) => {
    return createRoute({
      routePath: String(routePath),
      options,
      middlewares: routeMiddlewares,
      routes: routeMap,
    });
  };

  const middle = (middleware: Middleware<MiddlewareDataCtx>) => {
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

  return {
    middle,
    route: createServerRoute,
    start,
  };
}
