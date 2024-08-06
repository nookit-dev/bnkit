import { describe, expect, mock, test } from 'bun:test'
import { middlewareFactory } from './middleware-factory'
import type { Middleware } from './middleware-types'

describe('middlewareFactory', () => {
  test('should execute middlewares in order', async () => {
    const mockMiddleware1: Middleware<string> = mock(async (req, next) => {
      await next()
      return 'middleware1'
    })

    const mockMiddleware2: Middleware<number> = mock(async (req, next) => {
      await next()
      return 42
    })

    const factory = middlewareFactory({
      mw1: mockMiddleware1,
      mw2: mockMiddleware2,
    })

    const req = new Request('https://example.com')
    const results = await factory.executeMiddlewares(req)

    expect(results).toEqual({
      mw1: 'middleware1',
      mw2: 42,
    })

    expect(mockMiddleware1).toHaveBeenCalledTimes(1)
    expect(mockMiddleware2).toHaveBeenCalledTimes(1)
  })
  
  test('should handle errors in middleware', async () => {
    const errorMiddleware: Middleware<never> = mock(async (req, next) => {
      throw new Error('Middleware error')
    })
  
    const factory = middlewareFactory({
      errorMw: errorMiddleware,
    })
  
    const req = new Request('https://example.com')
    
    await expect(factory.executeMiddlewares(req)).rejects.toThrow('Middleware error')
  })

  test('should pass control to next middleware', async () => {
    const middleware1: Middleware<string> = mock((req, next) => {
      next()
      return Promise.resolve('middleware1')
    })

    const middleware2: Middleware<string> = mock((req, next) => {
      return Promise.resolve('middleware2')
    })

    const factory = middlewareFactory({
      mw1: middleware1,
      mw2: middleware2,
    })

    const req = new Request('https://example.com')
    const results = await factory.executeMiddlewares(req)

    expect(results).toEqual({
      mw1: 'middleware1',
      mw2: 'middleware2',
    })

    expect(middleware1).toHaveBeenCalledTimes(1)
    expect(middleware2).toHaveBeenCalledTimes(1)
  })

  test('should infer types correctly', () => {
    const factory = middlewareFactory({
      mw1: () => 'string',
      mw2: () => 42,
    })

    const types = factory.inferTypes()

    // TypeScript should infer this type correctly
    type InferredTypes = {
      mw1: string
      mw2: number
    }

    // This line will cause a TypeScript error if the types are not inferred correctly
    const _test: InferredTypes = types
  })
})
