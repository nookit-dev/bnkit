import type { InferMiddlewareDataMap, MiddlewareConfigMap } from '.'
import type { middlewareFactory } from './middleware-factory'
import type { RouteHandler, Routes } from './route-types'

function isValidRegex(str: string): boolean {
  if (str === '/') return false

  try {
    new RegExp(str)
    return true
  } catch (e) {
    return false
  }
}

export const serverRequestHandler = <
  MiddlewareFactory extends ReturnType<typeof middlewareFactory>,
  MiddlewareConfig extends MiddlewareConfigMap = Parameters<typeof middlewareFactory>[0],
  MiddlewareDataMap extends InferMiddlewareDataMap<MiddlewareConfig> = InferMiddlewareDataMap<MiddlewareConfig>,
>({
  req,
  routes,
  middlewareRet,
  optionsHandler,
}: {
  req: Request
  routes: Routes<MiddlewareConfig>
  middlewareRet?: MiddlewareFactory
  optionsHandler?: RouteHandler<MiddlewareDataMap>
}): Promise<Response> => {
  const url = new URL(req.url)
  const decodedPathname = decodeURIComponent(url.pathname)
  const executeMiddlewares = middlewareRet?.executeMiddlewares

  // Execute middleware first
  const middlewarePromise = executeMiddlewares ? executeMiddlewares(req) : Promise.resolve({} as MiddlewareDataMap)

  console.log({
    req,
    middlewarePromise,
  })

  return middlewarePromise
    .then(async (middlewareResponses) => {
      // Check if middleware has already handled the response
      if (middlewareResponses && typeof middlewareResponses === 'object') {
        for (const key in middlewareResponses) {
          if (middlewareResponses[key] instanceof Response) {
            return middlewareResponses[key] as Response
          }
        }
      }

      let matchedHandler: RouteHandler<MiddlewareDataMap> | null | undefined = null

      const pathRoutes = routes[decodedPathname]

      if (pathRoutes) {
        matchedHandler = pathRoutes[req.method.toLowerCase() as keyof typeof pathRoutes]
        if (!matchedHandler && req.method !== 'OPTIONS') {
          // Method not allowed for this path
          return new Response('Method Not Allowed', { status: 405 })
        }
      }

      // try regex match after direct string match
      if (!matchedHandler) {
        for (const pattern in routes) {
          if (isValidRegex(pattern)) {
            const regex = new RegExp(pattern, 'i')
            if (regex.test(decodedPathname)) {
              matchedHandler = routes[pattern][req.method.toLowerCase() as keyof (typeof routes)[typeof pattern]]
              break
            }
          }
        }
      }

      if (req.method === 'OPTIONS') {
        return optionsHandler
          ? optionsHandler(req, middlewareResponses as MiddlewareDataMap)
          : new Response(null, { status: 204 }) // Default OPTIONS response
      }

      if (!matchedHandler) {
        console.error('No match found for request', {
          url: req.url,
          method: req.method,
          pathRoutes,
          routes,
        })
        return new Response('Not Found', { status: 404 })
      }

      const response = await matchedHandler(req, middlewareResponses as MiddlewareDataMap)

      const corsHeaders = middlewareResponses.cors as Headers | undefined
      if (corsHeaders) {
        corsHeaders.forEach((value, key) => {
          response.headers.set(key, value)
        })
      }



      return response
    })
    .catch((err) => new Response(err.message, { status: 500 }))
}
