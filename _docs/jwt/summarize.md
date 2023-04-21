This module provides functions for decoding, encoding, signing, and verifying JSON Web Tokens (JWTs), as well as checking if a JWT has expired. The `jwtClient` function returns an object with a `decodeJwt` function and an `isJwtExpired` function, while the `jwtServer` function takes a secret string and returns an object with a `createJwt` function and a `verifyJwt` function.

Exports:

- `jwtClient(): { decodeJwt: (token: string) => { header: JwtHeader; payload: JwtPayload; }; isJwtExpired: (token: string) => boolean; }`
- `jwtServer(secret: string): { createJwt: (payload: JwtPayload, secret: string, expiresIn?: number) => string; verifyJwt: (token: string, secret: string) => { header: JwtHeader; payload: JwtPayload; }; }`
- `JwtHeader: interface { alg: string; typ: string; }`
- `JwtPayload: interface { exp?: number; [key: string]: any; }`