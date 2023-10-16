# Bun Nook Kit (BNK)

![Bun Nook Kit Logo](https://user-images.githubusercontent.com/18100375/231109092-34bdc552-dd37-413d-8eec-b9b668340b65.png)

## Getting Started

1. Install Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

2. Initialize a new Bun project:

```bash
mkdir playground && cd playground
bun init 
```

3. Install Bun Nook Kit:

```bash
bun add @bnk/core
```

4. Use Bun Nook Kit modules - server example with json response

`index.ts`

```typescript
import * as u from "@bnk/core";

const { start, route } = u.server.serverFactory({});

// on base request to "/"
const baseReq = route("/");
const jsonReq = route("/json")

baseReq(() => new Response("Hello, world!"));

jsonReq(() => u.server.jsonRes({
    message: "Hello world!"
  })
)

// start on default port 3000
start()
```

```bash
bun run index.ts
```

Visit `http://localhost:3000` in your browser and you should see Hello world and
`http://localhost:3000/json` for the json

## Key Highlights

- **Zero Dependencies**
- **Unit Tested**
- **Modular**

## Bun Nook Kit Goals

The ultimate goal is to provide a complete toolkit for quickly developing, configuring, and deploying full stack web apps with a single dependency.

- **Simple**: Designed to integrate seamlessly into any project, regardless of size or requirements, ensuring utility for individual developers and larger teams alike.

- **Modularity**: Each module generallys operates independently - few modules have shared functionality, allowing selection based on project necessity, minimizing bloat and maximizing efficiency. For client side - import what you need, for server you have the option of loading the entire package.

- **Plugable**: Easily create wrappers for different use cases for example the React plugin uses the cookie module to handle cookies with React.

## Features

Bun Nook Kit offers a wide array of utility modules including:

1. CLI: The CLI module aims to provide a simple way to build a basic command-line interface for tasks such as project scaffolding or generating configurations. It helps you handle command-line input, parse arguments, and interact with the file system.

2. Cookie: The Cookie module provides utilities for handling cookies on both the client-side and server-side. It allows you to set, get, and delete cookies, as well as manage cookie options such as expiration and domain.

3. Data Gen: The Data Gen module is a simple data generator that allows you to create mock data for testing purposes. While it may not replace more robust data generation tools, it provides a quick and easy way to generate sample data.

4. Deploy: The Deploy module provides utilities for deployment, with a focus on GitHub Actions integration. It helps you automate the deployment process for your Bun Nook Kit package.

5. Fetcher: The Fetcher module enhances the standard fetch function provided by Bun. It allows you to configure an entire API and provides a TypeScript interface for easy integration with your project. The Fetcher module helps you make HTTP requests and handles data fetching and updating.

6. Files Folder: The Files Folder module provides various utilities for working with files and folders. It includes functions for searching for files, validating file paths, and creating references to files. This module can be useful for tasks like building an in-browser file manager.

7. Hash: The Hash module provides a simple abstraction to Bun's hashing functions. It allows you to hash data using common hashing algorithms for tasks such as password hashing or data integrity checks.

8. JWT: The JWT module provides utilities for working with JSON Web Tokens. It allows you to encode and decode JWTs and provides features like token invalidation.

9. Logger: The Logger module aims to provide a full-featured logging system for your application. While it is still under development and might be limited in functionality, it can be a useful tool for debugging and error tracking.

10. NPM Release: The NPM Release module provides utilities for managing NPM packages. It allows you to update the package version, retrieve the package version, and set up npm authentication. This module can be used in conjunction with the Deploy module for publishing NPM packages.

11. Server: The Server module is one of the most complex modules in Bun Nook Kit. It helps you set up an HTTP server with various middleware options. It simplifies tasks like handling CORS and provides a TypeScript interface for type-safe request handlers. The goal is to provide seamless type safety integration with the Fetcher module.

12. SQLite: The SQLite module builds on top of Bun's SQLite implementation and provides utilities for working with SQLite databases. It includes functions for instantiating databases, creating type-safe schemas, and performing database operations.

13. State Management: The State Management module provides an interface for building type-safe state managers. It offers an immutable state management approach and includes dispatcher functions for easy data manipulation. The module also provides a WebSocket state manager for syncing data between the client and server.

14. Utils: This isn't really a module :) - it does contains various utility functions that can be used across different modules. It includes functions like classy for generating class names, normalizeBytes for converting byte numbers to formatted text, and value checkers for inferring data types.

15. UUID: Generate timestamp encoded UUIDs with UUIDv7 spec implemented

```typescript
import * as u from '@bnk/core'

const uuid = u.uuid.v7()

console.log(uuid)
```

1. Validation: The Validation module aims to provide a comprehensive suite of validation functions. It includes functions for checking the validity of API data and can be used to ensure data integrity and accuracy.

2. WebRTC: The WebRTC module aims to provide an interface for setting up WebRTC connections between clients. While integration with the server module is planned, the module can currently be used for establishing peer-to-peer connections between clients.

## Plugins

Currently Bun Nook Kit has a React plugin, as well as a hook called `useServerState` for connecting to a Bun Nook Kit websocket server state, a `useLocalStorage` hook, and a `useClipboard` hook.

## Architecture

Bun Nook Kit is built upon a robust and flexible architecture using factory functions, taking full advantage of their benefits to offer a streamlined, efficient, and versatile toolkit for your development needs.

- **Encapsulation**: Bun Nook Kit employs factory functions to streamline object creation, concealing the complexity of the process and offering a user-friendly interface. This enables you to utilize module functionalities without delving into the detailed construction logic.

- **Adaptability**: Factory functions in Bun Nook Kit are engineered to return varied object types, dependent on input parameters, ensuring the toolkit can be precisely adapted to meet your project's unique requirements.

- **Code Reusability**: Adhering to functional programming principles, Bun Nook Kit’ factory functions facilitate efficient code management and hasten development through enabling code reusability and composability.

- **Object Initialization**: Bun Nook Kit' factory functions manage complex object initialization, ensuring modules are instantiated with necessary properties or states.

Moreover, Bun Nook Kit employs factory functions to inject additional context where needed. For example, in the files folder module, a base path can be specified to anchor all operations to a particular directory. In the fetcher’s case, it allows the provision of a TypeSafe interface to the module, enabling type-safe fetch requests throughout your project. It also enhances user experience and usability by providing intellisense for available functions in the module. Although Bun Nook Kit heavily utilizes factory functions, almost all functions within them can also be used directly.

This version aims to maintain the original meaning while enhancing clarity and grammatical structure. Let me know if further modifications are needed!
Example Projects:

[Bun Nook Kit Server With HTMX, Tailwind](https://github.com/brandon-schabel/htmx-with-u-tools)

[Bun Nook Kit Server & Sqlite With HTMX, Tailwind](https://github.com/brandon-schabel/htmx-u-tools-sqlite)

[Bun Nook Kit Auth Server With React!]([githubb.com/brandon-schabel/](https://github.com/brandon-schabel/u-tools-auth-app))

## Alpha Software

Please use at your own risk, this is alpha software and is still very much in the early stages and the APIs are **guranteed** to change.

## License

Bun Nook Kit is licensed under the MIT License. Enjoy the freedom to use, modify, and distribute the software under very permissive terms.

Jumpstart your journey to revolutionary software development with Bun Nook Kit!
