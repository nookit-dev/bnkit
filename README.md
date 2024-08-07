# Bun Nookit (BNK)

![BNK Logo](https://github.com/nookit-dev/bnkit/assets/18100375/d9f91bca-8875-4c00-8429-87e43b2a026f)

**Bun Nookit (BNK)** is a comprehensive toolkit for software development, leveraging the power of Bun and TypeScript. With zero third-party dependencies, strong TypeScript inferencing, and a focus on Web API standards, BNK offers a modular, type-safe, and efficient way to build robust applications.

![GitHub License](https://img.shields.io/github/license/nookit-dev/bnkit)

![npm](https://img.shields.io/npm/v/bnkit?logo=npm) ![GitHub release (with filter)](https://img.shields.io/github/v/release/nookit-dev/bnkit) ![Stars](https://img.shields.io/github/stars/nookit-dev/bnkit)
![npm bundle size](https://img.shields.io/bundlephobia/min/bnkit) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/bnkit)

![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/bun_nook_kit). ![Discord](https://img.shields.io/discord/1164699087543746560)'

## BNK Server Quickstart

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/nookit-dev/bnkit/main/scripts/quickstart.sh)
```

Visit `http://localhost:3000` in your browser and you should see Hello world and
`http://localhost:3000/json` for the json

---

###

# [📋 Documentation](https://nookit.dev/readme)

#### [🧩 Modules Docs](https://nookit.dev/modules)

#### [🖥️ BNK CLI Docs](https://nookit.dev/bnk-cli/bnk-cli-readme)

#### [🔌 Plugin Docs](https://nookit.dev/plugins/BNK+Plugins)

###

## Bun Nookit Package Installation

Install in your project:
`bun add bnkit`

Plugin install example:
`bun add @bnk/react`

Use any an all Bun Nookit modules - server example with json response (similar to starter project)

`index.ts`

```typescript
import { jsonRes, serverFactory } from 'bnkit/server'
import { middleware, type RoutesWithMiddleware } from './middlewares'

const routes = {
  '/': {
    // parse from request if neeeded
    get: (request) => new Response('Hello World!'),
  },
  '/json': {
    get: (request) =>
      bnk.server.jsonRes({
        message: 'Hello JSON Response!',
      }),
  },
} satisfies RoutesWithMiddleware

const { start, routes } = bnk.server.serverFactory({
  routes,
  middleware,
})

// start on default port 3000
start()
```

## Discord Server

Join our [Discord Server]("https://discord.gg/rQyWN7V6") https://discord.gg/rQyWN7V6, drop in and ask questions, give feedback or just for a chat!

## Key Highlights

- **Zero Third Paty Dependencies** - BNK uses nothin' but Bun
- **Unit Tested** - To ensure BNK is reliable, changeable, and upgradeable.

- **TypeSafe with Strong TypeScript type Inferencing** - Strong types tell you where things are incorrect, strong type inferrence allows you to utilize the advantages of strong types and not having to deal with too much TypeScript.

- **Modular** Everything is built with as little direct dependency on other modules in the repo, however they still work together. Soon I'll be working on a full stack auth package which will utilize everything from server routes, cookies, database(sqlite).

- **Builds on Web APIs** Bun itself is built on strong principles of sticking to Web APIs In order to maintain as much comptaibility across various packages, BNK sticks to the fundementals of the webplatform APIs.

## Plugins

Currently Bun Nookit has a React plugin, as well as a hook called `useServerState` for connecting to a Bun Nookit websocket server state, a `useLocalStorage` hook, and a `useClipboard` hook.

## Architecture

Bun Nookit is built upon a robust and flexible architecture using factory functions, taking full advantage of their benefits to offer a streamlined, efficient, and versatile toolkit for your development needs.

- **Encapsulation**: Bun Nookit employs factory functions to streamline object creation, concealing the complexity of the process and offering a user-friendly interface. This enables you to utilize module functionalities without delving into the detailed construction logic.

- **Adaptability**: Factory functions in Bun Nookit are engineered to return varied object types, dependent on input parameters, ensuring the toolkit can be precisely adapted to meet your project's unique requirements.

- **Code Reusability**: Adhering to functional programming principles, Bun Nookit’ factory functions facilitate efficient code management and hasten development through enabling code reusability and composability.

- **Object Initialization**: Bun Nookit' factory functions manage complex object initialization, ensuring modules are instantiated with necessary properties or states.

Moreover, Bun Nookit employs factory functions to inject additional context where needed. For example, in the files folder module, a base path can be specified to anchor all operations to a particular directory. In the fetcher’s case, it allows the provision of a TypeSafe interface to the module, enabling type-safe fetch requests throughout your project. It also enhances user experience and usability by providing intellisense for available functions in the module. Although Bun Nookit heavily utilizes factory functions, almost all functions within them can also be used directly.

This version aims to maintain the original meaning while enhancing clarity and grammatical structure. Let me know if further modifications are needed!

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

## Screenshots

(if you made it this far)

Create typesafe server routes and middleware!

<img width="555" alt="Xnapper-2023-11-14-19 43 47" src="https://github.com/nookit-dev/bnkit/assets/18100375/0d66c9ec-0f3a-487c-98f8-8c14faeaa82d">

<img width="582" alt="Xnapper-2023-11-14-19 47 14" src="https://github.com/nookit-dev/bnkit/assets/18100375/78afc0e7-46c0-4269-8072-e8622f111b08">

### Sponsors

None! Be the first to sponsor BNK :)

## License

Bun Nookit is licensed under the MIT License. Enjoy the freedom to use, modify, and distribute the software under very permissive terms.

Jumpstart your journey to revolutionary software development with Bun Nookit!

Contribute to the docs:

### [Docs Repo](https://github.com/nookit-dev/bnkit-docs)
