### Functions:
#### `createFetcher({ baseUrl }: FetchOptions) => { get, post, getStatus }`
Input: `{ baseUrl: string }`\
Output: `{ get: (endpoint: string) => Promise<Type>, post: ({ endpoint, params, headers }: { endpoint?: string; params?: any; headers?: Record<string, any>; }) => Promise<Type>, getStatus: (endpoint: string) => Promise<Type> }`\
Creates a `fetch` instance with base URL and returns three HTTP methods - `get`, `post`, and `getStatus`.

#### `get<Type>(endpoint: string) => Promise<Type>`
Input: `endpoint: string`\
Output: `Promise<Type>`\
Method to send a GET request to the specified endpoint and return a JSON response of specified type.

#### `post<Type>({ endpoint, params, headers }: { endpoint?: string; params?: any; headers?: Record<string, any>; }) => Promise<Type>`
Input: `{ endpoint?: string; params?: any; headers?: Record<string, any>; }`\
Output: `Promise<Type>`\
Method to send a POST request to the specified endpoint with optional parameters and headers and return a JSON response of specified type.

#### `getStatus<Type>(endpoint: string) => Promise<Type>`
Input: `endpoint: string`\
Output: `Promise<Type>`\
Method to send a HEAD request to the specified endpoint to check status and return the JSON response of specified type.

#### `handleResponse<Type>(response: Response) => Promise<Type>`
Input: `response: Response`\
Output: `Promise<Type>`\
Handles the `fetch` response and throw an error in case of bad response code or returns JSON response of specified type.