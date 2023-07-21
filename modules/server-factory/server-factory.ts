type RouteHandler = (request: Request) => Response | Promise<Response>;

interface RouteMap {
  [route: string]: RouteHandler;
}

export function createServerFactory() {
  const routes: RouteMap = {};

  const addRoute = (route: string, handler: RouteHandler) => {
    routes[route] = handler;
  };

  const getRoutes = () => {
    return routes;
  };

  const deleteRoute = (route: string) => {
    delete routes[route];
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

  const htmlResponse = (htmlString: string, config: ResponseInit) => {
    return new Response(htmlString, {
      ...config,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  };

  return {
    addRoute,
    start,
    getRoutes,
    deleteRoute,
    htmlResponse,
  };
}
