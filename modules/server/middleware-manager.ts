export type Middleware<Opts extends object, Res extends any> = (
  request: Request,
  opts?: Opts
) => Res;

export type MiddlewareConfigMap = {
  [id: string]: Middleware<any, any>;
};
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// export type IsFunction<T> = T extends (...args: any[]) => any ? true : false;

// export type InferFunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : T;

// infer if the middleware returns a promise or not
// export type InferMiddlewareDataMap<T extends MiddlewareConfigMap> = {
//   [K in keyof T]: IsFunction<ReturnType<T[K]>> extends true
//     ? InferFunctionReturnType<ReturnType<T[K]>>
//     : ReturnType<T[K]>;
// };

export type InferMiddlewareDataMap<T extends MiddlewareConfigMap> = {
  [K in keyof T]: ReturnType<T[K]>;
};

export type InferMiddlewareFactory<
  Factory extends ReturnType<typeof middlewareManagerFactory>
> = Factory["inferTypes"];

export const middlewareManagerFactory = <T extends MiddlewareConfigMap>(
  middlewareOptions: T
) => {
  const middlewares: MiddlewareConfigMap = {
    ...middlewareOptions,
  };

  const executeMiddlewares = async (req: Request) => {
    const results: InferMiddlewareDataMap<T> = {} as InferMiddlewareDataMap<T>;

    // An array to store promises which will resolve with [key, value] pairs
    const promises: Promise<[string, any]>[] = [];

    Object.entries(middlewares).forEach(([id, mw]) => {
      const result = mw(req);

      if (result instanceof Promise) {
        // Push a promise which will resolve with [id, resolvedValue]
        promises.push(result.then((resolvedValue) => [id, resolvedValue]));
      } else {
        results[id as keyof T] = result;
      }
    });

    // Wait for all promises to resolve
    const resolvedPairs = await Promise.all(promises);

    // Map the resolved [key, value] pairs to the results object
    resolvedPairs.forEach(([key, value]) => {
      results[key as keyof T] = value;
    });

    return results;
  };

  const inferTypes = () => {
    return middlewares as InferMiddlewareDataMap<T>;
  };

  return { executeMiddlewares, inferTypes };
};
