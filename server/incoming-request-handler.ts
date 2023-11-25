import { InferMiddlewareDataMap, MiddlewareConfigMap } from ".";
import { middlewareFactory } from "./middleware-manager";
import { RouteHandler, Routes } from "./routes";
function isValidRegex(str: string): boolean {
  if (str === "/") return false;
  try {
    new RegExp(str);
    return true;
  } catch (e) {
    return false;
  }
}

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
  let matchedHandler: RouteHandler<MiddlewareDataMap> | null | undefined = null;

  const pathRoutes = routes[url.pathname];

  matchedHandler = pathRoutes
    ? pathRoutes[req.method.toUpperCase() as keyof typeof pathRoutes]
    : null;

  // try regex match after direct string match
  if (!matchedHandler) {
    for (const pattern in routes) {
      if (isValidRegex(pattern)) {
        const regex = new RegExp(pattern, "i");
        if (regex.test(url.pathname)) {
          matchedHandler =
            routes[pattern][
              req.method.toUpperCase() as keyof (typeof routes)[typeof pattern]
            ];
          break;
        }
      }
    }
  }

  if (!matchedHandler && !optionsHandler)
    return Promise.resolve(new Response("Not Found", { status: 404 }));
  const executeMiddlewares = middlewareRet?.executeMiddlewares;

  // Ensure that middleware execution is properly handled when it's not provided
  const middlewareResponses = executeMiddlewares
    ? executeMiddlewares(req)
    : Promise.resolve({} as MiddlewareDataMap);

  return middlewareResponses
    .then((resolvedMwResponses) => {
      if (req.method === "options" && !matchedHandler && optionsHandler) {
        return optionsHandler(req, resolvedMwResponses as MiddlewareDataMap);
      }

      return matchedHandler
        ? matchedHandler(req, resolvedMwResponses as MiddlewareDataMap)
        : new Response("Method Not Allowed", { status: 405 });
    })
    .catch((err) => new Response(err.message, { status: 500 }));
};
