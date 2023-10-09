import { Server } from "bun";
import {
  CORSOptions,
  Middleware,
  RouteMap,
  RouteOptions,
  RouteReqDataOpts,
} from "../utils/http-types";
import { generateMiddlewares } from "./middleware-handlers";
import { processRequest } from "./request-handler";
import { createRoute } from "./route-handler";
import { StartServerOptions, startServer } from "./start-server";

export type CreateServerFactoryRoute = {
  middlewares?: Middleware[];
  options?: RouteOptions;
  bypassMiddlewares?: boolean;
};

export type CreateServerParams = {
  wsPaths?: string[];
  enableBodyParser?: boolean;
  cors?: CORSOptions;
  // max file size in bytes, if passed in then the check file middleware will be passed in
  // to validate file sizes
  maxFileSize?: number;
};

export function createServerFactory(
  { wsPaths, enableBodyParser, cors, maxFileSize }: CreateServerParams = {
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

  const createServerRoute = <ReqT extends RouteReqDataOpts = RouteReqDataOpts>(
    routePath: string,
    {
      options = {},
      middlewares: routeMiddlewares = [],
      bypassMiddlewares: bypassServerMiddlewares = false,
    }: CreateServerFactoryRoute
  ) => {
    if (!bypassServerMiddlewares) {
      routeMiddlewares = [...middlewares, ...routeMiddlewares];
    }

    return createRoute<ReqT>({
      routePath: routePath,
      options,
      middlewares: routeMiddlewares,
      routes: routes,
    });
  };

  const middle = (middleware: Middleware) => {
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
