## Module: `bun`

### Exports:
- `Server`: a class representing a web server that can be started and stopped
- `ServerWebSocket`: a class representing a WebSocket connection on the server side
- `serve`: a function that creates a new `Server` instance and starts it

### Functions:
- `createFetcher<Type, ErrorType>()`: creates a function that can be used to make HTTP requests with error handling
- `createRouter(routeConfigs?: ServerRoute[]): ServerRouter`: creates a router for handling HTTP requests
- `createCrudServer<Schema>()`: creates a CRUD server with API routes for create, read, update, and delete operations
- `useWebSockets()`: returns a set of functions for handling WebSocket connections

### Types:
- `SchemaType`: a type representing the schema of a database
- `TypeMapping`: a type mapping from schema keys to value types
- `RouteHandler`: a function that handles a HTTP request and returns a response
- `ServerRoute`: an object representing a route on the server with a path, HTTP method, and route handler function
- `ServerRouter`: an object representing a router on the server with functions for adding routes and handling requests
- `CrudServer<Schema>`: an object representing a CRUD server with functions for starting and stopping the server and a router for handling HTTP requests

### Interfaces:
- `CompletionChoice`: an interface representing a possible completion for OpenAI's GPT-3 model
- `CompletionsResponse`: an interface representing the response from the OpenAI GPT-3 completions API

### Usage:
This module provides several useful functions and types for creating web servers and handling HTTP requests and WebSocket connections. The `createFetcher` function can be used to create a function that can make HTTP requests with error handling, while the `createRouter` function can be used to create a router that can handle HTTP requests based on their path and HTTP method. The `createCrudServer` function can be used to create a full-featured CRUD server with API routes for create, read, update, and delete operations.

In addition, the `useWebSockets` function returns a set of functions for handling WebSocket connections. OpenAI's GPT-3 model is also supported through a set of interfaces and a function for creating completions with the model.