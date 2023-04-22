The module contains the following functions:

- createRouter(routeConfigs?: ServerRoute[]): ServerRouter
  - Inputs: optional array of ServerRoute objects
  - Output: ServerRouter object
  - Creates a router object that can add routes and handle requests based on the routes.

- createCrudServer<Schema extends Record<string, keyof TypeMapping>>({ router, port }: { router?: ServerRouter; port?: number; }): CrudServer<Schema>
  - Inputs: optional ServerRouter object and port number
  - Output: CrudServer object
  - Creates a server that can handle CRUD operations and optional routing. 

- useWebSockets()
  - Inputs: none
  - Output: an object with WebSocket event handlers
  - Returns an object containing WebSocket event handlers such as open, message, close, error, and drain. 

- createOpenAICompletions({ apiKey }: { apiKey: string })
  - Inputs: an API key string
  - Output: an object with a function to fetch OpenAI completions
  - Returns an object containing a function to retrieve OpenAI text completions given a prompt.