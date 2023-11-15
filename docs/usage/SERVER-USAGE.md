### Server Module Usage Guide with TypeScript and HTMLody Integration

---

## Introduction

The Bun Nook Kit Server Module is designed for creating robust servers in Bun-based applications. It emphasizes type safety and modularity, integrating request handling, dynamic routing, middleware management, CORS configurations, and server utilities.

---

## Key Features

1. **Type-Safe Middleware**: Ensures structure and return type consistency for each middleware function.
2. **Type-Safe Routes**: Defines routes with HTTP methods and their corresponding handlers, maintaining type consistency.
3. **Server Factory with Type Safety**: Guarantees correct types for middleware and routes, ensuring consistent and predictable server behavior.

---

## Usage Examples

### 1. Defining Middleware with Types

```typescript
import { Middleware, MiddlewareConfigMap } from 'bnkit/server';

const timeMiddleware: Middleware<
  { test1: string },
  { timestamp: Date }
> = (req, options) => {
  return { timestamp: new Date() };
};

const corsHeaders: Middleware<
  {},
  { requestHeaders: Headers }
> = (request) => {
  return { requestHeaders: request.headers };
};

const middleware = { time: timeMiddleware, cors: corsHeaders } satisfies MiddlewareConfigMap;
```

### 2. Creating Type-Safe Routes

```typescript
import { Routes } from 'bnkit/server';

const routes: Routes<{ middleware: typeof middleware }> = {
  "/": {
    GET: (req, mid) => new Response(`Hello World! ${mid?.time?.timestamp}`)
  },
  // other routes
} satisfies Routes<{ middleware: typeof middleware }>;
```

### 3. Configuring and Starting the Server

```typescript
import { serverFactory, middlewareFactory } from 'bnkit/server';

const middlewareControl = middlewareFactory(middleware);

const { start } = serverFactory({
  middlewareControl,
  routes,
});

start(3000); // Start the server on port 3000
```

### 4. Integration with HTMLody

Integrating the server with HTMLody can be done by using HTMLody to generate HTML content for server responses. For example, you can create a route that returns an HTMLody-generated page:

```typescript
import { jsonToHtml } from 'bnkit/htmlody';
import { htmlRes } from 'bnkit/server'

const htmlRoute: RouteHandler = (req, mid) => {
  const page = /* Define your HTMLody page here */;
  const htmlContent = jsonToHtml(page);

  return htmlRes(htmlContent)
};

// Add htmlRoute to your routes
routes["/html"] = { GET: htmlRoute };
```

## TODO: Add HTMLody builder xample
