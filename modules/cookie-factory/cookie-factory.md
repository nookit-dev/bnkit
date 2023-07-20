## Client-Side:

1. **Set Cookie:** A method that accepts a cookie name, value, and optional settings (like max-age, path, domain, secure, and http-only) as parameters and sets the cookie on the client.

2. **Get Cookie:** A method that accepts a cookie name as a parameter and retrieves its value from the client.

3. **Delete Cookie:** A method that accepts a cookie name as a parameter and removes it from the client.

4. **Check Cookie:** A method that accepts a cookie name as a parameter and checks if the cookie exists on the client.

## Server-Side:

1. **Set Cookie:** A similar method to the client-side's set cookie method but sets the cookie on the server response. This will require access to the response object from the server.

2. **Get Cookie:** A method that accepts a cookie name as a parameter and retrieves its value from the server request. This will require access to the request object from the server.

3. **Delete Cookie:** A similar method to the client-side's delete cookie method but deletes the cookie on the server. This will require access to the response object from the server.

4. **Check Cookie:** A method that accepts a cookie name as a parameter and checks if the cookie exists on the server request. This will require access to the request object from the server.

Here's a brief overview of how the code for these might look:

```typescript
export const cookieFactory = () => {
  // Client-side methods.
  const setCookieClient = (name: string, value: string, options?: CookieOptions) => { ... };
  const getCookieClient = (name: string) => { ... };
  const deleteCookieClient = (name: string) => { ... };
  const checkCookieClient = (name: string) => { ... };
  
  // Server-side methods.
  const setCookieServer = (res: Response, name: string, value: string, options?: CookieOptions) => { ... };
  const getCookieServer = (req: Request, name: string) => { ... };
  const deleteCookieServer = (res: Response, name: string) => { ... };
  const checkCookieServer = (req: Request, name: string) => { ... };

  return {
    setCookieClient,
    getCookieClient,
    deleteCookieClient,
    checkCookieClient,
    setCookieServer,
    getCookieServer,
    deleteCookieServer,
    checkCookieServer,
  };
};

// Cookie options type for TypeScript.
type CookieOptions = {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
};
```

Remember to replace the `{ ... }` with the actual logic of each function. For client-side methods, you'll be manipulating `document.cookie`. For server-side methods, you'll be manipulating the `req.cookies` and `res.cookie` objects (assuming Express.js or similar server framework). 

Please note that on the server side, you need to ensure you have middleware in place to handle cookies. In Express.js, for example, this would be the `cookie-parser` middleware. 

For the server-side `setCookieServer` and `deleteCookieServer` methods, you will need to provide the `res` (response) object as an argument to the function. This is because these methods need to modify the HTTP response headers to set or delete cookies. For `getCookieServer` and `checkCookieServer`, you will need to provide the `req` (request) object to access the cookies sent by the client in the HTTP request headers.

Keep in mind, while storing JWTs in cookies, it's good practice to set the `httpOnly` flag to prevent client-side JavaScript from accessing the cookie. This helps mitigate certain types of cross-site scripting (XSS) attacks.