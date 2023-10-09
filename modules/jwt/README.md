# JWT Life Cycle

## 1. User Authentication (Server Side)

When a user attempts to log in, they submit their credentials (usually a username and password) to the server. The server then validates these credentials.

```typescript
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Validate the user's credentials...
});
```

## 2. JWT Generation (Server Side)

If the credentials are valid, the server generates a JWT. The payload of this JWT often includes the user's ID and any roles or permissions they have. It also includes an expiration time after which the JWT will be invalid.

In our example, this is done using the `createJwt` function in our `jwtServerSideFactory`.

```typescript
const token = jwtServerSideFactory(secret).createJwt(payload, secret);
```

## 3. Refresh Token Generation (Server Side)

In addition to the JWT, the server also generates a refresh token. This token is stored on the server and associated with the user's account.

```typescript
const refreshToken = jwtServerSideFactory(secret).generateRefreshToken();
```

## 4. Sending Tokens to the Client (Server Side)

The server sends both the JWT and the refresh token to the client. This can be done in the response body, or the refresh token could be set as a secure HttpOnly cookie. 

```typescript
res.json({ token, refreshToken });
```

## 5. Storing the Tokens (Client Side)

The client stores both the JWT and the refresh token. The JWT is often stored in memory or local storage, while the refresh token is typically stored in a secure HttpOnly cookie (if it wasn't already sent as one). 

```typescript
jwtClientSideFactory().setRefreshToken(refreshToken);
```

## 6. Using the JWT (Client Side)

Whenever the client makes a request to a protected server endpoint, it includes the JWT in the `Authorization` header. 

```typescript
fetch('/api/protected', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## 7. Verifying the JWT (Server Side)

The server verifies the JWT. If the token is invalid, the server responds with an error. If the token is valid, the server processes the request. 

```typescript
const { header, payload } = jwtServerSideFactory(secret).verifyJwt(token);
```

## 8. JWT Expiration (Client and Server Side)

Once the JWT expires, any attempts to use it to access protected server endpoints will result in an error. The client can preemptively check if the JWT is expired to handle this smoothly.

```typescript
if (jwtClientSideFactory().isJwtExpired(token)) {
  // Handle token expiration...
}
```

## 9. Refreshing the JWT (Client and Server Side)

When the JWT expires, the client can use the refresh token to request a new JWT from the server. The server verifies the refresh token, generates a new JWT, and sends it to the client.

```typescript
app.post('/api/token', (req, res) => {
  const { refreshToken } = req.body;

  if (!jwtServerSideFactory(secret).validateRefreshToken(refreshToken)) {
    res.status(403).json({ message: 'Invalid refresh token' });
    return;
  }

  const newToken = jwtServerSideFactory(secret).createJwt(/* new payload */, secret);
  res.json({ token: newToken });
});
```

## 10. Blacklisting Tokens (Server Side)

In some cases, it may be necessary to invalidate a JWT before it naturally expires. This is done by adding the JWT to a blacklist on the server. Any attempts to use a blacklisted token will result in an error, even if the token is otherwise valid.

```typescript
jwtServerSideFactory(secret).blacklistToken(token);
```

This concludes the full life cycle of a JWT. The specifics of each step may vary depending on the exact needs of your application, but this should serve as a solid foundation for understanding how JWTs are used for authentication.



# TODO: I need to implement storing JWTs in cookies but I probably need to create a factory to handle cookies
