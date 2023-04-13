# Bun Server Utils

A collection of utilities for building servers with [Bun](https://github.com/ninpeng/bun).

## Installation

```
npm install @openai/bun-server-utils
```

## Usage

### Fetcher

The `createFetcher` function provides a simple utility for making API requests and handling errors, including validation errors.

```typescript
import { createFetcher } from "@openai/bun-server-utils";

type Post = {
  title: string;
  body: string;
};

const fetchPosts = createFetcher<Post[]>();

// Usage:
const posts = await fetchPosts("https://jsonplaceholder.typicode.com/posts", {
  method: "GET",
});
```

### Router

The `createRouter` function provides a basic router implementation for handling HTTP requests.

```typescript
import { createRouter } from "@openai/bun-server-utils";

const router = createRouter();

router.addRoute("/test", "GET", (req) => {
  return new Response("Test route", { status: 200 });
});

// Usage:
const response = router.handleRequest(new Request("/test"));
```

### CRUD Server

The `createCrudServer` function builds a basic CRUD server with API and router functionality.

```typescript
import { createCrudServer } from "@openai/bun-server-utils";

type UserSchema = {
  id: number;
  name: string;
  email: string;
};

const crudServer = createCrudServer<UserSchema>({
  id: "number",
  name: "string",
  email: "string",
});

crudServer.router["/api/users/create"] = async (req) => {
  const user = (await req.json()) as UserSchema;
  // TODO: Add create logic
  return new Response("Created", { status: 201 });
};

// Usage:
const server = crudServer.start();
```

### OpenAI Completions

The `createOpenAICompletions` function provides a simple utility for interacting with the OpenAI Completions API.

```typescript
import { createOpenAICompletions } from "@openai/bun-server-utils";

const openaiCompletions = createOpenAICompletions<{ message: string }>({
  apiKey: "MY_API_KEY",
});

// Usage:
const completions = await openaiCompletions.getCompletions({
  prompt: "Hello, my name is",
  numCompletions: 5,
  maxTokens: 25,
});
```