# Module: cli-utils

## Dependencies
- error-handler-validation
- fs
- path
- readline

## Features
- `getUserInput()`: Get user input asynchronously
- `ParsedArgs`: Interface for parsed command line arguments
- `parseCliArgs()`: Parse command line arguments
- `createFileWithContent(filePath: string, content: string)`: Ensure directory exists and create file with content
- `directoryExists(directoryPath: string)`: Ensure directory exists
- `getModulesFromPath(directoryPath: string)`: Get module names from path
- `getAdditionalPrompt()`: Get additional prompt from user
- `chooseActions(actionsConfig: Record<string, any>): Promise<Array<keyof typeof actionsConfig>>`: Choose and return selected actions from given config

## Technical Description
`cli-utils` is a collection of utility functions that aid in creating a command line interface (CLI) for Node.js programs. 

`parseCliArgs()` takes command line arguments passed to the program and returns an object with parsed key-value pairs. 

`createFileWithContent()` creates a file at the given file path with provided contents. The function also ensures that the directory containing the file exists. 

`directoryExists()` checks if a directory exists at the given file path and creates it if it doesn't exist.

`getModulesFromPath()` returns an array of module names present in a directory.

`getAdditionalPrompt()` prompts the user for additional input and returns the user's response as a string.

`chooseActions()` takes a configuration object with various actions and prompts the user to choose among those actions by entering their corresponding numbers. It returns an array of selected action keys.

These functions provide a streamlined way of accepting user input, handling command line arguments, and performing file system related tasks in a command line interface.