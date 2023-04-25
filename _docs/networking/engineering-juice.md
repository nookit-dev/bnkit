Function List:

- createRouter(routeConfigs?: ServerRoute[]): ServerRouter
  - Input: routeConfigs, an optional array of ServerRoute objects
  - Output: ServerRouter, an object with addRoute and handleRequest functions
  - Description: Creates a router object for handling HTTP request routing

- createCrudServer<Schema extends Record<string, keyof TypeMapping>>({ router, port }: { router?: ServerRouter; port?: number; }): CrudServer<Schema> 
  - Input: router, an optional ServerRouter object, and port, an optional number
  - Output: CrudServer, an object with start, stop, and router properties
  - Description: Creates a server to handle CRUD operations

- useWebSockets(): Object
  - Input: None
  - Output: Object, an object with open, message, close, error, and drain functions
  - Description: Sets up WebSocket communication with the server

- createOpenAICompletions({ apiKey }: { apiKey: string }): Object
  - Input: apiKey, a string representing the OpenAI API key
  - Output: Object, an object with a getCompletions function
  - Description: Creates a fetcher function for retrieving completion data from the OpenAI API.