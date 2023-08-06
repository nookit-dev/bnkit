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
import { createFetchFactory } from '@u-tools/modules/fetch-factory'/core
```

```typescript
//  if you know what the data looks like you can pass it in as a generic here.
const fetcher = createFetchFactory<DataType>()


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

- **Text Processing**: Convert markdown to HTML, handle strings, and more.
- **CLI Factory**: Handle command-line input, parse arguments, and interact with $$the file system.
- **Networking**: Create CRUD servers, handle HTTP requests, and work with the OpenAI API.
- **Data Storage**: Work with SQLite databases and data validation.
- **Type Utils**: Validate data against a schema and infer data types from objects.
- **Security Utils**: Generate encryption keys, encrypt and decrypt data, and more.
- **GPT Utils**: Generate debug prompts using OpenAI's GPT models.
- **Error Handler and Validation Utils**: Handle and validate errors in a user-friendly way.
- **Files and Folders Utils**: Work with files and directories, such as retrieving files from a specific directory or saving results to a file.

## Architecture

U Tools is built upon a robust and flexible architecture using factory functions, taking full advantage of their benefits to offer a streamlined, efficient, and versatile toolkit for your development needs.

Our architecture is designed to ensure:

- **Encapsulation**: Factory functions hide the complexities of object creation, providing a clear and understandable interface to consumers. You get the module you need without worrying about the intricacies of its construction.

- **Flexibility**: Factory functions can return different types of objects based on input parameters. This provides a high degree of flexibility in object creation, ensuring U Tools can easily adapt to your project's requirements.

- **Code Reuse**: Embracing the principles of functional programming, our factory functions facilitate code reuse and composability. This promotes efficient code management and rapid development across your application.

- **Object Initialization**: U Tools handles complex object initialization within its factory functions. If a module requires specific properties or a certain state upon creation, U Tools takes care of it.

However, we are fully aware of the potential pitfalls of factory functions:

- **Memory Usage**: We strive to optimize memory usage by managing how and when objects are created, ensuring the efficient operation of your application.

- **Code Readability**: While factory functions can add a layer of complexity, we mitigate this by breaking down complex logic into isolated utility functions, making the code easier to understand and maintain.

- **Debugging and Testing**: We prioritize testability in our architecture. By isolating complex logic into utility functions, we ensure that each piece can be tested independently, making debugging easier and more effective.

- **Prototypal Inheritance**: We acknowledge that simulating traditional class-based inheritance can be challenging in JavaScript. However, we utilize best practices to make this process as intuitive as possible.

By strategically leveraging the power of factory functions and mitigating their disadvantages, U Tools delivers a toolkit that is powerful, easy to use, and efficient, ready to be integrated into any project with ease.

Example Projects:
[U Tools Server With HTMX, Tailwind](https://github.com/brandon-schabel/htmx-with-u-tools)

[U Tools Server & Sqlite With HTMX, Tailwind](https://github.com/brandon-schabel/htmx-u-tools-sqlite)

## Contributing

We welcome contributions to U Tools! If you've got a utility function or a module that could be a useful addition, feel free to submit a pull request. Bug reports, suggestions, and other feedback are equally appreciated.

## License

U Tools is licensed under the MIT License. Enjoy the freedom to use, modify, and distribute the software under very permissive terms.

Jumpstart your journey to revolutionary software development with U Tools!
