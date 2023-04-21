# CRUD Server

A simple CRUD (Create, Read, Update, Delete) server for handling API requests and providing a router for frontend pages.

## Features

- Built with TypeScript and compatible with Deno
- Supports API routes for creating, reading, updating, and deleting data
- Provides a router for handling frontend pages
- Includes a WebSocket implementation for real-time communication
- Includes a fetcher function for handling API requests and error handling

## Installation

To install the module, run:

```bash
npm install crud-server
```

## Usage

### Basic Usage

Here's an example of how to create a server and add a route:

```typescript
import { createCrudServer, createRouter } from "crud-server";

const router = createRouter();
router.addRoute("/", "GET", () => new Response("Hello, world!"));

const server = createCrudServer({ router });
server.start();
```

This creates a server with a router and adds a simple GET route that returns "Hello, world!".

### API Routes

To handle API requests, use the `createCrudServer` function and provide a router with your desired routes.

```typescript
import { createCrudServer, createRouter } from "crud-server";

const router = createRouter();
router.addRoute("/api/create", "POST", async (req) => {
  const item = await req.json();
  // create item in database
  return new Response("Created", { status: 201 });
});

const server = createCrudServer({ router });
server.start();
```

This creates a server with a router and adds a `POST` route for creating items. You can add additional routes for reading, updating, and deleting items as needed.

### WebSocket Support

You can also add WebSocket support to your server:

```typescript
import {
  createCrudServer,
  createRouter,
  useWebSockets,
} from "crud-server/bundle";

const router = createRouter();
const { open, message, close, error, drain } = useWebSockets();

router.addRoute("/ws", "GET", () => {
  const title = "WebSocket Example";
  const body = `
    <h1>${title}</h1>
    <script>
      const ws = new WebSocket("ws://" + window.location.host + "/ws");
      ws.onopen = event =>
        console.log("WebSocket connection opened");
      ws.onmessage = event =>
        console.log("WebSocket message received:", event.data);
      ws.onclose = event =>
        console.log("WebSocket connection closed");
      ws.onerror = event =>
        console.error("WebSocket error:", event);
    </script>
  `;
  return new Response(body, { status: 200 });
});

const server = createCrudServer({ router });

server.start().then((s) => {
  const wss = s.websocket();
  wss.accept().then((ws) => {
    ws.on("open", () => open(ws));
    ws.on("message", (message) => message(ws, message));
    ws.on("close", () => close(ws));
    ws.on("error", (error) => error(ws, error));
    ws.on("drain", () => drain(ws));
  });
});
```

This creates a WebSocket route, adds an HTML page that connects to the WebSocket, and sets up handlers for WebSocket events.

### Error Handling

The module includes a `handleError` function that you can use to validate and handle errors in your server.

```typescript
import { handleError } from "crud-server/error-handler-validation";

try {
  // some code
} catch (error) {
  const handledError = handleError(error);
  if (handledError) {
    return new Response(handledError.message, { status: 400 });
  }
}
```

The `handleError` function returns `null` if the error was not recognized or could not be handled.

### Fetcher Function

The module also includes a `createFetcher` function that you can use to create a fetcher with error handling:

```typescript
import { createFetcher } from "crud-server";

const fetcher = createFetcher();

const response = await fetcher<MyResponseType>(url, options);
```

The `createFetcher` function returns a function that you can use to fetch data from your API. If the response is not `ok`, it throws an `APIError`, which you can catch and handle with `handleError`.