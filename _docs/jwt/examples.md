## Example Usage of jwtClient

```typescript
import { jwtClient } from './jwt';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const { header, payload } = jwtClient.decodeJwt(token);

console.log(header); // {alg: "HS256", typ: "JWT"}
console.log(payload); // {sub: "1234567890", name: "John Doe", iat: 1516239022}

const isExpired = jwtClient.isJwtExpired(token);

console.log(isExpired); // false
```

## Example Usage of jwtServer

```typescript
import { jwtServer } from './jwt';

const secret = 'secret';

const payload = { 
  id: 123,
  username: 'john_doe'
};

const expiresIn = 60 * 60;

const token = jwtServer.createJwt(payload, secret, expiresIn);

console.log(token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJ1c2VybmFtZSI6ImpvaG5fZG9lIiwiZXhwIjoxNjE1NzQ2OTIzfQ.VPHDbA7dSbdu3qW_oFmKvCm-v9Je4LLtbhgCCW19jK4

const { header, payload } = jwtServer.verifyJwt(token, secret);

console.log(header); // {alg: "HS256", typ: "JWT"}
console.log(payload); // {id: 123, username: "john_doe", exp: 1615746923}

```