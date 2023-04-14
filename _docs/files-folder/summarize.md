# Module Summary

This module provides functions for working with files and directories, including getting a list of files in a specific directory, finding the root directory of a project, and saving content to a file.

## Exports

- `getFilesForDirectory(directory: string, options?: { ignoreFiles?: string[] }): string[]`: Returns a list of files in the specified directory, excluding any files listed in the `ignoreFiles` array.
- `getFilesForDirectoryFromRoot(directory: string, options?: { ignoreFiles?: string[] }): string[]`: Returns a list of files in the specified directory relative to the project root, excluding any files listed in the `ignoreFiles` array.
- `findAppRoot(startingPath: string): string | null`: Returns the path to the root directory of the project that contains the specified `startingPath`.
- `saveResultToFile(filePath: string, content: string): Promise<void>`: Saves the given `content` to the file specified by `filePath`. Any missing directories in the path will be created automatically.