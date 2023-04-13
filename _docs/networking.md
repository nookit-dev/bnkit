## Using the `createCrudServer()` function

To create a CRUD server with default options:

```typescript
import { createCrudServer } from "./crud-server";

const server = createCrudServer({});
server.start();
```

To create a CRUD server with custom options:

```typescript
import { createCrudServer } from "./crud-server";

const router = createRouter();
router.addRoute("/", "GET", () => new Response("Hello World!"));

const server = createCrudServer({ router, port: 3000 });
server.start();
```

## Using the `createOpenAICompletions()` function

To create an OpenAI completions instance and get completions:

```typescript
import createOpenAICompletions from "./openai";

const openAI = createOpenAICompletions({ apiKey: "YOUR_OPENAI_API_KEY" });

const completions = await openAI.getCompletions({
  prompt: "Hello, my name is",
  maxTokens: 10,
  numCompletions: 1,
});

console.log(completions); // [{ message: { role: "bot", text: " John." }, index: 0, finish_reason: "stop" }]
```