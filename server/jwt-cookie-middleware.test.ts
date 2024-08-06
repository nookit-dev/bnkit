import { describe, expect, it, mock } from 'bun:test'
import { jwtBack } from '../jwt'
import { clearJwtCookie, jwtCookieMiddleware, setJwtCookie } from './jwt-cookie-middleware'

describe('JWT Cookie Middleware', () => {
  const mockOptions = {
    cookieName: 'auth_token',
    jwtSecret: 'test_secret',
    cookieOptions: { httpOnly: true, secure: true },
  }

  const mockData = { id: 1, username: 'testuser', role: 'admin' }

  it('should set JWT cookie', () => {
    const mockResponse = new Response()
    setJwtCookie(mockOptions, mockData, mockResponse)

    const setCookieHeader = mockResponse.headers.get('Set-Cookie')
    expect(setCookieHeader).toBeTruthy()
    expect(setCookieHeader).toContain('auth_token=')
    expect(setCookieHeader).toContain('httpOnly')
    expect(setCookieHeader).toContain('secure')
  })

  it('should clear JWT cookie', () => {
    const mockResponse = new Response()
    clearJwtCookie(mockOptions, mockResponse)

    const setCookieHeader = mockResponse.headers.get('Set-Cookie')
    expect(setCookieHeader).toBeTruthy()
    expect(setCookieHeader).toContain('auth_token=')
    expect(setCookieHeader).toContain('max-age=-1')
  })

  it('should parse valid JWT from cookie', async () => {
    const middleware = jwtCookieMiddleware(mockOptions)
    const jwtFactory = jwtBack({ factorySignSecret: mockOptions.jwtSecret })
    const token = jwtFactory.createJwt({ payload: mockData })
  
    const mockRequest = new Request('https://example.com', {
      headers: { Cookie: `${mockOptions.cookieName}=${token}` },
    })
  
    const mockNext = mock(() => Promise.resolve())
  
    const result = await middleware(mockRequest, mockNext)
  
    expect(result).toMatchObject(mockData)
    expect(result).toHaveProperty('exp')
    expect(typeof result.exp).toBe('number')
    expect(mockNext).toHaveBeenCalled()
  })
  
  it('should handle invalid JWT in cookie', async () => {
    const middleware = jwtCookieMiddleware(mockOptions)

    const mockRequest = new Request('https://example.com', {
      headers: { Cookie: `${mockOptions.cookieName}=invalid_token` },
    })

    const mockNext = mock(() => Promise.resolve())

    const result = await middleware(mockRequest, mockNext)

    expect(result).toBeNull()
    expect(mockNext).toHaveBeenCalled()
  })

  it('should handle missing cookie', async () => {
    const middleware = jwtCookieMiddleware(mockOptions)

    const mockRequest = new Request('https://example.com')

    const mockNext = mock(() => Promise.resolve())

    const result = await middleware(mockRequest, mockNext)

    expect(result).toBeNull()
    expect(mockNext).toHaveBeenCalled()
  })

  it('should handle different types of data', async () => {
    const middleware = jwtCookieMiddleware(mockOptions)
    const jwtFactory = jwtBack({ factorySignSecret: mockOptions.jwtSecret })

    const testCases = [
      { id: 1, name: 'Test User' },
      { productId: 'abc123', quantity: 5 },
      { token: 'xyz789', expiresAt: new Date().toISOString() },
    ]

    for (const testData of testCases) {
      const token = jwtFactory.createJwt({ payload: testData })
      const mockRequest = new Request('https://example.com', {
        headers: { Cookie: `${mockOptions.cookieName}=${token}` },
      })

      const mockNext = mock(() => Promise.resolve())
      const result = await middleware(mockRequest, mockNext)

      expect(result).toMatchObject(testData)
      expect(result).toHaveProperty('exp')
      expect(typeof result.exp).toBe('number')
      expect(mockNext).toHaveBeenCalled()
    }
  })
})