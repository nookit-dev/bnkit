This module contains functions for handling user input, parsing command line arguments, creating files with content, ensuring directory existence, and getting module names from a given path. 

Exports:
- `getUserInput` - gets user input asynchronously and returns a Promise<string>
- `parseCliArgs` - parses command line arguments and returns a Promise of ParsedArgs interface
- `createFileWithContent` - creates a file with content at the given filePath
- `ensureDirectoryExists` - ensures that the given directoryPath exists
- `getModulesFromPath` - returns a list of module names from the given directoryPath