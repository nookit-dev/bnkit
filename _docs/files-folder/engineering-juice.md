## Module Functions

### `getFilesForDirectory(directory: string, options: { ignoreFiles?: string[] }): string[] | undefined`
- Input
    - `directory`: Directory path to retrieve files from
    - `options`: Object containing an optional array of file names to ignore
- Output
    - Array of file names in the specified directory, with ignored files excluded
- Description
    - Retrieves all file names in the specified directory, filters out ignored files, and returns an array of the remaining file names.

### `getFilesForDirectoryFromRoot(directory: string, options: { ignoreFiles?: string[] }): string[] | undefined`
- Input
    - `directory`: Directory path to retrieve files from, relative to the root directory of the application
    - `options`: Object containing an optional array of file names to ignore
- Output
    - Array of file names in the specified directory, relative to the application's root, with ignored files excluded
- Description
    - Calls `findAppRoot` to determine the root directory of the application, then constructs the absolute path to the specified relative directory from the root, retrieves all file names in that directory, filters out ignored files, and returns an array of the remaining file names.

### `isRootFolder(folderPath: string): boolean | undefined`
- Input
    - `folderPath`: Path to a directory
- Output
    - Boolean value representing whether the specified directory is an application root directory
- Description
    - Determines if the specified directory is an application root directory by checking for the existence of a `tsconfig.json` file in that directory.

### `findAppRoot(startingPath: string): string | null | undefined`
- Input
    - `startingPath`: Absolute or relative path to a directory
- Output
    - Absolute path to the application's root directory, or `null` if it could not be found
- Description
    - Traverses up the directory tree from `startingPath` until an application root directory is found (by calling `isRootFolder`), then returns the absolute path to that directory.

### `saveResultToFile(filePath: string, content: string): Promise<void> | undefined`
- Input
    - `filePath`: Path to the file to write to
    - `content`: Contents to write to the file
- Output
    - Promise resolving to `undefined` if the file was successfully written to
- Description
    - Creates any directories in the file path that don't already exist, then writes `content` to the specified file.

### `readFilesContents(filePaths: string[]): { path: string; content: string }[] | undefined`
- Input
    - `filePaths`: Array of file paths to read from
- Output
    - Array of objects with `path` and `content` properties, containing the file name and contents, respectively, for each file in `filePaths`
- Description
    - Reads the contents of each file in `filePaths`, returning an array of objects containing the file name and contents of each file.