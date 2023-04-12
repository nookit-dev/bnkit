export { };
// import { Server, serve } from "bun";
// import { createHash } from "crypto";

// import { handleError } from "./error-handler";

// type WebSocketServer = {
//   start: () => Server;
//   stop: () => void;
// };

// type WebSocketRouteHandler = (message: any) => Promise<any>;

// type WebSocketRoute = {
//   [key: string]: WebSocketRouteHandler;
// };

// type WebSocketRouter = {
//   routes: WebSocketRoute;
//   defaultRoute: WebSocketRouteHandler;
// };

// type WebSocketClient = {
//   key: string;
//   socket: WebSocket;
// };

// type WebSocketClients = WebSocketClient[];

// export function createWebSocketServer(
//   httpServer: Server,
//   router: WebSocketRouter
// ): WebSocketServer {
//   const clients: WebSocketClients = [];

//   const webSocketServer = httpServer.httpWebSocketServer({
//     async acceptWebSocket(request: Request) {
//       const socket = await request.accept();

//       const key = createHash("sha256")
//         .update(Math.random().toString())
//         .digest("hex");

//       clients.push({ key, socket });

//       socket.addEventListener("message", async (event) => {
//         const message = JSON.parse(event.data.toString());

//         const routeHandler = router.routes[message.route];
//         const response = routeHandler
//           ? await routeHandler(message.payload)
//           : await router.defaultRoute(message.payload);

//         socket.send(JSON.stringify(response));
//       });

//       socket.addEventListener("close", () => {
//         const index = clients.findIndex((client) => client.key === key);
//         if (index !== -1) clients.splice(index, 1);
//       });
//     },
//   });

//   return {
//     start: () => webSocketServer,
//     stop: () => webSocketServer.stop(),
//   };
// }
