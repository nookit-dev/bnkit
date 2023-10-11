import { Server } from "bun";
import { RouteMap } from "../utils/http-types";
import { handleRequestError } from "./error-handler";

export function processRequest({
  request,
  routes,
  server,
  wsPaths,
}: {
  request: Request;
  routes: RouteMap;
  // websocket paths
  wsPaths: string[];
  server: Server;
}): Response {
  try {
    const url = new URL(request.url);

    if (wsPaths?.includes(url.pathname)) {
      const success = server?.upgrade(request);
      return success
        ? new Response("WebSocket upgrade successful", { status: 200 })
        : new Response("WebSocket upgrade error", { status: 400 });
    }

    const handler = routes[url.pathname];
    if (handler) {
      return handler(request);
    } else {
      return new Response("404: Not Found", { status: 404 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return handleRequestError(
        error,
        "Internal Server Error",
        undefined,
        request
      );
    }

    return handleRequestError(
      new Error("Unknown error"),
      "Internal Server Error",
      undefined,
      request
    );
  }
}
