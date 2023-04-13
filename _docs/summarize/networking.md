This module exports functions and types for creating a CRUD server and router, as well as a function for creating a fetcher to handle API requests. It also includes a function for creating OpenAI completions and a type for the response. The exports are:

- createFetcher: a function that creates a fetcher to handle API requests
- RouteHandler: a type for a function that handles a route request
- ServerRoute: a type for a server route with a path, method, and handler
- ServerRouter: a type for a server router with addRoute and handleRequest functions
- createRouter: a function that creates a router with addRoute and handleRequest functions
- CrudServer: a type for a CRUD server with start, stop, and router properties
- createCrudServer: a function that creates a CRUD server with a router and port number
- useWebSockets: a function that returns an object with functions for handling WebSocket connections
- CompletionsResponse: a type for the response from OpenAI completions
- createOpenAICompletions: a function that creates an object with a getCompletions function for retrieving OpenAI completions.