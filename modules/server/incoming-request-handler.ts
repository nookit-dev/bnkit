import { InferMiddlewareDataMap } from ".";
import { middlewareFactory } from "./middleware-manager";
import { RouteHandler, Routes } from "./route-manager";

export const serverRequestHandler = <
  MidControl extends ReturnType<typeof middlewareFactory>,
  MiddlewareDataMap = InferMiddlewareDataMap<MidControl>
>({
  req,
  routes,
  middlewareRet,
  optionsHandler,
}: {
  req: Request;
  routes: Routes<MiddlewareDataMap>;
  middlewareRet?: MidControl;
  optionsHandler?: RouteHandler<MiddlewareDataMap>;
}): Promise<Response> => {
  const url = new URL(req.url);
  const pathRoutes = routes[url.pathname];
  const methodHandler = pathRoutes
    ? pathRoutes[req.method.toLowerCase()]
    : null;

  if (!methodHandler && !optionsHandler)
    return Promise.resolve(new Response("Not Found", { status: 404 }));
  const executeMiddlewares = middlewareRet?.executeMiddlewares;

  // Ensure that middleware execution is properly handled when it's not provided
  const middlewareResponses = executeMiddlewares
    ? executeMiddlewares(req)
    : Promise.resolve({} as MiddlewareDataMap);

  return middlewareResponses
    .then((resolvedMwResponses) => {
      if (req.method === "OPTIONS" && !methodHandler && optionsHandler) {
        return optionsHandler(req, resolvedMwResponses as MiddlewareDataMap);
      }

      return methodHandler
        ? methodHandler(req, resolvedMwResponses as MiddlewareDataMap)
        : new Response("Method Not Allowed", { status: 405 });
    })
    .catch((err) => new Response(err.message, { status: 500 }));
};
