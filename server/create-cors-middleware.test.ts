import { beforeEach, describe, expect, it, jest } from 'bun:test'
import type { CORSOptions } from '../utils/http-types'
import { configCorsMiddleware } from './create-cors-middleware'

describe('configCorsMiddleware', () => {
  const mockNext = jest.fn()

  beforeEach(() => {
    mockNext.mockClear()
  })

  const createMockRequest = (method: string, origin: string) => {
    return {
      method,
      headers: new Headers({ Origin: origin }),
    } as Request
  }

  it('should set CORS headers for allowed origin', () => {
    const options: CORSOptions = {
      allowedOrigins: ['http://example.com'],
      allowedMethods: ['GET', 'POST'],
    }
    const middleware = configCorsMiddleware(options)
    const req = createMockRequest('GET', 'http://example.com')

    const headers = middleware(req, mockNext)

    expect(headers.get('Access-Control-Allow-Origin')).toBe('http://example.com')
    expect(headers.get('Access-Control-Allow-Methods')).toBe('GET, POST')
    expect(mockNext).toHaveBeenCalled()
  })

  it('should handle OPTIONS request', () => {
    const options: CORSOptions = {
      allowedOrigins: ['http://example.com'],
      allowedMethods: ['GET', 'POST'],
    }
    const middleware = configCorsMiddleware(options)
    const req = createMockRequest('OPTIONS', 'http://example.com')
    req.headers.set('Access-Control-Request-Method', 'GET')

    const response = middleware(req, mockNext)

    expect(response).toBeInstanceOf(Response)
    if (response instanceof Response) {
      expect(response.status).toBe(204)
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com')
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST')
    }
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should throw error for disallowed origin', () => {
    const options: CORSOptions = {
      allowedOrigins: ['http://example.com'],
      allowedMethods: ['GET'],
    }
    const middleware = configCorsMiddleware(options)
    const req = createMockRequest('GET', 'http://malicious.com')

    expect(() => middleware(req, mockNext)).toThrow('Origin http://malicious.com not allowed')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should throw error for disallowed method', () => {
    const options: CORSOptions = {
      allowedOrigins: ['http://example.com'],
      allowedMethods: ['GET'],
    }
    const middleware = configCorsMiddleware(options)
    const req = createMockRequest('POST', 'http://example.com')

    expect(() => middleware(req, mockNext)).toThrow('Method POST not allowed')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should handle wildcard origin', () => {
    const options: CORSOptions = {
      allowedOrigins: ['*'],
      allowedMethods: ['GET'],
    }
    const middleware = configCorsMiddleware(options)
    const req = createMockRequest('GET', 'http://any-origin.com')

    const headers = middleware(req, mockNext)

    expect(headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(mockNext).toHaveBeenCalled()
  })

  it('should set credentials header when specified', () => {
    const options: CORSOptions = {
      allowedOrigins: ['http://example.com'],
      allowedMethods: ['GET'],
      credentials: true,
    }
    const middleware = configCorsMiddleware(options)
    const req = createMockRequest('GET', 'http://example.com')

    const headers = middleware(req, mockNext)

    expect(headers.get('Access-Control-Allow-Credentials')).toBe('true')
    expect(mockNext).toHaveBeenCalled()
  })

  it('should set allowed headers when specified', () => {
    const options: CORSOptions = {
      allowedOrigins: ['http://example.com'],
      allowedMethods: ['GET'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }
    const middleware = configCorsMiddleware(options)
    const req = createMockRequest('GET', 'http://example.com')

    const headers = middleware(req, mockNext)

    expect(headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization')
    expect(mockNext).toHaveBeenCalled()
  })
})