import { serverFactory } from ".";
import {
  InferMiddlewareDataMap,
  Middleware,
  middlewareManager,
} from "./middleware-manager";
import { RouteOptions, routeManager } from "./route-manager";

const userMiddleware: Middleware<{ id: number; name: string }> = () => ({
  id: 1,
  name: "John Doe",
});

const timeMiddleware: Middleware<{ timestamp: number }> = () => ({
  timestamp: Date.now(),
});

// Middleware Register Options
const middlewareOptions = [
  { id: "user", handler: userMiddleware },
  { id: "time", handler: timeMiddleware },
] as const;

const routeDefinitions: RouteOptions<MappedMiddlewares>[] = [
  {
    method: "GET",
    path: "/",
    // middleware definitions are inferred from the middlewareOptions
    handler: (req, { user, time }) => {
      console.log(user.name, time.timestamp);
      return new Response("Hello, world!");
    },
  },
];

const router = routeManager(routeDefinitions);
const middlewareControl = middlewareManager(middlewareOptions);

// Inferred Type Map
type MappedMiddlewares = InferMiddlewareDataMap<typeof middlewareOptions>;
// Create Server Factory with Middleware Types
const {
  start,
  registerRoute, // you can register more routes after the server is created
} = serverFactory<MappedMiddlewares>({ middlewareControl, router });

// // Start Server
start(3000);
