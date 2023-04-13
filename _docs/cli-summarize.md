This module includes functions for handling user input, parsing command line arguments, creating files with content, checking if directories exist, and getting module names from a path. 

Exports:
- `getUserInput()`: async function that gets user input
- `parseCliArgs()`: async function that parses command line arguments
- `createFileWithContent(filePath: string, content: string)`: function that creates a file with content
- `directoryExists(directoryPath: string)`: function that checks if a directory exists
- `getModulesFromPath(directoryPath: string)`: function that gets module names from a path