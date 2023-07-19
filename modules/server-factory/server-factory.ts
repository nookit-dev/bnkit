import { Request, Response } from "bun";

// Define the type for a route handler
type RouteHandler = (req: Request) => Response | Promise<Response>;

// Define the type for a route
interface Route {
  path: string;
  handler: RouteHandler;
}

/**
 * Creates a new Bun server with the provided routes
 * @param routes - The routes that the server should handle
 * @return The created server
 */
export function createServer(routes: Route[]) {
  // Define the fetch function that will handle the requests
  const fetch = (req: Request) => {
    // Find the route that matches the path of the incoming request
    const route = routes.find(
      (route) => route.path === new URL(req.url).pathname
    );

    // If a route was found, invoke its handler, otherwise return a 404 response
    return route
      ? route.handler(req)
      : new Response("Not Found", { status: 404 });
  };

  // Start the server with the fetch function
  const server = Bun.serve({ fetch });

  return server;
}
