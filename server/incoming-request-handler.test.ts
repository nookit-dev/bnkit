import { beforeEach, describe, expect, it, jest, test } from 'bun:test'
import { serverRequestHandler } from './incoming-request-handler'
import { middlewareFactory } from './middleware-factory'
import type { Routes } from './route-types'

describe('serverRequestHandler', () => {
  const mockRoutes: Routes<any> = {
    '/test': {
      get: jest.fn().mockResolvedValue(new Response('Test GET')),
      post: jest.fn().mockResolvedValue(new Response('Test POST')),
    },
    '/regex/\\d+': {
      get: jest.fn().mockResolvedValue(new Response('Regex GET')),
    },
  }

  const mockMiddlewareFactory = middlewareFactory({
    test: () => ({ test: 'data' }),
  })

  const mockOptionsHandler = jest.fn().mockResolvedValue(new Response('Options'))

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle a simple GET request', async () => {
    const req = new Request('http://example.com/test', { method: 'GET' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddlewareFactory })

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('Test GET')
    expect(mockRoutes['/test'].get).toHaveBeenCalled()
  })

  it('should handle a POST request', async () => {
    const req = new Request('http://example.com/test', { method: 'POST' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddlewareFactory })

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('Test POST')
    expect(mockRoutes['/test'].post).toHaveBeenCalled()
  })

  it('should handle a regex route', async () => {
    const req = new Request('http://example.com/regex/123', { method: 'GET' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddlewareFactory })

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('Regex GET')
    expect(mockRoutes['/regex/\\d+'].get).toHaveBeenCalled()
  })

  it('should return 404 for unmatched routes', async () => {
    const req = new Request('http://example.com/nonexistent', { method: 'GET' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddlewareFactory })

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Not Found')
  })

  it('should handle OPTIONS requests', async () => {
    const req = new Request('http://example.com/test', { method: 'OPTIONS' })
    const response = await serverRequestHandler({
      req,
      routes: mockRoutes,
      middlewareRet: mockMiddlewareFactory,
      optionsHandler: mockOptionsHandler,
    })

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('Options')
    expect(mockOptionsHandler).toHaveBeenCalled()
  })

  it('should return default OPTIONS response if no optionsHandler provided', async () => {
    const req = new Request('http://example.com/test', { method: 'OPTIONS' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddlewareFactory })

    expect(response.status).toBe(204)
  })
  it('should handle middleware responses', async () => {
    const mockMiddleware = middlewareFactory({
      test: () => new Response('Middleware Response'),
    })
    const req = new Request('http://example.com/test', { method: 'GET' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddleware })
    expect(response.status).toBe(200)
    const responseText = await response.text()
    expect(responseText).toBe('Middleware Response')
    // Ensure that the route handler wasn't called
    expect(mockRoutes['/test'].get).not.toHaveBeenCalled()
  })
  it('should handle errors and return 500 status', async () => {
    const errorRoutes: Routes<any> = {
      '/error': {
        get: jest.fn().mockRejectedValue(new Error('Test Error')),
      },
    }
    const req = new Request('http://example.com/error', { method: 'GET' })
    const response = await serverRequestHandler({ req, routes: errorRoutes, middlewareRet: mockMiddlewareFactory })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Test Error')
  })
  it('should handle nested regex routes', async () => {
    const nestedRegexRoutes: Routes<any> = {
      '/api/users/\\d+/posts/\\d+': {
        get: jest.fn().mockResolvedValue(new Response('Nested Regex GET')),
      },
    }
    const req = new Request('http://example.com/api/users/123/posts/456', { method: 'GET' })
    const response = await serverRequestHandler({
      req,
      routes: nestedRegexRoutes,
      middlewareRet: mockMiddlewareFactory,
    })

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('Nested Regex GET')
    expect(nestedRegexRoutes['/api/users/\\d+/posts/\\d+'].get).toHaveBeenCalled()
  })

  it('should handle URLs with query parameters', async () => {
    const req = new Request('http://example.com/test?param1=value1&param2=value2', { method: 'GET' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddlewareFactory })
  
    console.log('Response:', {
      status: response.status,
      headers: response.headers.toJSON(),
      bodyUsed: response.bodyUsed,
    })
  
    expect(response.status).toBe(200)
    
    if (!response.bodyUsed) {
      const text = await response.text()
      expect(text).toBe('Test GET')
    } else {
      console.warn('Response body already used')
    }
    
    expect(mockRoutes['/test'].get).toHaveBeenCalled()
  })

  it('should return 405 Method Not Allowed for unsupported methods', async () => {
    const req = new Request('http://example.com/test', { method: 'PUT' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddlewareFactory })

    expect(response.status).toBe(405)
    expect(await response.text()).toBe('Method Not Allowed')
  })

  it('should handle errors in middleware', async () => {
    const errorMiddleware = middlewareFactory({
      error: () => {
        throw new Error('Middleware Error')
      },
    })
    const req = new Request('http://example.com/test', { method: 'GET' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: errorMiddleware })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Middleware Error')
  })

  it('should handle URLs with Unicode characters', async () => {
    const unicodeRoutes: Routes<any> = {
      '/test/üñîçødé': {
        get: jest.fn().mockResolvedValue(new Response('Unicode GET')),
      },
    }
    const req = new Request('http://example.com/test/üñîçødé', { method: 'GET' })
    const response = await serverRequestHandler({ req, routes: unicodeRoutes, middlewareRet: mockMiddlewareFactory })

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('Unicode GET')
    expect(unicodeRoutes['/test/üñîçødé'].get).toHaveBeenCalled()
  })
})
