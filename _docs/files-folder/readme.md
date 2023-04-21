# File System Module

This module provides utility functions for working with the file system in Node.js. 

## Functions

### `getFilesForDirectory(directory: string, options?: { ignoreFiles?: string[] }): string[] | undefined`

Returns an array of file names in the given directory. Can optionally ignore certain files specified in `options.ignoreFiles`.

### `getFilesForDirectoryFromRoot(directory: string, options?: { ignoreFiles?: string[] }): string[] | undefined`

Returns an array of file names in the given directory, relative to the project root directory. Can optionally ignore certain files specified in `options.ignoreFiles`.

### `findAppRoot(startingPath: string): string | null | undefined`

Returns the root directory of the current Node.js project, starting from the given path.

### `saveResultToFile(filePath: string, content: string): Promise<void> | undefined`

Writes the given content to the specified file path. Creates any necessary directories in the process.

### `readFilesContents(filePaths: string[]): { path: string; content: string }[] | undefined`

Returns an array of objects, each containing a file path and its contents, for the given array of file paths.


## Usage

```typescript
import { getFilesForDirectory, getFilesForDirectoryFromRoot, saveResultToFile, readFilesContents } from "file-system-module";

const appFiles = getFilesForDirectory("_apps", { ignoreFiles: ["test.ts"] });
console.log(appFiles); // ["app1", "app2", "app3"]

const rootFiles = getFilesForDirectoryFromRoot("_tests");
console.log(rootFiles); // ["test1", "test2", ...]

const rootPath = findAppRoot(process.cwd());
console.log(rootPath); // "/path/to/project/root"

const filePath = "./output/results.txt";
await saveResultToFile(filePath, "Results:\n- item1\n- item2\n");
console.log("Results saved to file");

const fileContents = readFilesContents(["./file1.txt", "./file2.txt"]);
console.log(fileContents); // [{ path: "file1.txt", content: "File 1 contents" }, { path: "file2.txt", content: "File 2 contents" }]
```

## License

This module is licensed under the MIT License.