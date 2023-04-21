# Module Name

This is a template for a Node.js module.

## Usage

To use this module, follow these steps:

1. Install the module using npm: `npm install module-name`
2. Import the module in your script: `const moduleName = require('module-name')`
3. Use the module's functions as needed

## Functions

This module contains the following functions:

- `getUserInput()`
- `parseCliArgs()`
- `directoryExists(directoryPath: string)`
- `getModulesFromPath(directoryPath: string)`
- `getAdditionalPrompt(): Promise<string>`
- `chooseActions(actionsConfig: Record<string, any>): Promise<Array<keyof typeof actionsConfig>>`