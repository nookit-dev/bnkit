import { serverFactory } from ".";
import {
  InferMiddlewareDataMap,
  middlewareManager
} from "./middleware-manager";
import { RouteOptions, routeManager } from "./route-manager";

const userMiddleware = () => ({
  id: 1,
  name: "John Doe",
});

const timeMiddleware = () => ({
  timestamp: Date.now(),
});

// Middleware Register Options
const middlewareOptions = [
  { id: "user", handler: userMiddleware },
  { id: "time", handler: timeMiddleware },
] as const;

const routeDefinitions: RouteOptions<MidwareT>[] = [
  {
    method: "GET",
    path: "/",
    // middleware definitions are inferred from the middlewareOptions
    handler: (req, { user, time }) => {
      console.log(req, user.name, time.timestamp);
      return new Response("Hello, world!");
    },
  },
];

const router = routeManager(routeDefinitions);
const middlewareControl = middlewareManager(middlewareOptions);

// Inferred Type Map
type MidwareT = InferMiddlewareDataMap<typeof middlewareOptions>;

// Create Server Factory with Middleware Types
const {
  start,
  registerRoute, // you can register more routes after the server is created
} = serverFactory<MidwareT>({ middlewareControl, router });

// // Start Server
start(3000);
