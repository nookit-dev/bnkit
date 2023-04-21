# Module Explanation: `crud-server`

## Dependent Modules
- `bun`
- `fetcher`

## Features
- `createRouter`: creates a router that can handle HTTP requests for different paths and methods
- `ServerRouter`: a type for the router object that has two methods: `addRoute` to add new routes, and `handleRequest` to handle incoming HTTP requests
- `createCrudServer`: a factory function that creates a Server object with CRUD (Create, Read, Update, Delete) functionality for a given schema
- `CrudServer`: a type for the Server object returned by `createCrudServer`, which has three methods: `start` to start the server, `stop` to stop the server, and `router` to access the router object used by the server
- `useWebSockets`: a function that returns an object with callback functions to handle WebSocket connections

## Technical Description
The `crud-server` module provides a set of helper functions and types for building a CRUD server. It utilizes the `createRouter` function to handle incoming HTTP requests for Create, Read, Update, and Delete operations, and `createCrudServer` to create a Server object with the CRUD functionality for a given schema. 

The `useWebSockets` function provides a set of callback functions for handling WebSocket connections, and the `createOpenAICompletions` function creates an API client for the OpenAI Completions API.

Overall, this module provides a convenient and powerful toolkit for building CRUD servers in a scalable and modular way.