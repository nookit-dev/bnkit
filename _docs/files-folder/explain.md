# Module: file-utils.js

## Dependencies
- fs
- path
- (local) error-handler-validation.js

## Features
- `getFilesForDirectory(directory, { ignoreFiles })`: returns an array of filenames for a given directory, excluding any files specified in the `ignoreFiles` array.
- `getFilesForDirectoryFromRoot(directory, { ignoreFiles })`: returns the same array of filenames as `getFilesForDirectory`, but the `directory` path is relative to the project root (determined by finding the first directory with a `tsconfig.json` file).
- `isRootFolder(folderPath)`: checks if a given folder is the project root directory (by checking for the presence of a `tsconfig.json` file).
- `findAppRoot(startingPath)`: recursively searches up the directory tree from `startingPath` to find the project root directory (using `isRootFolder`).
- `saveResultToFile(filePath, content)`: writes `content` to a file at `filePath`, creating any necessary directories in the process.
- `readFilesContents(filePaths)`: returns an array of objects, each containing a file path and its contents, for an array of file paths.

## Description
`file-utils.js` is a module containing utility functions for working with files and directories in a Node.js project. All functions are exported and can be used individually as needed. These functions are useful for tasks such as finding files, reading and writing files, and determining the project root directory. The module depends on the built-in Node.js modules `fs` and `path`, as well as the `error-handler-validation.js` module in the same project.