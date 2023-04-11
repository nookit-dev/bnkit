# Fetch Utils

This module provides utility functions for fetching data from APIs.

## Installation

To install Fetch Utils, run the following command:

```
npm install fetch-utils
```

## Usage

### Creating Errors

Fetch Utils provides two custom error classes: `ValidationError` and `APIError`. These can be used to better handle error scenarios when making API requests. To create a `ValidationError`, use the `createValidationError` function. To create an `APIError`, use the `createAPIError` function.

```typescript
import { createValidationError, createAPIError } from 'fetch-utils';

throw createValidationError('Invalid data!');
throw createAPIError('API request failed!');
```

### Fetching Data

The `fetcher` function can be used to fetch data from an API endpoint. The function takes two parameters: the URL of the API endpoint and an options object. The function returns a Promise with the fetched data.

```typescript
import { fetcher } from 'fetch-utils';

const data = await fetcher<MyData>('https://api.example.com/data', {
  method: 'GET',
  headers: {
    Authorization: 'Bearer xyz',
  },
});

console.log(data);
```

If the response from the API is not in the `2xx` range, an `APIError` will be thrown with a message indicating the status code and status text of the response.

```typescript
import { fetcher, APIError } from 'fetch-utils';

try {
  const data = await fetcher<MyData>('https://api.example.com/data', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer xyz',
    },
  });

  console.log(data);
} catch (error: any) {
  if (error instanceof APIError) {
    console.error('API error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```