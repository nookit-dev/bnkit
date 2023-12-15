import { InferMiddlewareDataMap, MWNext, MiddlewareConfigMap } from "./middleware-types";

export type InferMiddlewareFromFactory<Factory extends typeof middlewareFactory> = ReturnType<
  ReturnType<Factory>["inferTypes"]
>;

export const middlewareFactory = <
  MidwareConfig extends MiddlewareConfigMap,
  MidwareData extends Partial<InferMiddlewareDataMap<MidwareConfig>> = Partial<InferMiddlewareDataMap<MidwareConfig>>,
>(
  middlewareOptions: MidwareConfig,
) => {
  const middlewares: MiddlewareConfigMap = {
    ...middlewareOptions,
  };

  const executeMiddlewares = async (req: Request, next: MWNext<MidwareData>): Promise<MidwareData> => {
    const results: InferMiddlewareDataMap<MidwareConfig> = {} as InferMiddlewareDataMap<MidwareConfig>;

    // An array to store promises which will resolve with [key, value] pairs
    const promises: Promise<[string, any]>[] = [];

    for (const [id, mw] of Object.entries(middlewares)) {
      const result = mw(req, next);

      if (result instanceof Promise) {
        // Push a promise which will resolve with [id, resolvedValue]
        promises.push(result.then((resolvedValue) => [id, resolvedValue]));
      } else {
        results[id as keyof MidwareConfig] = result;
      }
    }

    // Wait for all promises to resolve
    const resolvedPairs = await Promise.all(promises);

    // Map the resolved [key, value] pairs to the results object
    for (const [key, value] of resolvedPairs) {
      results[key as keyof MidwareConfig] = value;
    }

    // return results;
    return next(results);
  };

  const inferTypes = () => {
    return middlewares as InferMiddlewareDataMap<MidwareConfig>;
  };

  return { executeMiddlewares, inferTypes };
};
