## List of Exports

- `createFetcher<Type, ErrorType>()`: A function that creates and returns a fetcher function to handle API requests/responses.
- `RouteHandler`: A type that represents a request handler for a specific route.
- `ServerRoute`: An object that contains information about a specific server route, including its path, method, and handler.
- `ServerRouter`: An interface that defines a router for a server.
- `createRouter(routeConfigs?: ServerRoute[]): ServerRouter`: A function that creates a new ServerRouter instance with optionally provided server route configurations.
- `CrudServer<Schema extends SchemaType>`: A type that represents a CRUD server for a specific schema type.
- `createCrudServer<Schema extends Record<string, keyof TypeMapping>>({ router, port }: { router?: ServerRouter; port?: number; }): CrudServer<Schema>`: A function that creates a new CRUD server instance with optional router and port configurations.
- `useWebSockets(): {...}`: A function that returns an object containing callback functions for handling WebSocket events.
- `CompletionChoice`: A type that represents a completion choice object returned by the OpenAI API.
- `CompletionsResponse`: A type that represents the response object returned by the OpenAI API for generating completions.
- `BaseOpenAICompletionsParams`: An interface that defines the parameters for requesting completions from the OpenAI API.
- `createOpenAICompletions<Type>({ apiKey }: { apiKey: string }): {...}`: A function that creates an OpenAI completions instance with a provided API key and returns an object containing methods for requesting completions from the OpenAI API.

## Key Features

- Provides functions and types for handling and validating API requests/responses.
- Allows for creating and configuring a router for handling server requests.
- Enables the creation of CRUD servers for specific schema types.
- Offers a set of callback functions for handling WebSocket events.
- Provides methods for generating completions using the OpenAI API.