# Fetcher module

This module provides a simple way to create a fetcher object that can be used to perform HTTP requests.

## Installation

To install, run:

```
npm install @your-organization/fetcher
```

## Usage

### Step 1: Import the module

```javascript
import { createFetcher } from "@your-organization/fetcher";
```

### Step 2: Create a fetcher object

```javascript
const fetcher = createFetcher({ baseUrl: "https://api.example.com" });
```

### Step 3: Use the fetcher object to perform HTTP requests

The fetcher object has three methods: `get`, `post`, and `getStatus`. These methods correspond to HTTP GET, POST, and HEAD requests, respectively.

```javascript
try {
  const data = await fetcher.get<{ foo: string }>("/data");
  console.log(data.foo);
} catch (error) {
  console.error(error);
}

try {
  const response = await fetcher.post<{ bar: number }>({
    endpoint: "/submit",
    params: { baz: "qux" },
    headers: { Authorization: "Bearer TOKEN" },
  });
  console.log(response.bar);
} catch (error) {
  console.error(error);
}

try {
  const status = await fetcher.getStatus<{ online: boolean }>("/health");
  console.log(status.online ? "API is online" : "API is offline");
} catch (error) {
  console.error(error);
}
```

The `get` and `post` methods expect a generic type parameter that specifies the shape of the response data. The `getStatus` method returns a boolean value.

If the HTTP response status is not `200 OK`, the `handleResponse` function will throw an `APIError` with the corresponding status text. You can use the `handleError` function from the `error-handler-validation` module to format the error message.