# Bun Nook Kit Server Module README

## Introduction

The Bun Nook Kit Server Module is a robust solution for building servers in Bun-based applications, emphasizing type safety and modularity. It integrates functionalities like request handling, dynamic routing, middleware management, CORS configurations, and server utilities, providing a comprehensive server-side toolkit for modern web applications.

## Features and Type Safety

### Type-Safe Middleware

- **Middleware**: Defines the structure and expected return type for each middleware function.
- **MiddlewareConfigMap**: Maps middleware identifiers to their respective middleware functions, ensuring type consistency.

### Type-Safe Routes

- **Routes**: Defines routes with associated HTTP methods and their corresponding handlers.
- **RouteHandler**: Specifies the structure for route handling functions, including request and middleware data parameters.

### Server Factory with Type Safety

- Ensures that the server is configured with the correct types for middleware and routes, maintaining consistent and predictable behavior.

## Usage Examples with Type Safety

### Defining Middleware with Types

```javascript
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

### Creating Routes with Type-Safe Handlers

```javascript
import { Routes } from 'bnkit/server';

const routes: Routes<{ middleware: typeof middleware }> = {
  "/": {
    GET: (req, mid) => new Response(`Hello World! ${mid?.time?.timestamp}`)
  },
  // other routes
} satisfies Routes<{ middleware: typeof middleware }>;
```

### Configuring and Starting the Server

```javascript
import { serverFactory, middlewareFactory } from 'bnkit/server';

const middlewareControl = middlewareFactory(middleware);

const { start } = serverFactory({
  middlewareControl,
  routes,
  serve: Bun.serve,
});

start(3000); // Start the server on port 3000
```

## Integration with Bun and Other Modules

This server module is designed to integrate seamlessly with Bun and other modules in the Bun Nook Kit, providing a type-safe, flexible solution for web application development. 

### The server integrates very well with the following modules:
- [HTMLody](../htmlody/HTMLODY-README.md)
- [JWT](../jwt/JWT-README.md)
- [Cookie](../cookies/COOKIES-README.md)
- [Files And Folder](../files-folders/FILES-FOLDER-README.md)
- [Auth](../auth//AUTH-README.md)
- [SQlite](../sqlite/SQLITE-README.md)

