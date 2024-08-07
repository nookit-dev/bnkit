import type { CORSOptions } from '../utils/http-types'
import type { Middleware, NextFunction } from './middleware-types'

const setAllowOrigin = (headers: Headers, originToSet: string) =>
  headers.set('Access-Control-Allow-Origin', originToSet || '')

const setAllowMethods = (headers: Headers, methods: string[]) =>
  headers.set('Access-Control-Allow-Methods', methods.map((method) => method).join(', '))

const addAllowHeader = (headers: Headers, options?: CORSOptions) => {
  if (options?.allowedHeaders?.join) {
    headers.set('Access-Control-Allow-Headers', options.allowedHeaders.map((header) => header).join(', '))
  }
}

const setAllowCredentials = (headers: Headers, options?: CORSOptions) =>
  options?.credentials && headers.set('Access-Control-Allow-Credentials', 'true')

export const configCorsMiddleware = (options?: CORSOptions): Middleware<Headers> => {
  const allowedMethods: string[] = options?.allowedMethods || []

  return (request: Request, next: NextFunction) => {
    const reqMethod = request.method.toUpperCase()
    const reqOrigin = request.headers.get('Origin')

    const allowedOrigins = options?.allowedOrigins || []
    const originAllowed = allowedOrigins.includes('*') || allowedOrigins.includes(reqOrigin || '')
    const methodAllowed = allowedMethods.includes(reqMethod)

    const corsHeaders = new Headers()
    const originToSet = allowedOrigins.includes('*') ? '*' : reqOrigin

    if (!reqOrigin) {
      throw new Error('Origin header missing')
    }

    // Set CORS headers
    setAllowOrigin(corsHeaders, originToSet || '')
    setAllowMethods(corsHeaders, allowedMethods)
    addAllowHeader(corsHeaders, options)
    setAllowCredentials(corsHeaders, options)

    if (reqMethod === 'OPTIONS') {
      const optionRequestMethod = request.headers.get('Access-Control-Request-Method')

      if (optionRequestMethod && !allowedMethods.includes(optionRequestMethod)) {
        throw new Error(`Method ${optionRequestMethod} is not allowed`)
      }

      // For OPTIONS requests, we'll return early with a 204 response
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (!originAllowed) {
      throw new Error(`Origin ${reqOrigin} not allowed`)
    }

    if (!methodAllowed) {
      throw new Error(`Method ${reqMethod} not allowed`)
    }

    // Continue to the next middleware or route handler, passing the CORS headers
    next()
    return corsHeaders
  }
}
