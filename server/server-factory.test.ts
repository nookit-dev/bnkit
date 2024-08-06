import { afterEach, beforeEach, describe, expect, it, jest, mock, spyOn } from 'bun:test'
import { serverRequestHandler } from './incoming-request-handler'
import { middlewareFactory } from './middleware-manager'
import { serverFactory } from './server-factory'

describe('serverFactory', () => {
  const mockServe = jest.fn()
  const mockMiddleware = middlewareFactory({})
  const mockRoutes = {}
  const mockFetchHandler = jest.fn()
  const mockOptionsHandler = jest.fn()
  const mockWebSocket = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return an object with a start function', () => {
    const server = serverFactory({
      routes: mockRoutes,
    })

    expect(typeof server.start).toBe('function')
  })

  it('should call serve with correct parameters', () => {
    const server = serverFactory({
      middleware: mockMiddleware,
      routes: mockRoutes,
      fetchHandler: mockFetchHandler,
      optionsHandler: mockOptionsHandler,
      serve: mockServe,
      websocket: mockWebSocket,
    })

    server.start(8080)

    expect(mockServe).toHaveBeenCalledWith({
      port: 8080,
      fetch: expect.any(Function),
      websocket: mockWebSocket,
    })
  })

  it('should use default port 3000 if not specified', () => {
    const server = serverFactory({
      routes: mockRoutes,
      serve: mockServe,
    })

    server.start()

    expect(mockServe).toHaveBeenCalledWith(
      expect.objectContaining({
        port: 3000,
      })
    )
  })

  it('should log starting message in development environment', () => {
    const originalEnv = Bun.env.NODE_ENV
    Bun.env.NODE_ENV = 'development'
    const consoleSpy = spyOn(console, 'log')

    const server = serverFactory({
      routes: mockRoutes,
      serve: mockServe,
    })

    server.start(5000)

    expect(consoleSpy).toHaveBeenCalledWith('Starting server on port: ', 5000)
    expect(consoleSpy).toHaveBeenCalledTimes(1)

    consoleSpy.mockRestore()
    Bun.env.NODE_ENV = originalEnv
  })

  it('should not log starting message in production environment', () => {
    const originalEnv = Bun.env.NODE_ENV
    Bun.env.NODE_ENV = 'production'
    const consoleSpy = spyOn(console, 'log')

    const server = serverFactory({
      routes: mockRoutes,
      serve: mockServe,
    })

    server.start(5000)

    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
    Bun.env.NODE_ENV = originalEnv
  })

  it('should use serverRequestHandler as default fetchHandler', () => {
    const mockServerRequestHandler = mock(() => new Response('Mocked response'))
    const originalModule = require('./incoming-request-handler')

    // Mock the module
    mock.module('./incoming-request-handler', () => ({
      serverRequestHandler: mockServerRequestHandler,
    }))

    // Re-import serverFactory to use the mocked version
    const { serverFactory } = require('./server-factory')

    const server = serverFactory({
      routes: mockRoutes,
      serve: mockServe,
    })

    server.start()

    const fetchHandler = mockServe.mock.calls[0][0].fetch
    expect(fetchHandler).toBeDefined()

    const mockRequest = new Request('http://example.com')
    fetchHandler(mockRequest)

    expect(mockServerRequestHandler).toHaveBeenCalledTimes(1)
    expect(mockServerRequestHandler).toHaveBeenCalledWith({
      req: mockRequest,
      routes: mockRoutes,
      middlewareRet: undefined,
      optionsHandler: undefined,
    })

    // Restore the original module
    mock.restore()
  })

  it('should use custom fetchHandler when provided', () => {
    const customFetchHandler = jest.fn()
    const server = serverFactory({
      routes: mockRoutes,
      fetchHandler: customFetchHandler,
      serve: mockServe,
    })

    server.start()

    const fetchHandler = mockServe.mock.calls[0][0].fetch
    expect(fetchHandler).toBeDefined()

    const mockRequest = new Request('http://example.com')
    fetchHandler(mockRequest)

    expect(customFetchHandler).toHaveBeenCalledTimes(1)
    expect(customFetchHandler).toHaveBeenCalledWith({
      req: mockRequest,
      routes: mockRoutes,
      middlewareRet: undefined,
      optionsHandler: undefined,
    })
  })
})
