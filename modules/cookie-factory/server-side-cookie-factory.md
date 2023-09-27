# Server-Side Cookie Factory

This module provides utility functions to manage cookies on the server side, allowing you to set, get, delete, and check the existence of cookies in a request and response context.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [API](#api)
4. [Testing](#testing)
5. [Contributing](#contributing)

## Installation

To use this module, ensure you have imported it appropriately:

```typescript
import { createServerCookieFactory } from "./server-side-cookie-factory";
```

## Usage

1. **Initialization**:

   First, you need to initialize the cookie factory:

   ```typescript
   const cookieFactory = createServerCookieFactory();
   ```

2. **Setting a Cookie**:

   ```typescript
   cookieFactory.setCookie(response, "cookieName", "cookieValue", {
     maxAge: 3600,
     path: "/",
     secure: true,
     httpOnly: true,
     sameSite: "Strict"
   });
   ```

3. **Getting a Cookie Value**:

   ```typescript
   const value = cookieFactory.getCookie(request, "cookieName");
   ```

4. **Deleting a Cookie**:

   ```typescript
   cookieFactory.deleteCookie(response, "cookieName");
   ```

5. **Checking if a Cookie Exists**:

   ```typescript
   const exists = cookieFactory.checkCookie(request, "cookieName");
   ```

## API

### `setCookie(res: Response, name: string, value: string, options?: CookieOptions)`

Sets a cookie in the response object with the provided name, value, and optional settings.

### `getCookie(req: Request, name: string)`

Retrieves the value of a cookie with the given name from the request object.

### `deleteCookie(res: Response, name: string)`

Deletes a cookie by setting its `Max-Age` to `-1`.

### `checkCookie(req: Request, name: string)`

Returns a boolean indicating whether a cookie with the given name exists in the request.

### CookieOptions

| Property | Type                                     | Description                                  |
|----------|------------------------------------------|----------------------------------------------|
| maxAge   | number?                                  | The maximum age of the cookie in seconds.    |
| path     | string?                                  | The path for the cookie.                     |
| domain   | string?                                  | The domain for the cookie.                   |
| secure   | boolean?                                 | If `true`, the cookie will be set as secure. |
| httpOnly | boolean?                                 | If `true`, the cookie will be HTTP only.     |
| sameSite | "Strict" \| "Lax" \| "None"?             | The SameSite attribute for the cookie.       |

## Testing

The module comes with a set of tests written using the `bun:test` library. Ensure you have all the dependencies installed and run the tests using the appropriate test runner command.

## Contributing

If you'd like to contribute to this module, please follow the standard contribution guidelines:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes and write tests if necessary.
4. Submit a pull request for review.

---

Feel free to use, modify, and distribute this module as per your needs. Any feedback or contributions are highly appreciated.