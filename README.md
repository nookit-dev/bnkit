# U Tools

![U Tools Logo](https://user-images.githubusercontent.com/18100375/231109092-34bdc552-dd37-413d-8eec-b9b668340b65.png)

Are you overwhelmed by countless options and dependencies? Embrace the simplicity of U Tools, your toolkit for creating indie hacker apps. Cast aside the cumbersome stacks of large companies and say hello to lightning-fast experiences in your apps. U Tools is built with hobbyists at heart and puts the excitement and joy back into programming.

## Alpha Software

Please use at your own risk, this is alpha software and is still very much in the early stages and the APIs are **guranteed** to change.

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

3. Install U Tools:

```bash
bun add @u-tools/core
```

Now, you can import U Tools into your module:

```typescript
import { createFetchFactory } from '@u-tools/modules/fetcher'
```

```typescript
//  if you know what the data looks like you can pass it in as a generic here.
const fetcher = createFetchFactory<DataT>()


// however you can also pass it in on the request itsefl
const result = await fetcher.get<GetResponse>('http://example.com/)
```

You can also use a single module directly:

```bash
bun add https://github.com/brandon-schabel/u-tools/tree/main/modules/cli-factory
```

## Key Highlights

- **Zero Dependencies**: Our goal is to build this toolkit with no extra dependencies so your apps stay lean and fast, relying solely on Bun itself.
- **Versatile**: U Tools is a toolkit to develop servers, decentralized networks, developer tools, custom Raspberry Pi software, and real-time software. Leverage the tiny direct Bun source code modules to solve your problems.
- **Modular and Efficient**: Dive into a world where every design choice fuels your creative endeavors. U Tools's modular approach helps you build efficient applications with minimal abstraction layers.

## Goals

Our mission with U Tools is to create a dynamic, flexible, and user-friendly toolkit that can be integrated into any project, regardless of its complexity. Here are our key goals:

- **Adaptable and Scalable**: U Tools is designed to fit seamlessly into any project, irrespective of its size or requirements. Whether you are a hobbyist building a small project or a developer part of a larger team, you can use U Tools as little or as much as you like, thanks to its modular architecture.

- **Efficiency through Modularity**: With the modular architecture of U Tools, we aim to promote a "use-what-you-need" philosophy. Each module in U Tools is a standalone feature, allowing you to choose only what you need for your project. This reduces bloat and keeps your projects lean and efficient.

- **Empowering Through Simplicity**: We believe in the power of simplicity. U Tools is created with a user-friendly approach, allowing developers of all skill levels to quickly and effectively use it. This fosters a more creative and productive environment.

- **Evolving with Community**: We are committed to continuously improving and refining U Tools based on community feedback and contributions. Our goal is to create a toolkit that evolves with the needs of the community, ensuring its relevance and usefulness in the ever-evolving tech landscape.

- **Promoting Direct Problem Solving**: With U Tools's direct source code modules, we aim to foster a problem-solving approach that reduces reliance on heavy abstraction layers. This promotes a better understanding of your code and more control over your project.

Remember, with U Tools, your toolkit can grow with your project. Start small, add modules as you need them, and watch your project take shape with efficiency and ease. Happy coding!

## Features

U Tools offers a wide array of utility modules including:

Certainly! Here are more details about each of the U Tools modules:

1. CLI: The CLI module aims to provide a simple way to build a basic command-line interface for tasks such as project scaffolding or generating configurations. It helps you handle command-line input, parse arguments, and interact with the file system.

2. Cookie: The Cookie module provides utilities for handling cookies on both the client-side and server-side. It allows you to set, get, and delete cookies, as well as manage cookie options such as expiration and domain.

3. Data Gen: The Data Gen module is a simple data generator that allows you to create mock data for testing purposes. While it may not replace more robust data generation tools, it provides a quick and easy way to generate sample data.

4. Deploy: The Deploy module provides utilities for deployment, with a focus on GitHub Actions integration. It helps you automate the deployment process for your U Tools package.

5. Fetcher: The Fetcher module enhances the standard fetch function provided by Bun. It allows you to configure an entire API and provides a TypeScript interface for easy integration with your project. The Fetcher module helps you make HTTP requests and handles data fetching and updating.

6. Files Folder: The Files Folder module provides various utilities for working with files and folders. It includes functions for searching for files, validating file paths, and creating references to files. This module can be useful for tasks like building an in-browser file manager.

7. Hash: The Hash module provides a simple abstraction to Bun's hashing functions. It allows you to hash data using common hashing algorithms for tasks such as password hashing or data integrity checks.

8. JWT: The JWT module provides utilities for working with JSON Web Tokens. It allows you to encode and decode JWTs and provides features like token invalidation.

9. Logger: The Logger module aims to provide a full-featured logging system for your application. While it is still under development and might be limited in functionality, it can be a useful tool for debugging and error tracking.

10. NPM Release: The NPM Release module provides utilities for managing NPM packages. It allows you to update the package version, retrieve the package version, and set up npm authentication. This module can be used in conjunction with the Deploy module for publishing NPM packages.

11. Server: The Server module is one of the most complex modules in U Tools. It helps you set up an HTTP server with various middleware options. It simplifies tasks like handling CORS and provides a TypeScript interface for type-safe request handlers. The goal is to provide seamless type safety integration with the Fetcher module.

12. SQLite: The SQLite module builds on top of Bun's SQLite implementation and provides utilities for working with SQLite databases. It includes functions for instantiating databases, creating type-safe schemas, and performing database operations.

13. State Management: The State Management module provides an interface for building type-safe state managers. It offers an immutable state management approach and includes dispatcher functions for easy data manipulation. The module also provides a WebSocket state manager for syncing data between the client and server.

14. Utils: This isn't really a module :) - it does contains various utility functions that can be used across different modules. It includes functions like classy for generating class names, normalizeBytes for converting byte numbers to formatted text, and value checkers for inferring data types.

15. Validation: The Validation module aims to provide a comprehensive suite of validation functions. It includes functions for checking the validity of API data and can be used to ensure data integrity and accuracy.

16. WebRTC: The WebRTC module aims to provide an interface for setting up WebRTC connections between clients. While integration with the server module is planned, the module can currently be used for establishing peer-to-peer connections between clients.

## Plugins
Currently U Tools has a React plugin, as well as a hook called `useServerState` for connecting to a U Tools websocket server state, a `useLocalStorage` hook, and a `useClipboard` hook.

## Architecture

U Tools is built upon a robust and flexible architecture using factory functions, taking full advantage of their benefits to offer a streamlined, efficient, and versatile toolkit for your development needs.

Our architecture is designed to ensure:

- **Encapsulation**: U Tools uses factory functions to simplify object creation. This approach hides the intricate object creation process and provides a user-friendly interface. It enables you to leverage the functionality of the module you need, without the need to understand the finer details of its construction.

- **Adaptability**: Our factory functions are designed to return diverse object types based on input parameters. This level of adaptability ensures that U Tools can be tailored to your project's specific requirements.

- **Code Reusability**: By following the principles of functional programming, U Tools' factory functions ensure efficient code management and accelerate development by enabling code reusability and composability.

- **Object Initialization**: Complex object initialization is handled within the factory functions of U Tools. If a module needs specific properties or a particular state at creation, U Tools manages these requirements.

In addition to these, U Tools primarily utilizes factory functions to insert additional context where required. For instance, in the files folder module, a base path can be provided to ensure all operations relate to a designated directory. In the case of the fetcher - it allows you to provide a TypeSafe interface to the module which can then be utilized to make typesafe fetch requests anywhere in your project. More so, it gives an intellisense of the available functions in that module, improving the user experience and ease of use. While we do make heavy use of factory functions, nearly all functions used within the factory functions can be used directly

Example Projects:
[U Tools Server With HTMX, Tailwind](https://github.com/brandon-schabel/htmx-with-u-tools)

[U Tools Server & Sqlite With HTMX, Tailwind](https://github.com/brandon-schabel/htmx-u-tools-sqlite)

## License

U Tools is licensed under the MIT License. Enjoy the freedom to use, modify, and distribute the software under very permissive terms.

Jumpstart your journey to revolutionary software development with U Tools!
