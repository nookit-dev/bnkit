# Bun

Bun is a lightweight web framework that allows you to easily create HTTP servers and WebSocket servers in Deno using TypeScript. It includes a server, server router, fetcher function, and utilities for handling errors and validating data.

## Basic Usage

```ts
import { serve } from "bun";

const server = serve({
  port: 8000,
  async fetch(request) {
    const headers = { "Content-Type": "text/plain" };
    const body = "Hello, World!";
    return new Response(body, { headers });
  },
});

console.log("Server listening on port 8000");

await server.run();
```

## Router

Bun includes a router that allows you to define routes using the `addRoute` method, and handle incoming requests with the `handleRequest` method.

```ts
import { createRouter } from "bun";

const router = createRouter();

router.addRoute("/", "GET", () => {
  const headers = { "Content-Type": "text/plain" };
  const body = "Hello, World!";
  return new Response(body, { headers });
});

router.addRoute("/users", "GET", () => {
  // Handle GET request for /users
});

router.addRoute("/users", "POST", () => {
  // Handle POST request for /users
});

const server = serve({
  port: 8000,
  async fetch(request) {
    const response = await router.handleRequest(request);
    return response;
  },
});

console.log("Server listening on port 8000");

await server.run();
```

## Fetcher

Bun includes a fetcher utility that wraps the `fetch` function and handles errors for you:

```ts
import { createFetcher } from "bun";

const fetcher = createFetcher();

try {
  const data = await fetcher<{ message: string }>("https://example.com/api");
  console.log(data.message);
} catch (error) {
  console.error(error);
}
```

## Error Handling

Bun includes a utility function for validating and handling errors that can be thrown when handling requests or processing data:

```ts
import { handleError } from "bun";

try {
  const data = await validateData();
  // Process data.
} catch (error) {
  const handledError = handleError(error);
  if (handledError) {
    console.error(handledError.message);
  } else {
    console.error(error);
  }
}
```

## WebSocket

Bun includes utilities for handling WebSocket connections:

```ts
import { useWebSockets } from "bun";

const webSocketHandler = useWebSockets();

const server = serve({
  port: 8000,
  async fetch(request) {
    // Handle HTTP request.
  },
  async connect(webSocket) {
    // Handle WebSocket connection.
    webSocket.accept();
    webSocketHandler.open(webSocket);
  },
  async message(webSocket, message) {
    // Handle WebSocket message.
    webSocketHandler.message(webSocket, message);
  },
  async close(webSocket) {
    // Handle WebSocket close.
    webSocketHandler.close(webSocket);
  },
  async error(webSocket, error) {
    // Handle WebSocket error.
    webSocketHandler.error(webSocket, error);
  },
  async drain(webSocket) {
    // Handle WebSocket backpressure drain.
    webSocketHandler.drain(webSocket);
  },
});
```

## License

Bun is licensed under the [MIT License](https://opensource.org/licenses/MIT).