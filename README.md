# Bun Nook Kit (BNK)

![Bun Nook Kit Logo](https://user-images.githubusercontent.com/18100375/231109092-34bdc552-dd37-413d-8eec-b9b668340b65.png)

## Getting Started

Install Bun if you don't already have it:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Server quickstart

```bash
bun create github.com/brandon-schabel/bnk-server-starter
```

```bash
cd bun-server-starter
```

```bash
bun dev
```

Visit `http://localhost:3000` in your browser and you should see Hello world and
`http://localhost:3000/json` for the json

## Usage Overview

### Install

```bash
bun add @bnk/core
```

Use any an all Bun Nook Kit modules - server example with json response (similar to starter project)

`index.ts`

```typescript
import * as bnk from "@bnk/core";

const routes = {
  "/": {
    // parse from request if neeeded
    GET: (request) => new Response("Hello World!")
  },
  "/json": {
    GET: request => bnk.server.jsonRes({
      message: "Hello JSON Response!"
    })
  }
} satisfies bnk.server.Routes

const { start, routes } = bnk.server.serverFactory({
  routes
});


// start on default port 3000
start()
```

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

1. [🖥️CLI](docs/readmes/CLI-README.md): The CLI module aims to provide a simple way to build a basic command-line interface for tasks such as project scaffolding or generating configurations. It helps you handle command-line input, parse arguments, and interact with the file system.

2. [🍪Cookies](docs/readmes/COOKIES-README.md): The Cookie module provides utilities for handling cookies on both the client-side and server-side. It allows you to set, get, and delete cookies, as well as manage cookie options such as expiration and domain.

3. [💿Data Gen](docs/readmes/DATA-GEN-README.md): The Data Gen module is a simple data generator that allows you to create mock data for testing purposes. While it may not replace more robust data generation tools, it provides a quick and easy way to generate sample data.

4. [🏗️Deploy](docs/readmes/DEPLOY-README.md): The Deploy module provides utilities for deployment, with a focus on GitHub Actions integration. It helps you automate the deployment process for your Bun Nook Kit package.

5. [🐶🦴Fetcher](docs/readmes/FETCHER-README.md): The Fetcher module enhances the standard fetch function provided by Bun. It allows you to configure an entire API and provides a TypeScript interface for easy integration with your project. The Fetcher module helps you make HTTP requests and handles data fetching and updating.

6. [📂Files Folder](docs/readmes/FILES-FOLDER-README.md): The Files Folder module provides various utilities for working with files and folders. It includes functions for searching for files, validating file paths, and creating references to files. This module can be useful for tasks like building an in-browser file manager.

7. [🔐Auth](docs/readmes/AUTH-README.md): The auth module provides offers utilities for encryption of passwords/data.

8. [📜HTMLody](docs/readmes/HTMLODY-README.md): HTMLody is a tool that enables the conversion of JSON structures into valid HTML and CSS, facilitating both dynamic HTML generation and the export of static assets for enhanced web performance. It offers a flexible and maintainable approach to web development, with support for plugins with prebuilt plugins such as Tailwind-like CSS class utilties and a render Markdown plugin utility, easily integrate with libraries like HTMX for dynamic functionality, and a comprehensive TypeScript support for defining and customizing the JSON elements.

9. [🔎JWT](docs/readmes/JWT-README.md): The JWT module provides utilities for working with JSON Web Tokens. It allows you to encode and decode JWTs and provides features like token invalidation.

10. [🪵Logger](docs/readmes/LOGGER-README.md): The Logger module aims to provide a full-featured logging system for your application. While it is still under development and might be limited in functionality, it can be a useful tool for debugging and error tracking.

11. [📦NPM](docs/readmes/NPM-RELEASE-README.md) Release: The NPM Release module provides utilities for managing NPM packages. It allows you to update the package version, retrieve the package version, and set up npm authentication. This module can be used in conjunction with the Deploy module for publishing NPM packages

12. [🌎Server](docs/readmes/SERVER-README.md): The Server module is one of the most complex modules in Bun Nook Kit. It helps you set up an HTTP server with various middleware options. It simplifies tasks like handling CORS and provides a TypeScript interface for type-safe request handlers. The goal is to provide seamless andtype safe server configurations.

13. [📝SQLite](docs/readmes/SQLITE-README.md): The SQLite module builds on top of Bun's SQLite implementation and provides utilities for working with SQLite databases. It includes functions for instantiating databases, creating type-safe schemas, and performing database operations.

14. [🔄State Management](docs/readmes/STATE-README.md) : The State Management module provides an interface for building type-safe state managers. It offers an immutable state management approach and includes dispatcher functions for easy data manipulation. The module also provides a WebSocket state manager for syncing data between the client and server.

15. [🛠️Utils](docs/readmes/UTILS-README.md): This isn't really a module :) - it does contains various utility functions that can be used across different modules. It includes functions like classy for generating class names, normalizeBytes for converting byte numbers to formatted text, and value checkers for inferring data types.

16. [🆔UUID](docs/readmes/UUID-README.md): Generate timestamp encoded UUIDs with UUIDv7 spec implemented

17. [🧙‍♂️Type Utils](modules/TYPE-UTILS.md): TypeScript Utilities

18. [✅Validation]: The Validation module aims to provide a comprehensive suite of validation functions. It includes functions for checking the validity of API data and can be used to ensure data integrity and accuracy.

```typescript
import * as bnk from '@bnk/core'

const uuid = bnk.uuid.v7()

console.log(uuid)
```

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

## Alpha Software

Please use at your own risk, this is alpha software and is still very much in the early stages and the APIs are **guranteed** to change.

## Coming Soon

### Stacks 🥞

I have a few templates for building full stack apps in the works.

1. BNK Payments Stack - Use BNKs built in HTMLody and it's CSS engine to create interactive full stack applications with payments and auth preconfigured.
2. BNK SSR React With Client Side Hydration with Auth - A Stack that will come preconfigurated with a full stack SSR'd BNK based server plugin. This allows you to take full advantage of the existing React ecosystem.
3. Decoupled Client/Server with Auth

### Finalize V1 APIs

Close To Final For V1:

- Server
- SQLite
- UUID
- JWT
- Cookies
- HTMLody/CSS-Engine
- Fetcher

### Dev Tools

### Use JS Libraries Like React Anywhere in HTMLody

### Better handling for Server Sent Events in Server, Fetcher, etc

## License

Bun Nook Kit is licensed under the MIT License. Enjoy the freedom to use, modify, and distribute the software under very permissive terms.

Jumpstart your journey to revolutionary software development with Bun Nook Kit!
