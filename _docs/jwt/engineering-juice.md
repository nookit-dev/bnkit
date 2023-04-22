## Functions

### `jwtClient()`

**Input**: None

**Output**: Object with methods `decodeJwt()` and `isJwtExpired()`

### `decodeJwt(token: string)`

**Input**: A JWT token string

**Output**: An object with the parsed header and payload sections of the JWT token

### `isJwtExpired(token: string)`

**Input**: A JWT token string

**Output**: Boolean, `true` if the token is expired, else `false`

### `jwtServer(secret: string)`

**Input**: A secret string used for signing JWT tokens

**Output**: Object with methods `createJwt()` and `verifyJwt()`

### `createJwt(payload: JwtPayload, secret: string, expiresIn: number = 60 * 60)`

**Input**: An object containing the payload to be included in the JWT, the secret used to sign the JWT, and an optional expiration time (default 1 hour)

**Output**: A JWT token string

### `verifyJwt(token: string, secret: string)`

**Input**: A JWT token string and the secret used to sign the token

**Output**: Object with the parsed header and payload sections of the JWT token if token is valid, otherwise throws an error