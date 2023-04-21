# Instant Bun
## A Zero Dependency Toolkit For Developing Bun Apps Instantly
This project is a collection of utility functions and modules designed to provide users with an easy-to-use and efficient set of tools for various tasks in web development, data manipulation, networking, and more.

# Project Overview
The intention of this project is to create a comprehensive library that helps developers tackle common problems and tasks that they might encounter in their day-to-day work without cumbersome sub-dependencies. By providing well-documented and tested functions and modules, we aim to save developers time and effort and reduce the likelihood of bugs and other issues in their projects.

# Features
This project includes a variety of modules and utility functions, such as:

## Text Utils: 
Functions for converting markdown to HTML, handling strings, and more.

## CLI Utils: 
Functions for handling command-line input, parsing arguments, and interacting with the file system.

## Networking Utils: 
Functions for creating CRUD servers, handling HTTP requests, and working with the OpenAI API.

## Data Storage Utils: 
Functions for working with SQLite databases and data validation.
## Type Utils: 
Functions for validating data against a schema and inferring data types from objects.
## Security Utils: 
Functions for generating encryption keys, encrypting and decrypting data, and more.
## GPT Utils: 
Functions for generating debug prompts using OpenAI's GPT models.

## Error Handler and Validation Utils: 
Functions for handling and validating errors in a user-friendly way.
## Files and Folders Utils: 
Functions for working with files and directories, such as retrieving files from a specific directory or saving results to a file.
## Getting Started
To get started with this project, clone the repository and install the required dependencies. Then, you can begin using the utility functions and modules in your own projects by importing them as needed.

## Contributing
We welcome contributions to this project! If you have a utility function or module that you think would be a useful addition, please feel free to submit a pull request. We also appreciate any bug reports, suggestions, or other feedback.

License
This project is licensed under the MIT License.


# Project Overview


![brandonschabel_simple_flat_geometric_multi_color_modern_logo_bu_a6489642-e13f-48c8-a342-746f9f698143](https://user-images.githubusercontent.com/18100375/231109092-34bdc552-dd37-413d-8eec-b9b668340b65.png)



Ever had a brilliant idea but felt overwhelmed by the countless options and dependencies? Worry no more! Introducing Instant Bun, your sleek and simplified solution for indie hacker apps.

Say goodbye to the cumbersome stacks of large companies, and hello to a toolkit designed to deliver lightning-fast experiences in your app. Built with hobbyists at heart, Instant Bun streamlines project building, putting the excitement and joy back into programming. 
Dive into a world where every design choice fuels your creative endeavors, and let the fun begin!

The goal will always to be building this toolkit with no extra dependencies so your apps stay lean and fast, just Bun itself

This is a toolkit to develop servers, decentralized networks, developer tools, custom raspberry pi software, realtime software. Use tiny direct bun source code modules to solve your problem.



Limitations and Dependencies
----------------------------

The project has the following limitations:

-   Only Bun can be used as a dependency.
-   Everything should be built from scratch in a reusable way.
-   If something becomes overly complicated, create a new version.
-   Focus on learning and contributing to Bun.


Project Structure and Ideas
---------------------------

Each idea should be its own module within the project. Modules should be modular, unit testable, and only export things that are worth using outside the module. They should be able to operate independently and may depend on each other. Maintain a flat hierarchy within modules.

### Modules

- generated
- html-formatter 
- markdown-to-html 
- error-handling 
- types 
- files-folders 
- sqlite-interface 
- gpt-utils 
- validations 
- templating-engine 
- fetch-utils 
- code-generators 
- scripts 
- web-page-render 
- cli-utils


# Installation Details
If you don't have bun installed run:
```bash
curl -fsSL https://bun.sh/install | bash
```



ceate a new directory and cd into it :


```bash
mkdir playground && cd playground
```


init bun project
```bash
bun init 
```


Install instant-bun in your bun app, 
```bash
bun add https://github.com/Modular-Architecture-Toolkit/instant-bun
```

Why would I add the repo directly you might ask?
Because you use the source code directly, every commit is a new version, and you can use whatever version 
of each module that you want.



then import into your module
```jsx
import { fetchUtils } from 'instant-bun'
```

You can even use a single module directly

```
bun add https://github.com/Modular-Architecture-Toolkit/instant-bun/tree/main/modules/sqlite-interface
```

you'll have node modules which will contain the source code directly to instant-bun

Fork the project and you can even start making your own versions of each module. Do whatever you want, everything is highly modular.


watch tests
`bun --watch test`


I will move unnesssary things out of the source code as the project matures, my goal is to simplify constantly. 