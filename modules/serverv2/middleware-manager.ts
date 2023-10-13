// import { RouteHandler } from "./route-manager";

export type Middleware<T = any> = (request: Request) => T;

export type HandlerFnInferOpt<Fn> = {
  id: string;
  handler: Fn;
};
export type HandlerOptions<Fn> = readonly HandlerFnInferOpt<Fn>[];
export type MiddlewareRegOptions = HandlerOptions<Middleware>;

export type TypeMapFromHandlerArray<T extends HandlerOptions<any>> = {
  [K in T[number]["id"]]: ReturnType<Extract<T[number], { id: K }>["handler"]>;
};

export type InferMiddlewareDataMap<T extends HandlerOptions<Middleware>> =
  TypeMapFromHandlerArray<T>;

export const middlewareManager = <T extends MiddlewareRegOptions>(
  middlewareOptions: T
) => {
  const middlewares: Middleware[] = middlewareOptions.map((m) => m.handler);

  const executeMiddlewares = (req: Request) => {
    return Promise.all(middlewares.map((mw) => mw(req)));
  };

  return { executeMiddlewares };
};
