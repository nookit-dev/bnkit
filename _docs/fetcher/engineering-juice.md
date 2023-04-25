```
## Functions
### createFetcher
- Input: FetchOptions
- Output: Object containing functions `get`, `post`, and `getStatus`
- Creates a fetcher object with a base URL and three functions for making GET, POST, and HEAD requests with error handling.

### get
- Input: string
- Output: Promise<Type>
- Makes a GET request to the specified endpoint and returns the resulting data as a Promise of the specified Type.

### post
- Input: Object with optional endpoint (string), params (any), and headers (Record<string, any>)
- Output: Promise<Type>
- Makes a POST request with the given parameters and headers to the specified endpoint (or base URL if none is provided) and returns the resulting data as a Promise of the specified Type.

### getStatus
- Input: string
- Output: Promise<Type>
- Makes a HEAD request to the specified endpoint and returns the resulting data as a Promise of the specified Type.

### handleResponse
- Input: Response
- Output: Promise<Type>
- Helper function to handle the response from any of the fetch requests. Throws an APIError if the response is not OK (status code < 200 or > 299) or returns the parsed response data as a Promise of the specified Type.
```