import { describe, expect, it, jest } from "bun:test";
import { composeMiddlewares, generateMiddlewares } from "./middleware-handlers";


describe("generateMiddlewares", () => {
  it("should return an empty array if no options are provided", () => {
    const middlewares = generateMiddlewares({});
    expect(middlewares).toEqual([]);
  });

  it("should include cors middleware if cors options are provided", () => {
    const corsOptions = { origin: "https://example.com" };
    const middlewares = generateMiddlewares({ cors: corsOptions });
    expect(middlewares).toHaveLength(1);
    expect(middlewares[0]).toBeInstanceOf(Function);
  });

  it("should include body parser middleware if enabled", () => {
    const middlewares = generateMiddlewares({ enableBodyParser: true });
    expect(middlewares).toHaveLength(1);
    expect(middlewares[0]).toBeInstanceOf(Function);
  });

  it("should include check file size middleware if max file size is provided", () => {
    const middlewares = generateMiddlewares({ maxFileSize: 1024 });
    expect(middlewares).toHaveLength(1);
    expect(middlewares[0]).toBeInstanceOf(Function);
  });

  it("should include all middlewares if all options are provided", () => {
    const corsOptions = { origin: "https://example.com" };
    const middlewares = generateMiddlewares({
      cors: corsOptions,
      enableBodyParser: true,
      maxFileSize: 1024,
    });
    expect(middlewares).toHaveLength(3);
    expect(middlewares[0]).toBeInstanceOf(Function);
    expect(middlewares[1]).toBeInstanceOf(Function);
    expect(middlewares[2]).toBeInstanceOf(Function);
  });
});

describe("composeMiddlewares", () => {
  it("should return a function", () => {
    const handler = jest.fn();
    const response = {} as Response;
    const middleware = composeMiddlewares([], handler, response);
    expect(middleware).toBeInstanceOf(Function);
  });

  it("should call the handler if no middlewares are provided", async () => {
    const handler = jest.fn().mockResolvedValue({} as Response);
    const response = {} as Response;
    const middleware = composeMiddlewares([], handler, response);
    const request = {} as Request;
    const result = await middleware(request);

    // Instead of using toHaveBeenCalledWith, manually inspect the calls
    expect(handler.mock.calls.length).toBe(1);
    expect(handler.mock.calls[0][0]).toEqual(request);

    expect(result).toEqual({});
  });

  it("should call all middlewares in order", async () => {
    const middleware1 = jest.fn().mockImplementation(async ({ next }) => {
      const response = await next();
      response.headers.set("X-Middleware-1", "true");
      return response;
    });
    const middleware2 = jest.fn().mockImplementation(async ({ next }) => {
      const response = await next();
      response.headers.set("X-Middleware-2", "true");
      return response;
    });
    const handler = jest.fn().mockResolvedValue({
      headers: new Headers(),
    } as Response);

    const response = {} as Response;
    const middleware = composeMiddlewares(
      [middleware1, middleware2],
      handler,
      response
    );
    const request = {} as Request;
    const result = await middleware(request);
    expect(middleware1.mock.calls.length).toBe(1);
    expect(middleware1.mock.calls[0][0]).toHaveProperty("request");

    // Instead of using toHaveBeenCalledWith, manually inspect the calls for middleware2
    expect(middleware2.mock.calls.length).toBe(1);
    expect(middleware2.mock.calls[0][0]).toHaveProperty("request");
    
    // Instead of using toHaveBeenCalledWith, manually inspect the calls for handler
    expect(handler.mock.calls.length).toBe(1);
    expect(handler.mock.calls[0][0]).toEqual(request);
    
    expect(result.headers.get("X-Middleware-1")).toBe("true");
    expect(result.headers.get("X-Middleware-2")).toBe("true");
  });
});
