# JSON Web Token (JWT) Library

This is a simple library for encoding and decoding JSON Web Tokens (JWTs).

## Usage

### Client-side

To use this library on the client-side (i.e. in the browser), you can import it as follows:

```
import { jwtClient } from "jwt-library";
```

You can then use the `decodeJwt` and `isJwtExpired` functions to decode and verify JWTs:

```
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

jwtClient().isJwtExpired(token); // returns false
jwtClient().decodeJwt(token);   // returns { header: { alg: "HS256", typ: "JWT" }, payload: { sub: "1234567890", name: "John Doe", iat: 1516239022 } }
```

### Server-side

To use this library on the server-side (i.e. in Node.js), you can import it as follows:

```
import { jwtServer } from "jwt-library";
```

You can then use the `createJwt` and `verifyJwt` functions to create and verify JWTs:

```
const secret = "my-secret-key";

const payload = { sub: "1234567890", name: "John Doe" };
const expiresIn = 60 * 60; // 1 hour

const token = jwtServer(secret).createJwt(payload, secret, expiresIn);

jwtServer(secret).verifyJwt(token, secret); // returns { header: { alg: "HS256", typ: "JWT" }, payload: { sub: "1234567890", name: "John Doe", iat: 1516239022, exp: 1516242622 } }
```

## API

### `jwtClient`

#### `decodeJwt(token: string): { header: object, payload: object }`

This function decodes a JWT and returns its header and payload as objects.

#### `isJwtExpired(token: string): boolean`

This function checks if a JWT has expired and returns a boolean.

### `jwtServer(secret: string)`

#### `createJwt(payload: object, secret: string, expiresIn: number = 3600): string`

This function creates a JWT with the given payload and secret. The `expiresIn` parameter is optional and specifies the number of seconds until the token expires (default: 1 hour).

#### `verifyJwt(token: string, secret: string): { header: object, payload: object }`

This function verifies a JWT and returns its header and payload as objects. If the token is invalid or has expired, an error is thrown.