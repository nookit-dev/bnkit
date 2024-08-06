import type { WebSocketHandler } from 'bun'
import { serverRequestHandler } from './incoming-request-handler'
import type { middlewareFactory } from './middleware-manager'
import type { InferMiddlewareDataMap, MiddlewareConfigMap } from './middleware-types'
import type { RouteHandler, Routes } from './route-types'

export const serverFactory = <
  MiddlewareFactory extends ReturnType<typeof middlewareFactory>,
  MiddlewareConfig extends MiddlewareConfigMap = Parameters<typeof middlewareFactory>[0],
  MiddlewareDataMap extends InferMiddlewareDataMap<MiddlewareConfig> = InferMiddlewareDataMap<MiddlewareConfig>,
>({
  middleware,
  routes,
  fetchHandler = serverRequestHandler,
  optionsHandler,
  serve = Bun.serve,
  websocket,
}: {
  middleware?: MiddlewareFactory
  routes: Routes<MiddlewareConfig>
  fetchHandler?: typeof serverRequestHandler<MiddlewareFactory, MiddlewareConfig, MiddlewareDataMap>
  optionsHandler?: RouteHandler<MiddlewareDataMap>
  serve?: typeof Bun.serve
  websocket?: WebSocketHandler
}) => {
  const start = (port = 3000) => {
    if (Bun?.env.NODE_ENV === 'development') {
      console.log('Starting server on port: ', port)
    }
    return serve({
      port,
      fetch: (req) =>
        fetchHandler({
          req,
          routes,
          middlewareRet: middleware,
          optionsHandler,
        }),
      websocket,
    })
  }

  return {
    start,
  }
}
