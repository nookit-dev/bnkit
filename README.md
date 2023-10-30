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



const routes = {
  "/": {
    // parse from request if neeeded
    GET: (request) => new Response("Hello World!")
  },
  "/json": {
    GET: request => u.server.jsonRes({
      message: "Hello JSON Response!"
    })
  }
} satisfies u.server.Routes

const { start, routes } = u.server.serverFactory({
  routes
});


// start on default port 3000
start()
```

```bash
bun run index.ts
```

Visit `http://localhost:3000` in your browser and you should see Hello world and
`http://localhost:3000/json` for the json

Note:
The keyword satisfies in TypeScript, gives us typesafety, if you have middleware it would even infer the response from those! Which can then be passed to the routes and used in the handlers. So instead of explicitly saying routes is a specific type, it just makes sure that type(Routes in this case) can be succesfully applied to that object/array/whatever(routes config in this case), since it doesn't specifically set the type, we can then infer all the types from the middleware and routes. Following this it makes it possible to make typesafe API
requests.

## Discord Server

Join our [Discord Server]("https://discord.gg/rQyWN7V6"), drop in and ask questions, give feedback or just for a chat!

## Key Highlights

- **Zero Third Paty Dependencies** - BNK uses nothin' but Bun
  
- **Unit Tested** - To ensure BNK is reliable, changeable, and upgradeable.

- **TypeSafe with Strong TypeScript type Inferencing** - Strong types tell you where things are incorrect, strong type inferrence allows you to utilize the advantages of strong types and not having to deal with too much TypeScript.

- **Modular** Everything is built with as little dependency other other modules in the repo, however they still work together. Soon I'll be working on a full stack auth package which will utilize everything from server routes, cookies, database(sqlite).

- **Builds on Web APIs** Bun itself is built on strong principles of sticking to Web APIs In order to maintain as much comptaibility across various packages, BNK sticks to the fundementals of the webplatform APIs.

## Features

Bun Nook Kit offers a wide array of utility modules including:

1. [CLI](modules/cli/README.md): The CLI module aims to provide a simple way to build a basic command-line interface for tasks such as project scaffolding or generating configurations. It helps you handle command-line input, parse arguments, and interact with the file system.

2. [Cookie](modules/cookies/README.md): The Cookie module provides utilities for handling cookies on both the client-side and server-side. It allows you to set, get, and delete cookies, as well as manage cookie options such as expiration and domain.

3. [Data Gen](modules/data-gen/README.md): The Data Gen module is a simple data generator that allows you to create mock data for testing purposes. While it may not replace more robust data generation tools, it provides a quick and easy way to generate sample data.

4. [Deploy](modules/deploy/README.md): The Deploy module provides utilities for deployment, with a focus on GitHub Actions integration. It helps you automate the deployment process for your Bun Nook Kit package.

5. [Fetcher](modules/fetcher/README.md): The Fetcher module enhances the standard fetch function provided by Bun. It allows you to configure an entire API and provides a TypeScript interface for easy integration with your project. The Fetcher module helps you make HTTP requests and handles data fetching and updating.

6. [Files Folder](modules/files-folders/README.md): The Files Folder module provides various utilities for working with files and folders. It includes functions for searching for files, validating file paths, and creating references to files. This module can be useful for tasks like building an in-browser file manager.

7. [Auth](modules/Auth/README.md): The auth module provides offers utilities for encryption of passwords/data.

8. [HTMLody](modules/htmlody/README.md): HTMLody is a tool that enables the conversion of JSON structures into valid HTML and CSS, facilitating both dynamic HTML generation and the export of static assets for enhanced web performance. It offers a flexible and maintainable approach to web development, with support for plugins with prebuilt plugins such as Tailwind-like CSS class utilties and a render Markdown plugin utility, easily integrate with libraries like HTMX for dynamic functionality, and a comprehensive TypeScript support for defining and customizing the JSON elements.

9. [JWT](modules/jwt/README.md): The JWT module provides utilities for working with JSON Web Tokens. It allows you to encode and decode JWTs and provides features like token invalidation.

10. [Logger](modules/logger/README.md): The Logger module aims to provide a full-featured logging system for your application. While it is still under development and might be limited in functionality, it can be a useful tool for debugging and error tracking.

11. [NPM](modules/npm/README.md) Release: The NPM Release module provides utilities for managing NPM packages. It allows you to update the package version, retrieve the package version, and set up npm authentication. This module can be used in conjunction with the Deploy module for publishing NPM packages

12. [Server](modules/server/README.md): The Server module is one of the most complex modules in Bun Nook Kit. It helps you set up an HTTP server with various middleware options. It simplifies tasks like handling CORS and provides a TypeScript interface for type-safe request handlers. The goal is to provide seamless type safety integration with the Fetcher module.

13. [SQLite](modules/sqlite/README.md): The SQLite module builds on top of Bun's SQLite implementation and provides utilities for working with SQLite databases. It includes functions for instantiating databases, creating type-safe schemas, and performing database operations.

14. [State Management](modules/state/README.md) : The State Management module provides an interface for building type-safe state managers. It offers an immutable state management approach and includes dispatcher functions for easy data manipulation. The module also provides a WebSocket state manager for syncing data between the client and server.

15. [Utils](modules/utils/README.md): This isn't really a module :) - it does contains various utility functions that can be used across different modules. It includes functions like classy for generating class names, normalizeBytes for converting byte numbers to formatted text, and value checkers for inferring data types.

16. [UUID](modules/uuid/README.md): Generate timestamp encoded UUIDs with UUIDv7 spec implemented

17. [Type Utils](modules/type-utils.md): TypeScript Utilities

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

## Example Projects

[Bun Nook Kit Server With HTMX, Tailwind](https://github.com/brandon-schabel/htmx-with-bun-nook-kit)

[Bun Nook Kit Server & Sqlite With HTMX, Tailwind](https://github.com/brandon-schabel/htmx-bun-nook-kit-sqlite)

[Bun Nook Kit Auth Server With React!]([githubb.com/brandon-schabel/](https://github.com/brandon-schabel/bun-nook-kit-auth-app))

## Alpha Software

Please use at your own risk, this is alpha software and is still very much in the early stages and the APIs are **guranteed** to change.

## License

Bun Nook Kit is licensed under the MIT License. Enjoy the freedom to use, modify, and distribute the software under very permissive terms.

Jumpstart your journey to revolutionary software development with Bun Nook Kit!
