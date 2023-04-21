# To Run this 
cd into this directory 

and then 
```bash
bun run rep-docs-generator.ts
```



# TypeScript Documentation Generator
This TypeScript Documentation Generator is a script that leverages the power of OpenAI's GPT to automatically generate documentation for TypeScript files in your project. The module allows you to choose specific actions to perform on the files and can take an additional custom prompt as input. The generated documentation is saved into individual files as well as consolidated files for each action.

## Introduction
The main purpose of this module is to simplify the process of creating documentation for your TypeScript project. By utilizing the OpenAI Completions API, it generates relevant and informative documentation for each TypeScript file based on the chosen actions and any additional input provided by the user.

To get started with the TypeScript Documentation Generator, simply provide your OpenAI API key and follow the prompts to choose the desired actions and input. The script will then process each TypeScript file in the project directory, generate the corresponding documentation, and save the results in separate files.

you can run this app from the root of the repo using 
`bun run docs-gen`

OR 

cd into this app (`cd _apps/cli_app`)
make sure you update your `.env`

and then run 
`bun run repo-docs-generators`

this will use the `cli-app` file and pass a configuration, this would allow you to make different GPT generators for different needs
