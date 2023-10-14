import { serverFactory } from ".";
import {
  InferMiddlewareDataMap,
  Middleware,
  middlewareManager,
} from "./middleware-manager";
import { RouteOptions, routeManager } from "./route-manager";

const timeMiddleware: Middleware<{ timestamp: Date }> = () => {
  return {
    timestamp: new Date(),
  };
};

const corsHeaders: Middleware<{ cors: boolean }> = (request) => {
  const responseHeaders = new Headers();

  return {
    requestHeaders: request.headers,
  };
};

const routeDefinitions: RouteOptions<MidwareT> = {
  "/": {
    GET: (req, { time }) => {
      console.log(req, time.timestamp);
      return new Response("Hello, world!");
    },
  },
};

// Middleware Register Options
const middlewareOptions = [{ id: "time", handler: timeMiddleware }] as const;

const router = routeManager(routeDefinitions);
const middlewareControl = middlewareManager(middlewareOptions);

// Inferred Type Map(this should be done in middleware-manager.ts)
type MidwareT = InferMiddlewareDataMap<typeof middlewareOptions>;

// Create Server Factory with Middleware Types
const {
  start,
  registerRoute, // you can register more routes after the server is created
} = serverFactory<MidwareT>({ middlewareControl, router });

// // Start Server
start(3000);
