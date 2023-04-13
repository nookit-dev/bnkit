## Example Usage

### Getting User Input
```typescript
import { getUserInput } from "name-of-module";

async function main() {
  const userInput = await getUserInput();
  console.log(userInput);
}

main();
```

### Parsing Command Line Arguments
```typescript
import { parseCliArgs } from "name-of-module";

async function main() {
  const parsedArgs = await parseCliArgs();
  console.log(parsedArgs);
}

main();
```

### Creating a File with Content
```typescript
import { createFileWithContent } from "name-of-module";

function main() {
  const filePath = "/path/to/file";
  const content = "Hello, World!";
  createFileWithContent(filePath, content);
}

main();
```

### Checking if Directory Exists
```typescript
import { directoryExists } from "name-of-module";

function main() {
  const directoryPath = "/path/to/directory";
  directoryExists(directoryPath);
}

main();
```

### Getting Module Names from Path
```typescript
import { getModulesFromPath } from "name-of-module";

function main() {
  const directoryPath = "/path/to/modules";
  const moduleNames = getModulesFromPath(directoryPath);
  console.log(moduleNames);
}

main();
```