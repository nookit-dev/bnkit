import { beforeEach, describe, expect, it, jest, test } from 'bun:test'
import { serverRequestHandler } from './incoming-request-handler'
import { middlewareFactory } from './middleware-factory'

describe('serverRequestHandler', () => {
  const mockRoutes = {
    '/test': {
      get: jest.fn().mockResolvedValue(new Response('Test GET')),
      post: jest.fn().mockResolvedValue(new Response('Test POST')),
    },
    '/regex/\\d+': {
      get: jest.fn().mockResolvedValue(new Response('Regex GET')),
    },
  }

  const mockMiddlewareFactory = middlewareFactory({})
  const mockExecuteMiddlewares = jest.fn().mockResolvedValue({})

  beforeEach(() => {
    jest.clearAllMocks()
    mockMiddlewareFactory.executeMiddlewares = mockExecuteMiddlewares
  })

  it('handles exact path match', async () => {
    const req = new Request('http://example.com/test', { method: 'GET' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddlewareFactory })

    expect(mockRoutes['/test'].get).toHaveBeenCalled()
    expect(await response.text()).toBe('Test GET')
  })

  it('handles regex path match', async () => {
    const req = new Request('http://example.com/regex/123', { method: 'GET' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddlewareFactory })

    expect(mockRoutes['/regex/\\d+'].get).toHaveBeenCalled()
    expect(await response.text()).toBe('Regex GET')
  })

  it('returns 404 for unmatched path', async () => {
    const req = new Request('http://example.com/nonexistent', { method: 'GET' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddlewareFactory })

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Not Found')
  })

  it('returns 404 for unmatched method', async () => {
    const req = new Request('http://example.com/test', { method: 'PUT' })
    const response = await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddlewareFactory })

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Not Found')
  })

  it('executes middleware before route handler', async () => {
    const req = new Request('http://example.com/test', { method: 'GET' })
    await serverRequestHandler({ req, routes: mockRoutes, middlewareRet: mockMiddlewareFactory })

    expect(mockExecuteMiddlewares).toHaveBeenCalled()
    expect(mockRoutes['/test'].get).toHaveBeenCalled()

    // Check the order of calls
    const mockCalls = mockExecuteMiddlewares.mock.invocationCallOrder[0]
    const routeHandlerCalls = mockRoutes['/test'].get.mock.invocationCallOrder[0]
    expect(mockCalls).toBeLessThan(routeHandlerCalls)
  })

  it('handles OPTIONS request with optionsHandler', async () => {
    const mockOptionsHandler = jest.fn().mockResolvedValue(new Response('OPTIONS'))
    const req = new Request('http://example.com/test', { method: 'OPTIONS' })
    const response = await serverRequestHandler({
      req,
      routes: mockRoutes,
      middlewareRet: mockMiddlewareFactory,
      optionsHandler: mockOptionsHandler,
    })

    expect(mockOptionsHandler).toHaveBeenCalled()
    expect(await response.text()).toBe('OPTIONS')
  })
})
