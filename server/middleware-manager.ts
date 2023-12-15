import { InferMiddlewareDataMap, MiddlewareConfigMap } from "./middleware-types";

export type InferMiddlewareFromFactory<Factory extends typeof middlewareFactory> = ReturnType<
  ReturnType<Factory>["inferTypes"]
>;

export const middlewareFactory = <T extends MiddlewareConfigMap>(middlewareOptions: T) => {
  const middlewares: MiddlewareConfigMap = {
    ...middlewareOptions,
  };

  const executeMiddlewares = async (req: Request) => {
    const results: InferMiddlewareDataMap<T> = {} as InferMiddlewareDataMap<T>;

    // An array to store promises which will resolve with [key, value] pairs
    const promises: Promise<[string, any]>[] = [];

    for (const [id, mw] of Object.entries(middlewares)) {
      const result = mw(req);

      if (result instanceof Promise) {
        // Push a promise which will resolve with [id, resolvedValue]
        promises.push(result.then((resolvedValue) => [id, resolvedValue]));
      } else {
        results[id as keyof T] = result;
      }
    }

    // Wait for all promises to resolve
    const resolvedPairs = await Promise.all(promises);

    // Map the resolved [key, value] pairs to the results object
    for (const [key, value] of resolvedPairs) {
      results[key as keyof T] = value;
    }

    return results;
  };

  const inferTypes = () => {
    return middlewares as InferMiddlewareDataMap<T>;
  };

  return { executeMiddlewares, inferTypes };
};
