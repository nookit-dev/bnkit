type RouteHandler = (req: Request) => Response;

type Route = {
  path: string;
  method: string;
  handler: RouteHandler;
};

type Router = {
  addRoute: (path: string, method: string, handler: RouteHandler) => void;
  handleRequest: (req: Request) => Response;
};

function createRouter(): Router {
  const routes: Route[] = [];

  function addRoute(path: string, method: string, handler: RouteHandler) {
    routes.push({ path, method, handler });
  }

  function handleRequest(req: Request) {
    const url = new URL(req.url);
    const method = req.method.toUpperCase();

    for (const { path, method: routeMethod, handler } of routes) {
      if (url.pathname === path && method === routeMethod) {
        return handler(req);
      }
    }

    return new Response("Not found", { status: 404 });
  }

  return {
    addRoute,
    handleRequest,
  };
}
