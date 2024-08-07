import type { InferMiddlewareDataMap, MiddlewareConfigMap, NextFunction } from './middleware-types'

export type InferMiddlewareFromFactory<Factory extends typeof middlewareFactory> = ReturnType<
  ReturnType<Factory>['inferTypes']
>

export const middlewareFactory = <T extends MiddlewareConfigMap>(middlewareOptions: T) => {
  const middlewares: MiddlewareConfigMap = {
    ...middlewareOptions,
  }

  const executeMiddlewares = async (req: Request) => {
    const results: InferMiddlewareDataMap<T> = {} as InferMiddlewareDataMap<T>

    const executeMiddleware = async (index: number): Promise<void> => {
      if (index >= Object.keys(middlewares).length) {
        return
      }

      const [id, mw] = Object.entries(middlewares)[index]
      const next: NextFunction = async (error?: Error) => {
        if (error) {
          throw error
        }
        await executeMiddleware(index + 1)
      }

      const result = await mw(req, next)
      if (result !== undefined) {
        results[id as keyof T] = result
      }
    }

    await executeMiddleware(0)

    return results
  }

  const inferTypes = () => {
    return middlewares as InferMiddlewareDataMap<T>
  }

  return { executeMiddlewares, inferTypes }
}