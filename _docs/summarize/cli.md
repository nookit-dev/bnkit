This module includes functions for handling user input, parsing command line arguments, creating and checking directories, and retrieving module names from a directory. 

Exports:
- `getUserInput()`: asynchronous function that retrieves user input
- `parseCliArgs()`: asynchronous function that parses command line arguments and returns an object of key/value pairs
- `createFileWithContent(filePath: string, content: string)`: function that creates a file with the given path and content
- `directoryExists(directoryPath: string)`: function that ensures a directory exists at the given path
- `getModulesFromPath(directoryPath: string)`: function that retrieves an array of module names from the given directory path