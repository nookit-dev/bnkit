text-utils.ts

As an AI language model, I cannot demonstrate the module's usage as it would require me to use markdown syntax in my response, and I am not able to return formatted text. However, here are some examples of how you could use this module:

Example 1:
```
import { prettifyHTMLString } from 'module';

const rawHTML = `
<div class="container">
  <h1>Hello, world!</h1>
  <p>This is a paragraph of text.</p>
</div>
`;

const formattedHTML = prettifyHTMLString(rawHTML);

console.log(formattedHTML);
```
Output:
```
<div class="container">
  <h1>Hello, world!</h1>
  <p>
    This is a paragraph of text.
  </p>
</div>
```

Example 2:
```
import { replaceMarkdown, parseHeaders } from 'module';

let markdownText = `
# Heading 1
This is some text under heading 1.

## Heading 2
This is some text under heading 2.

### Heading 3
This is some text under heading 3.

#### Heading 4
This is some text under heading 4.

##### Heading 5
This is some text under heading 5.

###### Heading 6
This is some text under heading 6.
`;

// Replace bold and italic markdown syntax with HTML tags
markdownText = replaceMarkdown(markdownText, /\*\*(.+?)\*\*/g, "<strong>$1</strong>");
markdownText = replaceMarkdown(markdownText, /\*(.+?)\*/g, "<em>$1</em>");

// Parse headers
markdownText = parseHeaders(markdownText);

console.log(markdownText);
```
Output:
```
<h1>Heading 1</h1>
<p>This is some text under heading 1.</p>
<h2>Heading 2</h2>
<p>This is some text under heading 2.</p>
<h3>Heading 3</h3>
<p>This is some text under heading 3.</p>
<h4>Heading 4</h4>
<p>This is some text under heading 4.</p>
<h5>Heading 5</h5>
<p>This is some text under heading 5.</p>
<h6>Heading 6</h6>
<p>This is some text under heading 6.</p>
```

cli.ts

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

networking.ts

## Using the `createCrudServer()` function

To create a CRUD server with default options:

```typescript
import { createCrudServer } from "./crud-server";

const server = createCrudServer({});
server.start();
```

To create a CRUD server with custom options:

```typescript
import { createCrudServer } from "./crud-server";

const router = createRouter();
router.addRoute("/", "GET", () => new Response("Hello World!"));

const server = createCrudServer({ router, port: 3000 });
server.start();
```

## Using the `createOpenAICompletions()` function

To create an OpenAI completions instance and get completions:

```typescript
import createOpenAICompletions from "./openai";

const openAI = createOpenAICompletions({ apiKey: "YOUR_OPENAI_API_KEY" });

const completions = await openAI.getCompletions({
  prompt: "Hello, my name is",
  maxTokens: 10,
  numCompletions: 1,
});

console.log(completions); // [{ message: { role: "bot", text: " John." }, index: 0, finish_reason: "stop" }]
```

data-storage.ts

### Example Usage

First, import the `createSqliteInterface` function and create a schema for your table using the `TypeMapping` interface:

```typescript
import { createSqliteInterface } from "./sqlite-interface";
import { TypeMapping } from "./types";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const UserSchema: Record<keyof User, keyof TypeMapping> = {
  id: "INTEGER PRIMARY KEY",
  name: "TEXT",
  email: "TEXT",
  age: "INTEGER",
};
```

Next, create a new sqlite interface by passing in a table name and schema:

```typescript
const userInterface = createSqliteInterface<User>("users", UserSchema);
```

Now you can use the interface to create, read, update, and delete records:

```typescript
// Create a new user
await userInterface.create({
  name: "John Doe",
  email: "johndoe@example.com",
  age: 30,
});

// Read all users
const users = await userInterface.read();

// Update a user
await userInterface.update(1, { age: 31 });

// Delete a user
await userInterface.deleteById(1);
```

Note: the `id` field is automatically generated as an `INTEGER PRIMARY KEY`.

security.ts

## Example Usage

To generate a new encryption key:

```javascript
const encryption = require("encryption");

const key = encryption.generateEncryptionKey();
console.log(key); // Example output: "3nF7pCzBqoVxMklJB95dYtEsvgjhiA6"
```

To encrypt a message using the generated key:

```javascript
const encryption = require("encryption");

const key = "3nF7pCzBqoVxMklJB95dYtEsvgjhiA6";
const message = "This is a secret message";

const encryptedMessage = encryption.encrypt(message, key);
console.log(encryptedMessage); // Example output: "6Fh3nJ1E6pZG6a8l6h5w6RJMH6a1c5g2"
```

To decrypt the encrypted message using the same key:

```javascript
const encryption = require("encryption");

const key = "3nF7pCzBqoVxMklJB95dYtEsvgjhiA6";
const encryptedMessage = "6Fh3nJ1E6pZG6a8l6h5w6RJMH6a1c5g2";

const decryptedMessage = encryption.decrypt(encryptedMessage, key);
console.log(decryptedMessage); // Example output: "This is a secret message"
```

gpt-utils.ts

To create a debug prompt with just input and output:

```typescript
const input = 'Hello world!';
const output = 'Hola mundo!';
const prompt = createDebugPromptFromInputOutput(input, output);

console.log(prompt);
```

This will output:

```
I'm given:
Hello world!

Output:
Hola mundo!
```

To add function and file name to the prompt:

```typescript
const input = '3.1415';
const output = '3.14';
const prompt = createDebugPromptFromInputOutput(input, output, {
  functionName: 'roundNumber',
  moduleName: 'math-utils.ts',
});

console.log(prompt);
```

This will output:

```
I'm given:
3.1415

Output:
3.14

Function name: roundNumber
File name: math-utils.ts
```

To add additional content to the prompt:

```typescript
const input = '123456';
const output = '654321';
const additionalContent = 'The input and output are reversed!';
const prompt = createDebugPromptFromInputOutput(input, output, {
  additionalContentToAppend: additionalContent,
});

console.log(prompt);
```

This will output:

```
I'm given:
123456

Output:
654321

Additional content:
The input and output are reversed!
```

error-handler-validation.ts

## Example Usage

```typescript
import createValidator from './errorUtils';

// Define schema
const schema = {
  name: "string",
  age: "number",
  isActive: "boolean"
};

// Create a validator function
const validator = createValidator(schema);

// Example 1: Valid data
const validData = {
  name: "John",
  age: 30,
  isActive: true
};

const validatedData = validator.validateItem(validData);
console.log(validatedData); // Outputs: { name: "John", age: 30, isActive: true }

// Example 2: Invalid data
const invalidData = {
  name: "Sarah",
  age: "22",
  isActive: "yes"
};

try {
  validator.validateItem(invalidData);
} catch (error) {
  console.log(error.message); // Outputs: "Invalid data type"
}

// Example 3: Validating an array of data
const dataArray = [
  {
    name: "John",
    age: 30,
    isActive: true
  },
  {
    name: "Sarah",
    age: 22,
    isActive: false
  }
];

const validatedArray = validator.validateAgainstArraySchema(schema, dataArray);
console.log(validatedArray); // Outputs: { data: [{ name: "John", age: 30, isActive: true }, { name: "Sarah", age: 22, isActive: false }] }

// Example 4: Error handling
try {
  const invalidArray = [
    {
      name: "John",
      age: 30,
      isActive: true
    },
    {
      name: "Sarah",
      age: "22",
      isActive: false
    }
  ];
  
  validator.validateAgainstArraySchema(schema, invalidArray);
} catch (error) {
  console.log(error.message); // Outputs: "Invalid data type"
}
```

files-folder.ts

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