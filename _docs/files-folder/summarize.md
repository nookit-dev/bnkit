## Module Summary

This module provides functions for finding and working with files within a project directory. It includes functions for getting a list of files in a directory, finding the root directory of a project, saving results to a file, and reading the contents of multiple files at once.

### Exports

- `getFilesForDirectory(directory: string, options: { ignoreFiles?: string[] }): string[]`: Returns a list of file names in the given directory, filtered to exclude any files in the `ignoreFiles` array.
- `getFilesForDirectoryFromRoot(directory: string, options: { ignoreFiles?: string[] }): string[]`: Returns a list of file names in the directory relative to the root directory of the project. Calls `getFilesForDirectory` with the full path to the target directory.
- `isRootFolder(folderPath: string): boolean`: Returns `true` if the given folder path represents the root directory of a project (determined by the presence of a `tsconfig.json` file)
- `findAppRoot(startingPath: string): string | null`: Searches for the root directory of a project starting from the given directory path, and returns the full path to the project root. Returns `null` if no root directory is found.
- `saveResultToFile(filePath: string, content: string): Promise<void>`: Creates any necessary directories and writes the given content to the given file path. Returns a Promise that resolves when the save is complete.
- `readFilesContents(filePaths: string[]): { path: string, content: string }[]`: Returns an array of objects representing the content of the files at the given file paths, where each object includes the file name and contents.