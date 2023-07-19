type RouteHandler = (request: Request) => Response | Promise<Response>;

interface RouteMap {
  [route: string]: RouteHandler;
}

export function createServerFactory() {
  const routes: RouteMap = {};

  const addRoute = (route: string, handler: RouteHandler) => {
    routes[route] = handler;
  };

  const fetch = (request: Request): Response | Promise<Response> => {
    const url = new URL(request.url);
    const handler = routes[url.pathname];

    if (handler) {
      return handler(request);
    } else {
      return new Response("404: Not Found", { status: 404 });
    }
  };

  const start = (port: number, hostname: string = "0.0.0.0") => {
    Bun.serve({
      fetch,
      port,
      hostname,
    });
  };

  return {
    addRoute,
    start,
  };
}
