import { serverFactory } from ".";
import {
  InferMiddlewareDataMap,
  MiddlewareConfigMap,
  middlewareManagerFactory
} from "./middleware-manager";
import { RouteOptions, routeManager } from "./route-manager";

const timeMiddleware = (
  req: Request,
  options: {
    test1: string;
  }
) => {
  return {
    timestamp: new Date(),
  };
};

const corsHeaders = (request: Request) => {
  const responseHeaders = new Headers();

  return {
    requestHeaders: request.headers,
  };
};

const middleware = {
  time: timeMiddleware,
  cors: corsHeaders,
} satisfies MiddlewareConfigMap;

type MidwareT = InferMiddlewareDataMap<typeof middleware>;

const routes = {
  "/": {
    GET: (req, mid) => {
      console.log({ mid });
      return new Response(`Hello World! ${mid?.time?.timestamp}`);
    },
  },
} satisfies RouteOptions<MidwareT>;

const router = routeManager(routes);

// router.registerRoute("/random", "GET", (req, { cors: { requestHeaders } }) => {
//   return new Response(JSON.stringify(requestHeaders));
// });
const middlewareControl = middlewareManagerFactory({
  time: timeMiddleware,
  cors: corsHeaders,
});

// type FactoryType = InferMiddlewareFactory<typeof middlewareControl>

// Create Server Factory with Middleware Types
const {
  start,
  registerRoute, // you can register more routes after the server is created
} = await serverFactory({ middlewareControl, router });

// // Start Server
start(3000);

// very simple example mostly to show the type inference
// const middlewares = {
//   cors: () => ({ cors: true }),
//   auth: () => ({
//     user: "John Doe",
//   }),
// } satisfies MiddlewareConfigMap;

// const middlewareOps = middlewareManager(middlewares);

// const { executeMiddlewares } = await middlewareOps;

// const result = await executeMiddlewares(new Request("https://google.com"));

// result.auth.user
