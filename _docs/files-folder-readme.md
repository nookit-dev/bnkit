# File System Utility

A Node.js module for interacting with the file system.

## Usage

### `getFilesForDirectory(directory: string, options?: { ignoreFiles?: string[] }): string[]`

Returns an array of file names (without extensions) for the specified directory. The `ignoreFiles` option allows you to exclude certain files from the result.

### `getFilesForDirectoryFromRoot(directory: string, options?: { ignoreFiles?: string[] }): string[]`

Returns an array of file names (without extensions) for the specified directory, using the project's root directory as the base. The `ignoreFiles` option allows you to exclude certain files from the result.

### `saveResultToFile(filePath: string, content: string): void`

Writes the specified content to a file at the specified path. Returns a Promise that resolves when the operation is complete.

## Example

```js
import { getFilesForDirectoryFromRoot, saveResultToFile } from "file-system-utility";

const appFiles = getFilesForDirectoryFromRoot("_apps");
const content = JSON.stringify(appFiles, null, 2);
await saveResultToFile("app-files.json", content);
```

## License

This project is licensed under the [MIT License](LICENSE).