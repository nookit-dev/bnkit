import { MiddlewareConfigMap, Routes, serverFactory } from ".";
import { middlewareFactory } from "./middleware-manager";

const timeMiddleware = (
  req: Request,
  options: {
    test1: string;
  }
) => {
  return {
    timestamp: new Date(),
  };
};

const corsHeaders = (request: Request) => {
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
} satisfies Routes<typeof middleware>;

const middlewareControl = middlewareFactory({
  time: timeMiddleware,
  cors: corsHeaders,
});

// Create Server Factory with Middleware Types
const { start } = await serverFactory({ middlewareControl, routes });

// // Start Server
start(3000);
