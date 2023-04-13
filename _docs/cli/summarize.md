## Module Summary

This module contains functions for handling user input, parsing command line arguments, file manipulation, directory validation, and extracting module names from a directory path.

## Exports

- `getUserInput(): Promise<string>` - a function that gets user input asynchronously and returns a promise that resolves with the user input as a string.

- `parseCliArgs(): Promise<ParsedArgs>` - a function that parses command line arguments and returns a promise that resolves with an interface defining the parsed arguments.

- `createFileWithContent(filePath: string, content: string): void` - a function that ensures a directory exists and creates a file with the specified content.

- `directoryExists(directoryPath: string): void` - a function that ensures a directory exists at the specified path.

- `getModulesFromPath(directoryPath: string): string[]` - a function that returns an array of module names extracted from the provided directory path.
