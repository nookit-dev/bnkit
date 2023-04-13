### Example Usage

#### Get Files for Directory
```typescript
import { getFilesForDirectory } from 'module-name';

// Get files for current directory and ignore "config" file
const filesInCurrentDirectory = getFilesForDirectory(".", { ignoreFiles: ["config"] });
console.log(filesInCurrentDirectory); // ["file1", "file2", "file3"]

// Get files for "_apps" directory and ignore "app2" file
const filesInAppsDirectory = getFilesForDirectory("_apps", { ignoreFiles: ["app2"] });
console.log(filesInAppsDirectory); // ["app1", "app3"]
```

#### Get Files for Directory from Root
```typescript
import { getFilesForDirectoryFromRoot } from 'module-name';

// Get files for "_tests" directory from project root and ignore "test2" file
const filesInTestsDirectory = getFilesForDirectoryFromRoot("_tests", { ignoreFiles: ["test2"] });
console.log(filesInTestsDirectory); // ["test1", "test3"]
```

#### Save Result to File
```typescript
import { saveResultToFile } from 'module-name';

const result = "Some data to be saved to a file.";
await saveResultToFile("output.txt", result);
// Console output: "Successfully saved result to output.txt"
```

Note: These examples assume that the module has been properly imported and installed in the project. The module's name will need to be replaced with the actual module name.