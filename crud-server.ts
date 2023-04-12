// crud-server.ts

import { Server, serve } from "bun";
import { handleError } from "./error-handler";
import { SchemaType, TypeInference, TypeMapping } from "./types";

export type CrudServer<Schema extends SchemaType> = {
  start: () => Server;
  stop: () => void;
};

export type Router = {
  [path: string]: (req: Request) => Promise<Response>;
};


// TODO: Add encryption keys 
export function createCrudServer<
  Schema extends Record<string, keyof TypeMapping>
>(schema: Schema, router?: Router): CrudServer<Schema> {
  const server = serve({
    async fetch(req: Request): Promise<Response> {
      const url = new URL(req.url);

      // Check for frontend identifier
      const identifier = req.headers.get("x-identifier");
      if (!identifier) {
        return new Response("Not authorized", { status: 401 });
      }

      try {
        if (url.pathname.startsWith("/api")) {
          // API routes
          const path = url.pathname.slice(4); // Remove "/api" prefix
          switch (req.method) {
            case "POST":
              if (path === "/create") {
                const item = (await req.json()) as TypeInference<Schema>;
                return new Response("Created", { status: 201 });
              }
              break;

            case "GET":
              if (path === "/read") {
                const items = [];
                return new Response(JSON.stringify(items));
              }
              break;

            case "PUT":
              if (path === "/update") {
                const id = Number(url.searchParams.get("id"));
                const item = {};
                return new Response("Updated", { status: 200 });
              }
              break;

            case "DELETE":
              if (path === "/delete") {
                const id = Number(url.searchParams.get("id"));

                return new Response("Deleted", { status: 200 });
              }
              break;

            default:
              return new Response("Not found", { status: 404 });
          }
        } else {
          // Router for frontend pages
          const handler = router[url.pathname];
          if (handler) {
            const response = await handler(req);
            return response;
          }
        }
      } catch (error) {
        const handledError = handleError(error);
        if (handledError) {
          return new Response(handledError.message, { status: 400 });
        }
      }

      return new Response("Not found", { status: 404 });
    },
  });

  return {
    start: () => server,
    stop: () => server.stop(),
  };
}
