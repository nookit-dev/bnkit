export type Middleware<Opts extends object = {}, Res extends any = {}> = (
  request: Request,
  opts?: Opts
) => Res | Promise<Res>;

export type MiddlewareOption<Data extends object> = {
  handler: Middleware<Data>;
  data?: Data;
};

export type MiddlewareOptionsMap<M extends object = {}> = {
  [id: string]: MiddlewareOption<M>;
};

export type InferMiddlewareDataMap<T extends MiddlewareOptionsMap> = {
  [K in keyof T]: ReturnType<T[K]["handler"]>;
};

export const middlewareManager = <T extends MiddlewareOptionsMap>(
  middlewareOptions: T
) => {
  const middlewares: { [K in keyof T]: Middleware } = {} as any;

  Object.entries(middlewareOptions).forEach(([id, { handler, data }]) => {
    middlewares[id as keyof T] = (req: Request) => handler(req, data);
  });

  const executeMiddlewares = (req: Request): Promise<InferMiddlewareDataMap<T>> => {
    const results: Partial<InferMiddlewareDataMap<T>> = {};
    const promises: Promise<void>[] = [];

    Object.entries(middlewares).forEach(([id, mw]) => {
      const result = mw(req);
      if (result instanceof Promise) {
        promises.push(result.then((res) => (results[id as keyof T] = res)));
      } else {
        results[id as keyof T] = result;
      }
    });

    return Promise.all(promises).then(() => results as InferMiddlewareDataMap<T>);
  };

  return { executeMiddlewares };
};

// const middlewareOps = middlewareManager({
//   'cors': {
//     handler: (req) => ({ cors: true })
//   },
//   auth: {
//     handler (req) {
//       return { user: "John Doe" }
//     }
//   }
// })

// const { executeMiddlewares } = middlewareOps;

// const result = await middlewareOps.executeMiddlewares(new Request("https://google.com"));



// Example Usage
// const middlewareOptions = {
//   auth: {
//     handler: (req) => ({ user: "John Doe" }),
//   },
//   logger: {
//     handler: (req) => new Response()
//   },
// } satisfies MiddlewareOptionsMap

// const { executeMiddlewares } = middlewareManager(middlewareOptions);

// const midwares = await executeMiddlewares();
