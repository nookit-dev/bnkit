import { HttpMethod } from "mod/utils/http-types";

export interface Routes<M = {}> {
  [path: string]: {
    [method: string]: RouteHandler<M>;
  };
}

export type RouteHandler<M = {}> = (
  request: Request,
  middlewareData: M
) => Response | Promise<Response>;

export type RouteOption<
  Path extends string,
  Method extends HttpMethod,
  MCtx = {}
> = {
  method: Method;
  path: Path;
  handler: RouteHandler<MCtx>;
};

export type RouteOptions<M = {}> = {
  [path: string]: Partial<{
    [K in HttpMethod]: RouteHandler<M>;
  }>;
};

export const routeManager = <M>(routeOptions: RouteOptions<M>) => {
  const routes: Routes<M> = {};

  const registerRoute = (
    path: string,
    method: HttpMethod,
    handler: RouteHandler<M>
  ) => {
    if (!routes[path]) routes[path] = {};
    routes[path][method.toLowerCase()] = handler;
  };

  Object.entries(routeOptions).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, handler]) => {
      registerRoute(path, method as HttpMethod, handler);
    });
  });

  return {
    registerRoute,
    routes,
  };
};
