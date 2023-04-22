## Functions

### `getFilesForDirectory(directory: string, { ignoreFiles }: { ignoreFiles?: string[] } = {}): string[]|undefined`

- **Input**: 
  - `directory`: A string representing the directory path to retrieve the files from.
  - `ignoreFiles`: An optional array of strings representing the filenames to exclude from the returned array.
- **Output**: An array of strings representing the filenames in the specified directory that were not ignored.
- **Description**: Retrieves the filenames in the specified directory and filters out any ignored files.

### `getFilesForDirectoryFromRoot(directory: string, { ignoreFiles }: { ignoreFiles?: string[] } = {}): string[]|undefined`

- **Input**: 
  - `directory`: A string representing the directory path to retrieve the files from, relative to the root path.
  - `ignoreFiles`: An optional array of strings representing the filenames to exclude from the returned array.
- **Output**: An array of strings representing the filenames in the specified directory that were not ignored.
- **Description**: Retrieves the filenames in the specified directory, relative to the app root path, and filters out any ignored files.

### `isRootFolder(folderPath: string): boolean|undefined`

- **Input**: A string representing a directory path.
- **Output**: A boolean indicating whether the given directory is the root folder of an app.
- **Description**: Checks if the given directory is the root folder of an app by checking if the `tsconfig.json` file exists in that path.

### `findAppRoot(startingPath: string): string|null|undefined`

- **Input**: A string representing a directory path.
- **Output**: A string representing the app root directory path, or `null` if not found.
- **Description**: Recursively checks the given directory and its parents until it finds the root directory of an app.

### `saveResultToFile(filePath: string, content: string): Promise<void>|undefined`

- **Input**: 
  - `filePath`: A string representing the path to the file to be saved.
  - `content`: A string representing the content to be saved in the file.
- **Output**: A promise that resolves when the file is saved successfully, or `undefined` if an error occurs.
- **Description**: Saves the given content to the specified file.

### `readFilesContents(filePaths: string[]): { path: string; content: string }[]|undefined`

- **Input**: An array of strings representing the paths to the files to be read.
- **Output**: An array of objects, each containing a `path` and `content` property representing the file name and content respectively.
- **Description**: Reads the contents of the files in the specified paths and returns them as an array of objects containing the filename and content.