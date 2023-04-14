# File System Utils

A set of utility functions for working with the file system.

## Functions

### `getFilesForDirectory(directory: string, options: { ignoreFiles: string[] }): string[]`

Returns an array of file names in the specified directory, filtered by the provided ignore list.

### `getFilesForDirectoryFromRoot(directory: string, options: { ignoreFiles: string[] }): string[]`

Returns an array of file names in the specified directory relative to the project root directory. Uses `findAppRoot` to locate the project root.

### `isRootFolder(folderPath: string): boolean`

Returns a boolean indicating whether the specified folder is the root of the project.

### `findAppRoot(startingPath: string): string | null`

Returns the path to the root directory of the project, or `null` if the root could not be found.

### `saveResultToFile(filePath: string, content: string): Promise<void>`

Saves the provided content to the specified file path. Will create any required directories if they do not already exist.