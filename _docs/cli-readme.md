# Module README

This module contains various utility functions for handling file operations and command line argument parsing in a Node.js environment.

## Functions

### `getUserInput()`

Gets user input asynchronously and returns a Promise that resolves with the input as a string.

### `parseCliArgs()`

Parses the command line arguments and returns a Promise that resolves with an object containing key-value pairs of the parsed arguments.

### `createFileWithContent(filePath: string, content: string)`

Ensures the directory exists and creates a file at the specified `filePath` with the given `content`.

### `ensureDirectoryExists(directoryPath: string)`

Ensures that the specified `directoryPath` exists.

### `getModulesFromPath(directoryPath: string)`

Gets the names of modules from the specified `directoryPath`.