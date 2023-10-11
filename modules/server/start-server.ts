import { Server, WebSocketHandler } from "bun";

export interface StartServerOptions {
  port?: number;
  hostname?: string;
  websocket?: WebSocketHandler;
  verbose?: boolean;
}
export function startServer(
  options: StartServerOptions,
  fetchHandler: (request: Request) => Response
): Server {
  try {
    if (options.verbose) {
      console.info(`Starting server on port ${options.port}...`);
    }
    const server = Bun.serve({
      fetch: fetchHandler,
      websocket: {
        message: (options) => {
          if (options) {
            console.error("websocket msg");
          }
        },
      },
      ...options,
    });
    if (options.verbose) {
      console.info(`Server started on port ${options.port}...`);
    }
    return server;
  } catch (error) {
    if (options.verbose) {
      console.error("Error starting server:", error);
    }
    throw error;
  }
}
