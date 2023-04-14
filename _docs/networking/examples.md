# Examples of Using the CRUD Server Module

## Creating a Server

To create a CRUD server, first import the `createCrudServer` method from the module:

```javascript
import { createCrudServer } from "./crud-server";
```

Then, call the method with optional parameters:

```javascript
const server = createCrudServer({
  router,
  port: 4000,
});
```

Here, the `router` parameter is an optional `ServerRouter` object that you can use to handle requests for frontend pages. The `port` parameter sets the port number for the server. If not provided, it defaults to 4000.

## Adding Routes

To add routes to the server, you can call the `addRoute` method on the `ServerRouter` object. For example:

```javascript
const router = createRouter();

router.addRoute("/", "GET", (req: Request) => {
  return new Response("Hello, world!");
});
```

Here, a route is added to handle GET requests to the root URL path. The handler function returns a new Response object with a "Hello, world!" message.

## Handling Requests

To handle requests, call the `handleRequest` method on the `ServerRouter` object or provide a fetch method to the `serve()` function. For example:

```javascript
const server = serve({
  port: port ? `:${port}` : ":4000",
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    try {
      if (url.pathname.startsWith("/api")) {
        // Handle API routes
      } else {
        // Handle frontend pages
        const handler = router && router[url.pathname];
        if (handler) {
          const response = await handler(req);
          return response;
        }
      }
    } catch (error) {
      // Handle errors
    }

    return new Response("Not found", { status: 404 });
  },
});
```

Here, the `fetch` method is provided to the `serve()` function to handle all incoming requests. If the request URL path starts with "/api", API routes are handled. Otherwise, router handlers are used to handle frontend pages. If an error occurs, it is handled according to the `handleError` method provided by the module.

## Creating OpenAI Completions

To create OpenAI completions, first import the `createOpenAICompletions` method from the module:

```javascript
import createOpenAICompletions from "./crud-server";
```

Then, call the method with an `apiKey` parameter and use the returned object to get completions:

```javascript
const openai = createOpenAICompletions<{ choices: CompletionChoice[] }>({
  apiKey: "your-api-key-here",
});

const completions = await openai.getCompletions({
  prompt: "What is the meaning of life?",
  maxTokens: 50,
  numCompletions: 1,
});
```

Here, the `getCompletions` method is called with a prompt and optional parameters for `maxTokens` and `numCompletions`. The method returns an array of `CompletionChoice` objects with the completed text. The `apiKey` parameter is required to authenticate with the OpenAI API.