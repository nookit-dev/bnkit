## Module: 

This module includes several functions to handle common tasks such as parsing command line arguments, interacting with the file system, and getting user input. 

### Exports:

- `getUserInput(): Promise<string>` - retrieves user input asynchronously and returns a string

- `ParsedArgs` - interface for parsed command line arguments

- `parseCliArgs(): Promise<ParsedArgs>` - parses command line arguments and returns an object of parsed arguments

- `createFileWithContent(filePath: string, content: string)` - ensures a directory exists and creates a file with the given content

- `directoryExists(directoryPath: string)` - ensures a directory exists

- `getModulesFromPath(directoryPath: string)` - gets module names from a given directory path