import { middlewareManagerFactory } from "./middleware-manager";
import { RouteHandler, Routes } from "./route-manager";

export const serverRequestHandler = <MidWare = {}>(
  req: Request,
  routes: Routes<MidWare>,
  executeMiddlewares?: ReturnType<
    typeof middlewareManagerFactory
  >["executeMiddlewares"],
  optionsHandler?: RouteHandler<MidWare>
): Promise<Response> => {
  const url = new URL(req.url);
  const pathRoutes = routes[url.pathname];
  const methodHandler = pathRoutes
    ? pathRoutes[req.method.toLowerCase()]
    : null;

  if (!methodHandler && !optionsHandler)
    return Promise.resolve(new Response("Not Found", { status: 404 }));

  const middlewareResponses = executeMiddlewares
    ? executeMiddlewares(req)
    : Promise.resolve({} as MidWare);

  // @ts-expect-error
  return middlewareResponses
    .then((resolvedMwResponses) => {
      if (req.method === "OPTIONS" && !methodHandler && optionsHandler) {
        // @ts-expect-error
        return optionsHandler(req, resolvedMwResponses);
      }

      // @ts-expect-error
      return methodHandler?.(req, resolvedMwResponses);
    })
    .catch((err) => new Response(err.message, { status: 500 }));
};
