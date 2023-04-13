This module consists of several functions for working with files and directories:

- `getFilesForDirectory(directory, options)`: returns an array of filenames in the specified directory, excluding those listed in the `ignoreFiles` option.
- `getFilesForDirectoryFromRoot(directory, options)`: similar to the above function, but starts from the root of the project rather than the current working directory.
- `isRootFolder(folderPath)`: returns true if the given folder contains a `tsconfig.json` file.
- `findAppRoot(startingPath)`: searches upwards from the given starting path to find the root of the project (i.e. the folder containing the `tsconfig.json` file).
- `saveResultToFile(filePath, content)`: writes the given content to the specified file path.

Exports:

- `getFilesForDirectory`
- `getFilesForDirectoryFromRoot`
- `isRootFolder`
- `findAppRoot`
- `saveResultToFile`