This file exports a function `createFetcher` that returns an object containing functions to make HTTP requests. It depends on the `handleError` function from the `error-handler-validation` module.

Features:
- `get<Type>(endpoint: string): Promise<Type>`: makes a GET request to the specified endpoint and returns the response as a Promise of the specified type.
- `post<Type>({ endpoint, params, headers }): Promise<Type>`: makes a POST request with the specified endpoint, params, and headers and returns the response as a Promise of the specified type.
- `getStatus<Type>(endpoint: string): Promise<Type>`: makes a HEAD request to the specified endpoint and returns the response status as a Promise of the specified type.

Technical description:
The `createFetcher` function takes a `FetchOptions` object with a `baseUrl` string property and returns an object with three functions (`get`, `post`, and `getStatus`). Each function makes an HTTP request using the `fetch` API and returns a Promise that resolves with the deserialized response data of the specified type. The `handleResponse` function is used to handle the response returned by `fetch`, throwing an error if the status code is not in the 200 range. `handleError` is used to create an error object with the API error type and status text message.