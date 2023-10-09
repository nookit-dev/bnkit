# Server-Factory Module - Overview

The Server-Factory module is a critical part of our framework that aids in building HTTP servers seamlessly. This module provides a factory function for creating, configuring, and starting an HTTP server with pre-configured or custom resources.

Key functionalities of this Server-Factory module include but not limited to:

- Initialization of a new server.
- Setting up server routes and middlewares.
- Configuring server options such as hostname, WebSocket handlers, port, verbosity and so on.
- Binding server routes with the respective middlewares for handling incoming requests.

Primary components of the Server-Factory module include:

1. **createServerFactory:** This is the main function in this module. It takes in an object of `CreateServerFactory` type, with properties defining server behavior such as WebSocket paths, body parsing enablement, CORS configuration and maximum file size. By default, it enables the body parser and assigns an empty array to WebSocket paths.

2. **CreateServerFactoryRoute:** This is a type utility that outlines the structure of routes on the server.

3. **createServerRoute:** This is a higher-level function that binds the path, options, and middlewares of a route to a route map - to effectively handle incoming requests.

4. **middle:** This function allows adding new middlewares to the server's middleware list.

5. **start:** This function starts the server. By default, the server hostname is "0.0.0.0", port is 3000, and it logs "websocket msg" for every WebSocket message.

With these, the Server-Factory module provides a neat abstraction over the server creation process, thereby improving code maintainability and readability. The rich functionality it offers makes the server initialization and configuration process a breeze. This module is very helpful for developers to not just easily start servers, but to also add customized functionalities via middlewares and configured routes.


![image](https://github.com/brandon-schabel/u-tools/assets/18100375/23983b87-03b8-4257-bb8e-838fa7fe25b2)
