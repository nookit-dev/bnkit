## Examples

### Example 1: Get files for a specific directory

```typescript
import { getFilesForDirectory } from "./file-utils";

// Get all files in the "_apps" directory, except for "index" and "config"
const files = getFilesForDirectory("_apps", { ignoreFiles: ["index", "config"] });
console.log(files);
// Output: ["home", "search", "profile", "settings"]
```

### Example 2: Get files from root directory

```typescript
import { getFilesForDirectoryFromRoot } from "./file-utils";

// Get all files in the "_tests" directory of the root directory, except for "index" and "config"
const files = getFilesForDirectoryFromRoot("_tests", { ignoreFiles: ["index", "config"] });
console.log(files);
// Output: ["test1", "test2", "test3"]
```

### Example 3: Save result to file

```typescript
import { saveResultToFile } from "./file-utils";

const result = "This is a sample result";
const filePath = "./results/sample.txt";

// Save the result to the file path
saveResultToFile(filePath, result);
// A file named "sample.txt" with the content "This is a sample result" is created in the "results" directory
```