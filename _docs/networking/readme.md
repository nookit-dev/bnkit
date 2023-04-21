# Bun Crud Server

This module provides utilities for creating a server using [Bun](https://github.com/bunnyyiusip/bun) that can handle CRUD (Create, Read, Update, Delete) operations for a given schema. It also includes a router for handling frontend pages and supports WebSockets.

## Installation

```
npm install bun-crud-server
```

## Usage

```typescript
import { createCrudServer, createRouter } from 'bun-crud-server';

const router = createRouter();

// Add API routes
router.addRoute('/api/create', 'POST', createItemHandler);
router.addRoute('/api/read', 'GET', readItemsHandler);
router.addRoute('/api/update', 'PUT', updateItemHandler);
router.addRoute('/api/delete', 'DELETE', deleteItemHandler);

const server = createCrudServer({ router });

// Start the server
server.start();
```

### API

#### `createCrudServer({router?: ServerRouter, port?: number}): CrudServer`

Creates a new `CrudServer` instance.

- `router`: An optional `ServerRouter` instance for handling frontend pages. Defaults to an empty router.
- `port`: The port number to use for the server. Defaults to `4000`.

Returns a `CrudServer` instance with three methods:

- `start()`: Starts the server and returns the `Server` instance.
- `stop()`: Stops the server.
- `router`: The `ServerRouter` instance used by the server.

#### `createRouter(routeConfigs?: ServerRoute[]): ServerRouter`

Creates a new `ServerRouter` instance.

- `routeConfigs`: An optional array of `ServerRoute` objects.

Returns a `ServerRouter` instance with two methods:

- `addRoute(path: string, method: string, handler: RouteHandler)`: Adds a new route with the given path, HTTP method, and handler function.
- `handleRequest(req: Request): Response`: Handles the given `Request` object and returns a `Response` object.

### License

[MIT](https://opensource.org/licenses/MIT)