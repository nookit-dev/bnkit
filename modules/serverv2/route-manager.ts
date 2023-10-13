import { ArrayTypesExtract } from "mod/type-utils";
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

// export type OptionToRouteMapper<T extends RouteOption<any>> = {
//   [K in T["path"]]: {
//     [M in T["method"]]: {
//       path: K;
//       handler: Extract<T, { path: K }>["handler"];
//     };
//   };
// };

// const routeOptions = [
//   {
//     handler: (req: Request, data: { test: "test" }) => new Response("test"),
//     method: "GET",
//     path: "/test",
//   },
// ] as const;

type MidwareMock = {};

const baseRoute = {
  handler: (req, data) => new Response("Hello World"),
  method: "GET",
  path: "/",
} satisfies RouteOption<"/", "GET", MidwareMock>;

const testRoute = {
  handler: (req, data) => new Response("Hello World 2"),
  method: "POST",
  path: "/test",
} satisfies RouteOption<"/test", "POST", MidwareMock>;

const routeOptions = [baseRoute, testRoute] as const;

type MethodsUsed = ArrayTypesExtract<typeof routeOptions, "method">;
type PathsUsed = ArrayTypesExtract<typeof routeOptions, "path">;

type RouteOptionToRouteMapItem<
  MiddlewareCtx,
  Opt extends RouteOption<string, HttpMethod, MiddlewareCtx>
> = {
  [K in Opt["path"]]: {
    [M in Opt["method"]]: {
      path: K;
      handler: Extract<Opt, { path: K }>["handler"];
    };
  };
};

type CreateRouteMapFromOptions<
  MiddlewareCtx,
  Opts extends RouteOption<string, HttpMethod, MiddlewareCtx>[]
> = {
  [K in Opts[number]["path"]]: {
    [M in Opts[number]["method"]]: {
      path: K;
      handler: Extract<Opts[number], { path: K }>["handler"];
    };
  };
  // iterate through each option
  // [Opt in Opts[number]["path"]]: {
  //   // iterate through each method
  //   [M in Opts[number]["method"]]: {
  //     // create a type that has the path and handler
  //     path: Opt;
  //     handler: Extract<Opts[number], { path: K }>["handler"];
  //   };
  // };
};

type RouteMap = CreateRouteMapFromOptions<MidwareMock, typeof routeOptions>;

// type RouteOptionsToRouteMap<Opt extends RouteOption<PathsUsed, MethodsUsed>[]> =
//   {
//     [K in Opt[number]["path"]]: {
//       [M in Opt[number]["method"]]: Extract<
//         Opt[number],
//         { path: K }
//       >["handler"];
//     };
//   };

type RouteMapCreate = RouteOptionToRouteMapItem<MidwareMock, typeof route>;

// type RouteMap = RouteOptionsToRouteMap<typeof routeOptions>;

export const routeManager = <M>(routeOptions: RouteOption<M>[]) => {
  const registerOptions = (options: RouteOption<M>[]) => {
    const registeredRoutes: Routes<M> = {};
    options.forEach((option) => {
      registerRoute(option.method, option.path, option.handler);
    });
    return registeredRoutes;
  };

  const routes = registerOptions(routeOptions);

  // maybe seperate out the route matching as a router?
  const registerRoute = <Method extends HttpMethod>(
    method: Method,
    path: string,
    handler: RouteHandler<M>
  ) => {
    if (!routes[path]) routes[path] = {};
    routes[path][method.toLowerCase()] = handler;
  };

  const registerRoutes = (registerRoutes: Routes<M>) => {
    Object.entries(registerRoutes).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, handler]) => {
        registerRoute(method as HttpMethod, path, handler);
      });
    });

    return routes as Routes<M>;
  };

  return {
    // register, registerRoutes,
    registerRoute,
    routes,
  };
};

// const register = (registerFunc: typeof registerRoute) => {
//   routeOptions.forEach((route) => {
//     registerFunc(route.method, route.path, route.handler);
//   });
// };

// const registerRoutes = (registerRoutes: Routes<M>) => {
//   Object.entries(registerRoutes).forEach(([path, methods]) => {
//     Object.entries(methods).forEach(([method, handler]) => {
//       registerRoute(method as HttpMethod, path, handler);
//     });
//   });
// };
