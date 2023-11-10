import { Middleware, MiddlewareConfigMap, Routes, serverFactory } from ".";
import { middlewareFactory } from "./middleware-manager";

const timeMiddleware: Middleware<
  {
    test1: string;
  },
  {
    timestamp: Date;
  }
> = (req, options) => {
  return {
    timestamp: new Date(),
  };
};

const corsHeaders: Middleware<
  {},
  {
    requestHeaders: Headers;
  }
> = (request: Request) => {
  return {
    requestHeaders: request.headers,
  };
};

const middleware = {
  time: timeMiddleware,
  cors: corsHeaders,
} satisfies MiddlewareConfigMap;

const routes = {
  "/": {
    GET: (req, mid) => {
      return new Response(`Hello World! ${mid?.time?.timestamp}`);
    },
  },
  "/random": {
    GET: (req, mid) => {
      return new Response(`Hello World! ${mid?.time?.timestamp}`);
    },
  },
  "/another-one": {
    POST: (req, mid) => {
      return new Response(`Hello World! ${mid?.time?.timestamp}`);
    },
  },
} satisfies Routes<{
  middleware: typeof middleware;
}>;

const middlewareControl = middlewareFactory({
  time: timeMiddleware,
  cors: corsHeaders,
});

// Create Server Factory with Middleware Types
const { start } = serverFactory({
  middlewareControl,
  routes,
  serve: Bun.serve,
});

// // Start Server
start(3000);
