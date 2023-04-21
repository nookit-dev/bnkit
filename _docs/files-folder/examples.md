### Example usage of the "getFilesForDirectory" function

```typescript
import { getFilesForDirectory } from "./file-utils";

// Get files in "_tests" directory, ignoring files named "test1" and "test2"
const files = getFilesForDirectory("_tests", { ignoreFiles: ["test1", "test2"] });

if (files?.length) {
  console.log(files); // ["file1", "file2", ...]
} else {
  console.log("No files found in directory");
}
```

### Example usage of the "getFilesForDirectoryFromRoot" function

```typescript
import { getFilesForDirectoryFromRoot } from "./file-utils";

// Get files in "_apps" directory of the root folder, ignoring files named "app1" and "app2"
const files = getFilesForDirectoryFromRoot("_apps", { ignoreFiles: ["app1", "app2"] });

if (files?.length) {
  console.log(files); // ["file1", "file2", ...]
} else {
  console.log("No files found in directory");
}
```

### Example usage of the "saveResultToFile" function

```typescript
import { saveResultToFile } from "./file-utils";

const filePath = "./results/result1.txt";
const content = "This is the content to save to the file.";

saveResultToFile(filePath, content)
  .then(() => console.log("File saved successfully"))
  .catch((err) => console.error(`Error saving file: ${err}`));
```

### Example usage of the "readFilesContents" function

```typescript
import { readFilesContents } from "./file-utils";

const filePaths = ["./file1.txt", "./file2.txt", "./file3.txt"];

const files = readFilesContents(filePaths);

if (files?.length) {
  console.log(files[0].path); // "file1.txt"
  console.log(files[0].content); // "This is the content of file1"

  console.log(files[1].path); // "file2.txt"
  console.log(files[1].content); // "This is the content of file2"

  console.log(files[2].path); // "file3.txt"
  console.log(files[2].content); // "This is the content of file3"
} else {
  console.log("No files found");
}
```