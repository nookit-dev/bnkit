import Bun from "bun";

type RouteHandler<M = {}> = (
  request: Request,
  middlewareData: M
) => Response | Promise<Response>;

type Middleware<T = any> = (request: Request) => T;

interface Routes<M = {}> {
  [path: string]: {
    [method: string]: RouteHandler<M>;
  };
}
type MiddlewareRegisterOptions = readonly {
  id: string;
  handler: Middleware;
}[];

type InferMiddlewareDataMap<T extends MiddlewareRegisterOptions> = {
  [K in T[number]["id"]]: ReturnType<Extract<T[number], { id: K }>["handler"]>;
};

export const middlewareManager = <T extends MiddlewareRegisterOptions>(
  middlewareOptions: T
) => {
  const middlewares: Middleware[] = middlewareOptions.map((m) => m.handler);

  const executeMiddlewares = (req: Request) => {
    return Promise.all(middlewares.map((mw) => mw(req)));
  };

  return { executeMiddlewares };
};

export const serverFactory = <M = {}>(
  settings?: {},
  executeMiddlewares?: (req: Request) => Promise<any[]>
) => {
  const routes: Routes<M> = {};

  const registerRoute = (
    method: string,
    path: string,
    handler: RouteHandler<M>
  ) => {
    if (!routes[path]) routes[path] = {};
    routes[path][method.toLowerCase()] = handler;
  };

  const start = (port: number = 3000) => {
    Bun.serve({
      port,
      fetch(req) {
        const url = new URL(req.url);
        const pathRoutes = routes[url.pathname];
        const methodHandler = pathRoutes
          ? pathRoutes[req.method.toLowerCase()]
          : null;

        if (!methodHandler) return new Response("Not Found", { status: 404 });

        const middlewareResponses = executeMiddlewares
          ? executeMiddlewares(req)
          : Promise.resolve({} as M);

        return middlewareResponses
          .then((resolvedMwResponses) =>
            methodHandler(req, ...resolvedMwResponses)
          )
          .catch((err) => new Response(err.message, { status: 500 }));
      },
    });
  };

  return { start, registerRoute };
};

// ***************************** EXAMPLE USAGE ***************************** //

const userMiddleware: Middleware<{ id: number; name: string }> = (request) => ({
  id: 1,
  name: "John Doe",
});
const timeMiddleware: Middleware<{ timestamp: number }> = (request) => ({
  timestamp: Date.now(),
});

// Middleware Register Options
const middlewareOptions = [
  { id: "user", handler: userMiddleware },
  { id: "time", handler: timeMiddleware },
] as const;

// Inferred Type Map
type MappedMiddlewares = InferMiddlewareDataMap<typeof middlewareOptions>;

// Create Middleware Manager and get middleware executor
const { executeMiddlewares } = middlewareManager(middlewareOptions);

// Create Server Factory with Middleware Types
const { start, registerRoute } = serverFactory<MappedMiddlewares>(
  {},
  executeMiddlewares
);

// Register Routes with Type-Safe Middleware Data
registerRoute("GET", "/", (req, { user, time }) => {
  console.log(user.name, time.timestamp);
  return new Response("Hello, world!");
});

// Start Server
start(3000);
