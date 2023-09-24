# README for create-client-side-cookie-factory.ts

## Overview

`create-client-side-cookie-factory.ts` is a TypeScript module designed to provide utilities for managing cookies on the client side. This factory provides methods to set, get, delete, and check the presence of cookies.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Testing](#testing)
- [License](#license)

## Installation

To integrate this module into your project:

1. Copy the `create-client-side-cookie-factory.ts` file to your source directory.
2. Import the module using the appropriate import syntax.

```typescript
import { createClientCookieFactory } from "./path-to/create-client-side-cookie-factory";
```

## Usage

First, create an instance of the cookie factory:

```typescript
const cookieFactory = createClientCookieFactory();
```

Then, use the methods provided by the factory to manipulate cookies.

## API

### `setCookie(name: string, value: string, options: CookieOptions = {})`

- **name**: Name of the cookie.
- **value**: Value of the cookie.
- **options** (optional): Configuration object that supports:
  - `maxAge`: Number specifying the max age in seconds.
  - `path`: Path for which the cookie is valid.
  - `domain`: Domain for which the cookie is valid.
  - `secure`: Boolean indicating whether the cookie is sent only over HTTPS.
  - `httpOnly`: Boolean indicating whether the cookie is accessible only by the web server.

### `getCookie(name: string)`

- **name**: Name of the cookie.
- Returns the value of the specified cookie or null if not found.

### `deleteCookie(name: string)`

- **name**: Name of the cookie.
- Deletes the specified cookie by setting its max age to -1.

### `checkCookie(name: string)`

- **name**: Name of the cookie.
- Returns `true` if the cookie exists and `false` otherwise.

## Testing

The testing file provides a mock for the document object and tests the functionality of each method provided by the cookie factory.

## License

This module is released under the [MIT License](https://opensource.org/licenses/MIT).

---

This README provides a basic overview of the module's functionality, usage, and testing. Modify as needed based on your project's specific requirements and conventions.
