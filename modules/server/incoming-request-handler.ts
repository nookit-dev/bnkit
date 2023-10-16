import { InferMiddlewareDataMap, MiddlewareConfigMap } from ".";
import { middlewareFactory } from "./middleware-manager";
import { RouteHandler, Routes } from "./routes";

export const serverRequestHandler = <
  MiddlewareFactory extends ReturnType<typeof middlewareFactory>,
  MiddlewareConfig extends MiddlewareConfigMap = Parameters<
    typeof middlewareFactory
  >[0],
  MiddlewareDataMap extends InferMiddlewareDataMap<MiddlewareConfig> = InferMiddlewareDataMap<MiddlewareConfig>
>({
  req,
  routes,
  middlewareRet,
  optionsHandler,
}: {
  req: Request;
  routes: Routes<MiddlewareConfig>;
  middlewareRet?: MiddlewareFactory;
  optionsHandler?: RouteHandler<MiddlewareDataMap>;
}): Promise<Response> => {
  const url = new URL(req.url);
  console.log({
    req,
    method: req.method,
    url: req.url,
    routes,
    path: url.pathname,
  });
  const pathRoutes = routes[url.pathname];
  const methodHandler = pathRoutes
    ? pathRoutes[req.method.toUpperCase() as keyof typeof pathRoutes]
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
        ? methodHandler(
            req,
            resolvedMwResponses as InferMiddlewareDataMap<MiddlewareConfig>
          )
        : new Response("Method Not Allowed", { status: 405 });
    })
    .catch((err) => new Response(err.message, { status: 500 }));
};
