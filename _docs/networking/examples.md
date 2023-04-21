# Example Usage of `createCrudServer`

```typescript
import { createRouter, createCrudServer, ServerRoute } from "./crud-server";

// Define API route handlers
const createHandler = (req: Request) => new Response("Create handler reached");
const readHandler = (req: Request) => new Response("Read handler reached");
const updateHandler = (req: Request) => new Response("Update handler reached");
const deleteHandler = (req: Request) => new Response("Delete handler reached");

// Create server routes
const routes: ServerRoute[] = [
  { path: "/api/create", method: "POST", handler: createHandler },
  { path: "/api/read", method: "GET", handler: readHandler },
  { path: "/api/update", method: "PUT", handler: updateHandler },
  { path: "/api/delete", method: "DELETE", handler: deleteHandler },
];

// Create router and server
const router = createRouter(routes);
const server = createCrudServer({ router, port: 8000 });

// Start server
server.start();
```

# Example Usage of `createOpenAICompletions`

```typescript
import createOpenAICompletions from "./openai-completions";

// Set up OpenAI Completions API client
const openAI = createOpenAICompletions({ apiKey: "your-api-key-here" });

// Call getCompletions method
openAI.getCompletions({ prompt: "What is the meaning of life?" }).then(
  (completions) => console.log(completions),
  (error) => console.error(error)
);
```