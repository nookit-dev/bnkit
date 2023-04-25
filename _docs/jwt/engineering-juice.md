## Function List:

### `jwtClient()`
* (no input parameters)
* Returns an object with two functions:
  * `decodeJwt(token: string): { header: object, payload: object }` - Decodes a JWT token and returns an object containing the decoded header and payload.
  * `isJwtExpired(token: string): boolean` - Takes a JWT token and returns a boolean indicating whether the token has expired.

### `jwtServer(secret: string)`
* Takes a secret string as input.
* Returns an object with two functions:
  * `createJwt(payload: object, secret: string, expiresIn?: number): string` - Creates and returns a signed JWT token, using the provided payload, secret, and (optional) expiration time (in seconds).
  * `verifyJwt(token: string, secret: string): { header: object, payload: object }` - Verifies the signature of a JWT token, and returns the decoded header and payload if the signature is valid.