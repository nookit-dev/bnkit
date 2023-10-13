import { Routes } from "./route-manager";

export const serverRequestHandler = <M = {}>(
  req: Request,
  routes: Routes<M>,
  executeMiddlewares?: (req: Request) => Promise<any[]>
): Promise<Response> => {
  const url = new URL(req.url);
  const pathRoutes = routes[url.pathname];
  const methodHandler = pathRoutes
    ? pathRoutes[req.method.toLowerCase()]
    : null;

  if (!methodHandler)
    return Promise.resolve(new Response("Not Found", { status: 404 }));

  const middlewareResponses = executeMiddlewares
    ? executeMiddlewares(req)
    : Promise.resolve({} as M);

  return middlewareResponses
    .then((resolvedMwResponses) => methodHandler(req, resolvedMwResponses))
    .catch((err) => new Response(err.message, { status: 500 }));
};
