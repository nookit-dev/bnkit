import { describe, expect, it } from 'bun:test'
import { htmlRes, jsonRes, parseQueryParams, parseRequestHeaders, redirectRes } from './server-utils'

describe('server-utils', () => {
  describe('parseQueryParams', () => {
    it('should parse query parameters correctly', () => {
      const request = new Request('http://example.com?foo=bar&baz=qux')
      const params = parseQueryParams(request)
      expect(params).toEqual({ foo: 'bar', baz: 'qux' })
    })

    it('should return an empty object for no query parameters', () => {
      const request = new Request('http://example.com')
      const params = parseQueryParams(request)
      expect(params).toEqual({})
    })
  })

  describe('parseRequestHeaders', () => {
    it('should parse request headers correctly', () => {
      const headers = new Headers({
        'Content-Type': 'application/json',
        'X-Custom-Header': 'custom value'
      })
      const request = new Request('http://example.com', { headers })
      const parsedHeaders = parseRequestHeaders(request)
      expect(parsedHeaders).toEqual({
        'content-type': 'application/json',
        'x-custom-header': 'custom value'
      })
    })
  })

  describe('jsonRes', () => {
    it('should create a JSON response with correct content type', () => {
      const body = { foo: 'bar' }
      const response = jsonRes(body)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(response.status).toBe(200)
    })

    it('should merge custom options', () => {
      const body = { foo: 'bar' }
      const options = { status: 201, headers: { 'X-Custom-Header': 'custom value' } }
      const response = jsonRes(body, options)
      expect(response.status).toBe(201)
      expect(response.headers.get('X-Custom-Header')).toBe('custom value')
    })

    it('should copy headers from an existing response', () => {
      const body = { foo: 'bar' }
      const existingResponse = new Response(null, {
        headers: { 'X-Existing-Header': 'existing value' }
      })
      const response = jsonRes(body, {}, existingResponse)
      expect(response.headers.get('X-Existing-Header')).toBe('existing value')
    })
  })

  describe('htmlRes', () => {
    it('should create an HTML response with correct content type', () => {
      const body = '<html><body>Hello</body></html>'
      const response = htmlRes(body)
      expect(response.headers.get('Content-Type')).toBe('text/html')
      expect(response.status).toBe(200)
    })

    it('should merge custom options', () => {
      const body = '<html><body>Hello</body></html>'
      const options = { status: 201, headers: { 'X-Custom-Header': 'custom value' } }
      const response = htmlRes(body, options)
      expect(response.status).toBe(201)
      expect(response.headers.get('X-Custom-Header')).toBe('custom value')
    })
  })

  describe('redirectRes', () => {
    it('should create a redirect response with correct status and location', () => {
      const url = 'http://example.com/redirect'
      const response = redirectRes(url)
      expect(response.status).toBe(302)
      expect(response.headers.get('Location')).toBe(url)
    })

    it('should allow custom status code', () => {
      const url = 'http://example.com/redirect'
      const response = redirectRes(url, { status: 301 })
      expect(response.status).toBe(301)
    })

    it('should set custom headers', () => {
      const url = 'http://example.com/redirect'
      const response = redirectRes(url, { headers: { 'X-Custom-Header': 'custom value' } })
      expect(response.headers.get('X-Custom-Header')).toBe('custom value')
    })

    it('should set cookies if provided', () => {
      const url = 'http://example.com/redirect'
      const response = redirectRes(url, { cookies: { session: 'abc123' } })
      expect(response.headers.get('Set-Cookie')).toBe('session=abc123')
    })
  })
})