## Module: `fetcher.ts`

### Dependencies:
- `error-handler-validation`

### Features:
- `createFetcher` function which returns an object with 3 functions:
  - `get<Type>(endpoint: string): Promise<Type>`
  - `post<Type>({ endpoint, params, headers }): Promise<Type>`
  - `getStatus<Type>(endpoint: string): Promise<Type>`
- `handleResponse<Type>(response: Response): Promise<Type>` function which handles the response received from `fetch()` and either returns the parsed JSON response or throws an error using the `handleError` function from the `error-handler-validation` module.

### Description:
This module exports a `createFetcher` function which can be used to create an object containing three functions for making HTTP requests: `get`, `post`, and `getStatus`. Each function takes in an endpoint (a string representing the path to the resource), and the `post` function also accepts an optional `params` and `headers`. The `createFetcher` function takes one argument, an object with a `baseUrl` string defining the URL to prepend to the endpoint strings. 

The `handleResponse` function is used internally to handle and parse the response object received from the `fetch()` call. If the response is not OK, it throws an error using the `handleError` function from the `error-handler-validation` module.

Overall, this module provides a flexible and reusable way to make HTTP requests using the `fetch()` API.