# Examples of Using this Module

### Example 1: Getting User Input
```typescript
import { getUserInput } from "your-module-name";

async function main() {
  const userInput = await getUserInput();
  console.log(userInput);
}

main();
```

### Example 2: Parsing Command Line Arguments
```typescript
import { parseCliArgs } from "your-module-name";

async function main() {
  const parsedArgs = await parseCliArgs();
  console.log(parsedArgs);
}

main();
```

### Example 3: Creating a File with Content
```typescript
import { createFileWithContent } from "your-module-name";

function main() {
  const filePath = "/path/to/my/file.txt";
  const fileContent = "Hello, world!";
  createFileWithContent(filePath, fileContent);
}

main();
```

### Example 4: Ensuring a Directory Exists
```typescript
import { directoryExists } from "your-module-name";

function main() {
  const directoryPath = "/path/to/my/directory";
  directoryExists(directoryPath);
}

main();
```

### Example 5: Getting Module Names from a Path
```typescript
import { getModulesFromPath } from "your-module-name";

function main() {
  const directoryPath = "/path/to/my/modules";
  const moduleNames = getModulesFromPath(directoryPath);
  console.log(moduleNames);
}

main();
```