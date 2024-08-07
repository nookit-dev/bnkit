import { describe, expect, test } from 'bun:test'
import type { CORSOptions, HTTPMethod } from 'utils/http-types'
import { configCorsMiddleware } from './create-cors-middleware'

const tstOrigin = 'http://example.com'
const tstMethods: HTTPMethod[] = ['GET', 'POST', 'PUT', 'DELETE']
const tstHeaders = ['Content-Type']

const defaultOptions: CORSOptions = {
  allowedOrigins: [tstOrigin],
  allowedMethods: tstMethods,
  allowedHeaders: tstHeaders,
}

const tstReq = (
  origin: string = tstOrigin,
  options?: {
    headers?: Record<string, string>
    Origin?: string
    noOrigin?: boolean
  }
) => {
  const req = (rMethod: HTTPMethod = 'GET') => {
    const headers = new Headers({
      ...options?.headers,
    })

    if (options?.noOrigin) {
      headers.delete('Origin')

      return new Request(origin, {
        method: rMethod,
        headers,
      })
    }

    return new Request(origin, {
      method: rMethod,
      headers: new Headers({
        ...options?.headers,
        Origin: options?.Origin ? options.Origin : origin,
      }),
    })
  }
  return {
    get: req('GET'),
    post: req('POST'),
    put: req('PUT'),
    delete: req('DELETE'),
    options: req('OPTIONS'),
  }
}

describe('createCorsMiddleware function', () => {
  test('default values', async () => {
    const requester = tstReq(tstOrigin).get
    const headers = requester.headers

    headers.set('Access-Control-Request-Method', 'POST')
    const mwConfig = await configCorsMiddleware({
      allowedOrigins: [tstOrigin],
      allowedMethods: tstMethods,
      allowedHeaders: ['Content-Type'],
    })

    const response = await mwConfig(requester, async () => {})

    expect(response.headers.get('access-control-allow-methods')).toBe('get, post, put, delete')
    expect(response.headers.get('access-control-allow-headers')).toBe('content-type')
  })

  test('missing Origin header', async () => {
    const requester = tstReq(tstOrigin, {
      noOrigin: true,
    }).get
    const middlewareHandler = configCorsMiddleware({
      ...defaultOptions,
    })

    const response = await middlewareHandler(requester, async () => {})

    expect(response.status).toBe(400)
  })

  test('options request', async () => {
    const requester = tstReq(tstOrigin, {
      headers: {
        'Access-Control-Request-Method': 'POST',
      },
    }).options

    const response = await configCorsMiddleware(defaultOptions)(requester, async () => {})

    expect(response.status).toBe(204)
    expect(response.headers.get('access-control-allow-methods')).toBe('get, post, put, delete')
  })

  test('Allow all origins option', async () => {
    const requester = tstReq(tstOrigin, {
      headers: { Origin: tstOrigin },
    }).get

    const mwConfig = await configCorsMiddleware({
      allowedOrigins: ['*'],
      allowedMethods: ['GET', 'PATCH'],
    })

    const response = await mwConfig(requester, async () => {})

    expect(response.headers.get('access-control-allow-origin')).toBe('*')
  })

  test('unallowed method with options request', async () => {
    const request = tstReq(tstOrigin, {
      headers: {
        Origin: tstOrigin,
        'Access-Control-Request-Method': 'PATCH',
      },
    }).options

    const mwConfig = await configCorsMiddleware({
      allowedOrigins: [tstOrigin],
      allowedMethods: ['GET', 'POST'],
    })

    const response = await mwConfig(request, async () => {})

    expect(response.status).toBe(405)
  })

  test('non-options request', async () => {
    const requester = new Request(tstOrigin, {
      method: 'GET',
      headers: new Headers({
        Origin: tstOrigin,
      }),
    })
    const mwConfig = await configCorsMiddleware({
      allowedMethods: ['GET'],
      allowedOrigins: [tstOrigin],
    })

    const response = await mwConfig(requester, async () => {})

    expect(response?.headers.get('access-control-allow-origin')).toBe(tstOrigin.toLowerCase())
  })

  test('should set Access-Control-Allow-Origin header to request origin', async () => {
    const request = tstReq(tstOrigin, {
      headers: { Origin: tstOrigin },
    }).get

    const mwConfig = await configCorsMiddleware({
      allowedOrigins: [tstOrigin],
    })

    const response = await mwConfig(request, async () => {})

    expect(response.headers.get('access-control-allow-origin')).toBe(tstOrigin.toLowerCase())
  })

  test('should set Access-Control-Allow-Origin header to * if allowedOrigins includes *', async () => {
    const request = tstReq(tstOrigin, {
      headers: { Origin: tstOrigin },
    }).get

    const mwConfig = await configCorsMiddleware({ allowedOrigins: ['*'] })

    const response = await mwConfig(request, async () => {})

    expect(response.headers.get('access-control-allow-origin')).toBe('*')
  })

  test('should set Access-Control-Allow-Methods header to allowedMethods', async () => {
    const request = new Request('http://example.com', {
      headers: { Origin: 'http://example.com' },
      method: 'GET',
    })

    const mwConfig = await configCorsMiddleware({
      allowedMethods: ['GET', 'POST'],
      allowedOrigins: [tstOrigin],
    })

    const response = await mwConfig(request, async () => {})
    expect(response.headers.get('access-control-allow-methods')).toBe('get, post')
  })

  test('should set Access-Control-Allow-Headers header to allowedHeaders', async () => {
    const request = tstReq(tstOrigin, {
      headers: { Origin: tstOrigin, 'Content-Type': 'application/json' },
    }).get

    const mwConfig = configCorsMiddleware({
      allowedHeaders: ['Content-Type'],
      allowedOrigins: [tstOrigin],
    })

    const response = await mwConfig(request, async () => {})

    expect(response.headers.get('access-control-allow-headers')).toBe('content-type')
  })

  test('should return 400 Bad Request if request does not have Origin header', async () => {
    const request = tstReq(tstOrigin, {
      noOrigin: true,
    }).get
    const mwConfig = await configCorsMiddleware({})
    const response = await mwConfig(request, async () => {})

    expect(response.status).toBe(400)
  })

  test('should return 403 Forbidden if request origin is not allowed', async () => {
    const request = new Request('http://example.org', {
      headers: { Origin: 'http://example.org' },
    })

    const mwConfig = await configCorsMiddleware({
      allowedOrigins: ['http://example.com'],
    })

    const response = await mwConfig(request, async () => {})

    expect(response.status).toBe(403)
  })

  test('should return 405 Method Not Allowed if request method is not allowed', async () => {
    const request = tstReq(tstOrigin, {
      headers: {
        'Access-Control-Request-Method': 'POST',
      },
    }).post

    const response = await configCorsMiddleware(
      {
        allowedMethods: ['GET'],
        allowedOrigins: [tstOrigin],
      },
      true
    )(request, async () => {})

    expect(response.status).toBe(405)
  })

  test('should return 204 No Content if request method is options and allowed', async () => {
    const request = tstReq(tstOrigin, {
      headers: {
        'Access-Control-Request-Method': 'GET',
      },
    }).options

    const mwConfig = await configCorsMiddleware({
      allowedMethods: ['GET'],
      allowedOrigins: [tstOrigin],
    })

    const response = await mwConfig(request, async () => {})

    expect(response.status).toBe(204)
  })
})
