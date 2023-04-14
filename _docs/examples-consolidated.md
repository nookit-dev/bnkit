_docs/text-utils/examples.md

Sure, here are some examples of how to use the provided functions to convert markdown to HTML:

Input: "This is **bold** text."
Output: "This is <strong>bold</strong> text."

Input: "Here is a [link](https://www.google.com) to Google."
Output: "Here is a <a href='https://www.google.com'>link</a> to Google."

Input: 
```
# Heading 1
## Heading 2
### Heading 3
```
Output: 
```
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
```

Input:
```
- First item
- Second item
- Third item
```
Output:
```
<ul>
<li>First item</li>
<li>Second item</li>
<li>Third item</li>
</ul>
```

Input:
```
1. First item
2. Second item
3. Third item
```
Output:
```
<ol>
<li>First item</li>
<li>Second item</li>
<li>Third item</li>
</ol>
```

Note: the `templatineEngine` object appears to be empty and does not have any functionality.

_docs/cli/examples.md

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

_docs/networking/examples.md

# Examples of Using the CRUD Server Module

## Creating a Server

To create a CRUD server, first import the `createCrudServer` method from the module:

```javascript
import { createCrudServer } from "./crud-server";
```

Then, call the method with optional parameters:

```javascript
const server = createCrudServer({
  router,
  port: 4000,
});
```

Here, the `router` parameter is an optional `ServerRouter` object that you can use to handle requests for frontend pages. The `port` parameter sets the port number for the server. If not provided, it defaults to 4000.

## Adding Routes

To add routes to the server, you can call the `addRoute` method on the `ServerRouter` object. For example:

```javascript
const router = createRouter();

router.addRoute("/", "GET", (req: Request) => {
  return new Response("Hello, world!");
});
```

Here, a route is added to handle GET requests to the root URL path. The handler function returns a new Response object with a "Hello, world!" message.

## Handling Requests

To handle requests, call the `handleRequest` method on the `ServerRouter` object or provide a fetch method to the `serve()` function. For example:

```javascript
const server = serve({
  port: port ? `:${port}` : ":4000",
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    try {
      if (url.pathname.startsWith("/api")) {
        // Handle API routes
      } else {
        // Handle frontend pages
        const handler = router && router[url.pathname];
        if (handler) {
          const response = await handler(req);
          return response;
        }
      }
    } catch (error) {
      // Handle errors
    }

    return new Response("Not found", { status: 404 });
  },
});
```

Here, the `fetch` method is provided to the `serve()` function to handle all incoming requests. If the request URL path starts with "/api", API routes are handled. Otherwise, router handlers are used to handle frontend pages. If an error occurs, it is handled according to the `handleError` method provided by the module.

## Creating OpenAI Completions

To create OpenAI completions, first import the `createOpenAICompletions` method from the module:

```javascript
import createOpenAICompletions from "./crud-server";
```

Then, call the method with an `apiKey` parameter and use the returned object to get completions:

```javascript
const openai = createOpenAICompletions<{ choices: CompletionChoice[] }>({
  apiKey: "your-api-key-here",
});

const completions = await openai.getCompletions({
  prompt: "What is the meaning of life?",
  maxTokens: 50,
  numCompletions: 1,
});
```

Here, the `getCompletions` method is called with a prompt and optional parameters for `maxTokens` and `numCompletions`. The method returns an array of `CompletionChoice` objects with the completed text. The `apiKey` parameter is required to authenticate with the OpenAI API.

_docs/data-storage/examples.md

### Example Usage

Assuming we have a schema for a `users` table with `id` (integer), `name` (string), and `age` (integer) fields:

```javascript
import { createSqliteInterface } from "./sqlite-interface";

const userInterface = createSqliteInterface("users", {
  id: "integer",
  name: "text",
  age: "integer",
});

// Create a new user
await userInterface.create({ id: 1, name: "John Doe", age: 30 });

// Read all users
const allUsers = await userInterface.read();
console.log(allUsers); // [{ id: 1, name: "John Doe", age: 30 }]

// Update a user by id
await userInterface.update(1, { age: 31 });

// Delete a user by id
await userInterface.deleteById(1);
```

_docs/types/examples.md

### Example 1: Validating Data

```
// Define a schema
const mySchema = {
  name: "string",
  age: "number",
  active: "boolean"
};

// Validate data against schema
const dataToValidate = [
  { name: "John", age: 30, active: true },
  { name: "Jane", age: "not a number", active: false },
  { name: 123, age: 25, active: "not a boolean" }
];

const validationResult: ValidationResult<typeof mySchema> = {
  data: dataToValidate.map((d) => infer(mySchema, d)),
  error: "Invalid data type for age and active fields in second and third records"
};
```

