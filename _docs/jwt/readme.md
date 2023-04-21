# JWT Util Module

This is a module for encoding, decoding, signing, and verifying JSON Web Tokens (JWTs) in Node.js applications.

## Installation

To install this module, use the following command:

```
npm install --save jwt-util
```

## Usage

### Client-Side

#### `decodeJwt(token: string)`

This function decodes a JWT string and returns an object containing the decoded header and payload.

**Arguments:**

- `token` (string): The JWT string to decode.

**Returns:**

An object with the following properties:

- `header` (object): The decoded header object.
- `payload` (object): The decoded payload object.

#### `isJwtExpired(token: string)`

This function checks whether a JWT has expired.

**Arguments:**

- `token` (string): The JWT string to check.

**Returns:**

A boolean indicating whether the JWT has expired.

### Server-Side

#### `createJwt(payload: JwtPayload, secret: string, expiresIn?: number)`

This function creates a new JWT string.

**Arguments:**

- `payload` (object): The payload object to include in the JWT.
- `secret` (string): The secret key to sign the JWT with.
- `expiresIn` (number, optional): The expiration time of the JWT, in seconds. Default is 3600 (1 hour).

**Returns:**

The JWT string.

#### `verifyJwt(token: string, secret: string)`

This function verifies the signature and expiration time of a JWT.

**Arguments:**

- `token` (string): The JWT string to verify.
- `secret` (string): The secret key to verify the JWT with.

**Returns:**

An object with the following properties:

- `header` (object): The decoded header object.
- `payload` (object): The decoded payload object.

**Throws:**

- `"Invalid signature"`: If the JWT signature is invalid.
- `"Token expired"`: If the JWT has expired.

## License

This module is licensed under the MIT License. See the `LICENSE` file for more information.