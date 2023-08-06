import { Server, WebSocketHandler } from "bun";

export type RouteHandler = (request: Request) => Response | Promise<Response>;

export interface RouteMap {
  [route: string]: RouteHandler;
}

export type StartServerOptions = {
  port?: number;
  hostname?: string;
  websocket?: WebSocketHandler;
};

export function createServerFactory(
  { wsPaths }: { wsPaths?: string[] } = { wsPaths: [] }
) {
  const routes: RouteMap = {};
  let server: Server;

  const addRoute = (route: string, handler: RouteHandler) => {
    console.log("creating route: ", route)
    routes[route] = handler;
  };

  const getRoutes = () => {
    return routes;
  };

  const deleteRoute = (route: string) => {
    delete routes[route];
  };

  const fetch = (
    request: Request
  ): undefined | Response | Promise<Response> => {
    const url = new URL(request.url);
    if (wsPaths?.includes(url.pathname)) {
      console.log(`upgrade!`);
      // const username = getUsernameFromReq(req);
      const success = server.upgrade(
        request // { data: { username } }
      );
      return success
        ? undefined
        : new Response("WebSocket upgrade error", { status: 400 });
    }

    const handler = routes[url.pathname];

    if (handler) {
      return handler(request);
    } else {
      return new Response("404: Not Found", { status: 404 });
    }
  };

  const start = (
    { port, hostname = "0.0.0.0", websocket }: StartServerOptions = {
      hostname: "0.0.0.0",
      port: 3000,
      websocket: {
        message: () => {
          console.log("msg");
        },
      },
    }
  ) => {
    server = Bun.serve({
      fetch,
      port,
      hostname,
      websocket,
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
