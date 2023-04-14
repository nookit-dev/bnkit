## Module `bun`

### Exports
- `Server`: A class for creating and running a web server.
- `ServerWebSocket`: A class for handling WebSocket connections.
- `serve`: A function that creates a new server instance.

## Module `error-handler-validation`

### Exports
- `handleError`: A function for handling and validating errors.

## Module `types`

### Types
- `SchemaType`: An interface for defining a schema.
- `TypeMapping`: A mapping of data types to TypeScript types.

## Module `crud-server`

### Types
- `CrudServer`: An interface for defining a CRUD server.
- `ServerRoute`: An interface for defining a server route.
- `ServerRouter`: An interface for defining a server router.
- `CompletionsResponse`: An interface for defining a response from the OpenAI completions API.

### Functions
- `createFetcher<Type, ErrorType>()`: A function for creating a fetcher function that handles errors.
- `createRouter(routeConfigs?: ServerRoute[]): ServerRouter`: A function for creating a new server router instance.
- `createCrudServer<Schema extends Record<string, keyof TypeMapping>>({ router, port }: { router?: ServerRouter; port?: number }): CrudServer<Schema>`: A function for creating a new CRUD server instance.
- `useWebSockets(): Record<string, Function>`: A function that returns an object containing callback functions for WebSocket events.

## Module `openai-completions`

### Types
- `BaseOpenAICompletionsParams`: An interface for defining the parameters of a request to the OpenAI completions API.

### Functions
- `createOpenAICompletions<Type>({ apiKey }: { apiKey: string }): { getCompletions(params: BaseOpenAICompletionsParams): Promise<Type> }`: A function for creating a new instance of the OpenAI completions API client.