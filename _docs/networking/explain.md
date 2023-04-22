# Module Explanation

This module defines a `CrudServer` that handles CRUD operations for a given schema. It uses a `ServerRouter` to handle incoming requests, and can also handle WebSocket connections. It also includes a function to interact with the OpenAI completions API.

## Dependencies

The module depends on the following modules:
- `"bun"` - for server functionality and WebSocket support
- `"fetcher"` - for making HTTP requests to the OpenAI API
- `"./error-handler-validation"` and `"./types"` - for handling and validating errors and data types

## Features

- `createRouter`: creates a `ServerRouter` that can handle incoming requests based on predefined routes
- `createCrudServer`: creates a `CrudServer` that handles CRUD operations for a given schema, using a `ServerRouter` to handle incoming requests and WebSocket connections
- `useWebSockets`: returns an object containing functions to handle WebSocket connections
- `createOpenAICompletions`: a function that interacts with the OpenAI GPT-3 completions API, returning completions based on the given input prompt.

## Technical Description

The `createRouter` function creates a `ServerRouter` object that can add and handle custom routes. It keeps track of an array of `ServerRoute` objects, each defining a path, method, and handler function.

The `createCrudServer` function creates a `CrudServer` object that starts a server and listens for incoming requests. It uses a `ServerRouter` to handle incoming requests, comparing the requested path and method to defined routes. It also includes functions to handle WebSocket connections.

The `useWebSockets` function returns an object containing functions to handle WebSocket connections including `open`, `message`, `close`, `error`, and `drain`.

The `createOpenAICompletions` function creates an object that interacts with the OpenAI GPT-3 completions API. It contains a function `getCompletions` that receives a prompt and returns completions based on the input prompt. It uses the `fetcher` module to make HTTP requests to the API.