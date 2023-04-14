# Module Summary

The module includes functions for handling user input, parsing command line arguments, ensuring directory existence, creating files with content, and getting module names from a path.

## Exports

- `getUserInput()`: Asynchronously gets user input as a string.
- `parseCliArgs()`: Asynchronously parses command line arguments and returns an object with keyed values.
- `directoryExists(directoryPath: string)`: Ensures a directory exists at the provided path. If it doesn't exist, it creates the directory.
- `createFileWithContent(filePath: string, content: string)`: Ensures a directory exists at the path of the specified file, and creates the file with the specified content. If the directory doesn't exist, it creates the directory.
- `getModulesFromPath(directoryPath: string)`: Returns an array of module names found in the specified directory.