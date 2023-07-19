# Instant Bun

![Instant Bun Logo](https://user-images.githubusercontent.com/18100375/231109092-34bdc552-dd37-413d-8eec-b9b668340b65.png)

Are you overwhelmed by countless options and dependencies? Embrace the simplicity of Instant Bun, your toolkit for creating indie hacker apps. Cast aside the cumbersome stacks of large companies and say hello to lightning-fast experiences in your apps. Instant Bun is built with hobbyists at heart and puts the excitement and joy back into programming.

## Key Highlights

- **Zero Dependencies**: Our goal is to build this toolkit with no extra dependencies so your apps stay lean and fast, relying solely on Bun itself.
- **Versatile**: Instant Bun is a toolkit to develop servers, decentralized networks, developer tools, custom Raspberry Pi software, and real-time software. Leverage the tiny direct Bun source code modules to solve your problems.
- **Modular and Efficient**: Dive into a world where every design choice fuels your creative endeavors. Instant Bun's modular approach helps you build efficient applications with minimal abstraction layers.

## Features

Instant Bun offers a wide array of utility modules including:

- **Text Processing**: Convert markdown to HTML, handle strings, and more.
- **CLI Factory**: Handle command-line input, parse arguments, and interact with $$the file system.
- **Networking**: Create CRUD servers, handle HTTP requests, and work with the OpenAI API.
- **Data Storage**: Work with SQLite databases and data validation.
- **Type Utils**: Validate data against a schema and infer data types from objects.
- **Security Utils**: Generate encryption keys, encrypt and decrypt data, and more.
- **GPT Utils**: Generate debug prompts using OpenAI's GPT models.
- **Error Handler and Validation Utils**: Handle and validate errors in a user-friendly way.
- **Files and Folders Utils**: Work with files and directories, such as retrieving files from a specific directory or saving results to a file.

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

3. Install Instant Bun:

```bash
bun add https://github.com/Modular-Architecture-Toolkit/instant-bun
```

Now, you can import Instant Bun into your module:

```jsx
import { fetchUtils } from 'instant-bun'
```

You can also use a single module directly:

```bash
bun add https://github.com/Modular-Architecture-Toolkit/instant-bun/tree/main/modules/cli-factory
```

## Contributing

We welcome contributions to Instant Bun! If you've got a utility function or a module that could be a useful addition, feel free to submit a pull request. Bug reports, suggestions, and other feedback are equally appreciated.

## License

Instant Bun is licensed under the MIT License. Enjoy the freedom to use, modify, and distribute the software under very permissive terms.

Jumpstart your journey to revolutionary software development with Instant Bun!