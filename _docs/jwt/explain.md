# Module Explanation

This module exports two functions, `jwtClient` and `jwtServer`, for encoding and decoding JSON web tokens (JWTs). 

## Dependencies

The module imports the `crypto` module from Node.js, which is used for generating HMAC digests.

## Features

The `jwtClient` function exports two methods: `decodeJwt` and `isJwtExpired`.

`decodeJwt` takes a JWT as a string and decodes its header and payload components. It returns an object with `header` and `payload` keys.

`isJwtExpired` takes a JWT as a string and checks if its expiry time has passed. It returns a boolean value.

The `jwtServer` function exports two methods: `createJwt` and `verifyJwt`.

`createJwt` takes the payload data as an object, a secret string for signing the token, and an optional expiry time in seconds. It returns a JWT as a string.

`verifyJwt` takes a JWT as a string and a secret string. It checks the integrity of the signature on the token and returns the token's header and payload as an object if successful. Otherwise, it raises an error.

## Technical Description

The module uses the `Buffer` class from Node.js to encode and decode base64 strings. It defines two functions, `base64UrlEncode` and `base64UrlDecode`, for encoding and decoding strings with characters that are URL-safe.

The `sign` function takes a string and a secret and computes an HMAC digest using the SHA-256 algorithm. It returns the digest as a base64-encoded string.

The `createJwt` function constructs a header object with an algorithm (`HS256`) and a type (`JWT`). It encodes the header and payload objects as base64 strings, concatenates them with a period (`.`) separator, and signs the resulting string with the `sign` function. It then encodes the signature as a base64 string and returns the concatenated string as a JWT.

The `verifyJwt` function first extracts the header, payload, and signature components from the input JWT. It then computes the signature of the header and payload components using the `sign` function and compares it to the decoded signature. If they match, it parses and returns the header and payload objects. Otherwise, it raises an error.