### Example 2: Inferring Data Types

```
// Define a schema
const mySchema = {
  name: "string",
  age: "number",
  active: "boolean",
  createdAt: "date"
};

// Infer data types from an object
const myData = {
  name: "John",
  age: 30,
  active: true,
  createdAt: new Date("2022-02-22")
};

const inferredData = infer(mySchema, myData);

// inferredData: {
//   name: string;
//   age: number;
//   active: boolean;
//   createdAt: Date;
// }
```

_docs/security/examples.md

## Examples of Using generateEncryptionKey() function

### Example 1:
```javascript
const encryptionKey = generateEncryptionKey();
console.log(encryptionKey);
```

Output:
```
sTlo4fx7sOwc2JmaV8yKtDgBe1pZkNhu
```


### Example 2:
```javascript
const encryptionKey = generateEncryptionKey();
console.log(`Your encryption key is: ${encryptionKey}`);
```

Output:
```
Your encryption key is: S5mLk1D6XgWcUzRvPtj0HfMwox8ZybC
```


### Example 3:
```javascript
const encryptionKey = generateEncryptionKey();
const encryptedData = encryptData('Hello World', encryptionKey);
const decryptedData = decryptData(encryptedData, encryptionKey);
console.log(`Original data: Hello World`);
console.log(`Encrypted data: ${encryptedData}`);
console.log(`Decrypted data: ${decryptedData}`);
```

Output:
```
Original data: Hello World
Encrypted data: 4edf29bbae80bb7ff0e677381d9a47efa48f8931b7f4b503c8e8eaed7870c0b7
Decrypted data: Hello World
```

_docs/gpt-utils/examples.md

### Example 1

```typescript
const input = "hello";
const output = "olleh";
const options = {
  functionName: "reverseString",
  moduleName: "stringUtils.ts",
  additionalContentToAppend: "This function is used to reverse a string.",
};

const debugPrompt = createDebugPromptFromInputOutput(input, output, options);

console.log(debugPrompt);
```

This will output:

```
I'm given:
hello

Output:
olleh

Function name: reverseString
File name: stringUtils.ts

Additional content:
This function is used to reverse a string.
```

### Example 2

```typescript
const input = "hello";
const output = "hello";
const options = {
  functionName: "capitalizeString",
  moduleName: "stringUtils.ts",
};

const debugPrompt = createDebugPromptFromInputOutput(input, output, options);

console.log(debugPrompt);
```

This will output:

```
I'm given:
hello

Output:
hello

Function name: capitalizeString
File name: stringUtils.ts
```

### Example 3

```typescript
const input = "10, 20, 30";
const output = "60";
const options = {
  additionalContentToAppend:
    "This is the output of adding the numbers in the input string.",
};

const debugPrompt = createDebugPromptFromInputOutput(input, output, options);

console.log(debugPrompt);
```

This will output:

```
I'm given:
10, 20, 30

Output:
60

Additional content:
This is the output of adding the numbers in the input string.
```

_docs/error-handler-validation/examples.md

Example usage of the `errorUtils` module:

```typescript
import createValidator from "./validator";
import { CustomError, apiErrorMap } from "./errorUtils";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const userSchema = {
  id: "number",
  name: "string",
  email: "string",
  age: "number",
};

const validator = createValidator(userSchema);

function getUsers(): User[] {
  try {
    const rawData = fetch("https://myapi.com/users").then((res) => res.json());
    const validatedData = validator.validateAgainstArraySchema(userSchema, rawData);
    return validatedData.data;
  } catch (error) {
    const handledError = handleError(error);
    if (handledError) {
      const apiError = {
        type: "APIError",
        message: apiErrorMap[handledError.type] ?? handledError.message,
      } as CustomError;
      throw apiError;
    }
  }
}
```

In the example above, we first define a schema for our "User" object, which specifies the expected types for each property. We then use the `createValidator` function to create a validator object that we can use to validate data against this schema.

In the `getUsers` function, we first fetch some raw data from an external API, and then pass it through our validator using the `validateAgainstArraySchema` method. If any validation errors occur, we catch them and convert them into a more user-friendly "APIError" object using the `handleError` function and the `apiErrorMap` object.

Note that since `handleError` function can return `undefined`, we need to check for this when creating our "APIError" object. We do this using the nullish coalescing operator (`??`), which returns the value on the left if it is not null or undefined, and the value on the right otherwise.

_docs/files-folder/examples.md

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