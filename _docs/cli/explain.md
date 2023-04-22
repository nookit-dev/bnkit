# Module: cli-helpers

## Dependencies:
- error-handler-validation
- fs
- path
- readline

## Features: 
- `getUserInput()`: A function that gets user input asynchronously.
- `parseCliArgs()`: A function that parses command line arguments.
- `createFileWithContent(filePath: string, content: string)`: A function that ensures a directory exists and creates a file with the given content.
- `directoryExists(directoryPath: string)`: A function that ensures a directory exists.
- `getModulesFromPath(directoryPath: string)`: A function that gets module names from a directory path.
- `getAdditionalPrompt()`: A function that prompts the user for additional input.
- `chooseActions(actionsConfig: Record<string, any>)`: A function that prompts the user to choose from available actions and returns the selected actions.

## Technical Description:
This module provides helper functions for command line interface (CLI) applications. 

`getUserInput()` uses the `spawn()` method of the `child_process` module to asynchronously get user input.

`parseCliArgs()` parses command line arguments by iterating through the arguments and checking if they match any of the predefined options with optional default values. It returns an object with the parsed arguments.

`createFileWithContent(filePath, content)` ensures that the directory containing the file specified in `filePath` exists and creates the file with the content specified in `content` using the `writeFileSync()` method of the `fs` module.

`directoryExists(directoryPath)` checks if a directory specified in `directoryPath` exists using the `existsSync()` method of the `fs` module, creates it if it doesn't exist, and logs a message to the console.

`getModulesFromPath(directoryPath)` reads the contents of a directory specified in `directoryPath` and returns an array of the names of each subdirectory using the `readdirSync()` method of the `fs` module.

`getAdditionalPrompt()` prompts the user for additional input and returns the user's input using the `createInterface()` method of the `readline` module.

`chooseActions(actionsConfig)` prompts the user to choose from a list of available actions specified in `actionsConfig`. It returns an array of keys corresponding to the selected actions.