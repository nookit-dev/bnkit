import { RouteHandler, StartServerOptions } from "server-factory/server-factory";
import { createServerFactory } from "../..";

const createWebsocketFactory = ({ paths }: { paths: string[] }) => {
  const server = createServerFactory({
    websocket
  });

  const addRoute = (route: string, handler: RouteHandler) => {
    server.addRoute(route, handler);
  }

  const start = (options: StartServerOptions) => {
    server.start(options);
  };

  return {
    start,
    server,
  }
};
