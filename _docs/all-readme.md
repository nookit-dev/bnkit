text-utils.ts

# HTML and Markdown Prettifier Module

This module provides functions to prettify HTML strings and convert markdown elements to HTML tags.

## Functions

### `prettifyHTMLString(rawHTML: string): string`

Given a raw HTML string, this function returns a formatted HTML string with properly indented tags.

### `replaceMarkdown(text: string, regex: RegExp, replacement: string): string`

Given a string of text, a regular expression, and a replacement string, this utility function returns a modified string with the matched regular expression replaced by the replacement string.

### `parseHeaders(text: string): string`

Given a string of text, this utility function converts markdown headers to HTML headers.

## Utility Functions

### `parseBold(text: string): string`

Given a string of text, this utility function converts markdown bold syntax to HTML strong tags.

### `parseItalic(text: string): string`

Given a string of text, this utility function converts markdown italic syntax to HTML em tags.

### `parseLinks(text: string): string`

Given a string of text, this utility function converts markdown link syntax to HTML anchor tags.

### `parseUnorderedLists(text: string): string`

Given a string of text, this utility function converts markdown unordered list syntax to HTML unordered list tags.

### `parseOrderedLists(text: string): string`

Given a string of text, this utility function converts markdown ordered list syntax to HTML ordered list tags.

## Exported Objects

### `useMdToHtml()`

This object returns the above utility functions as methods for easy use.

cli.ts

# Module README

This module contains various utility functions for handling file operations and command line argument parsing in a Node.js environment.

## Functions

### `getUserInput()`

Gets user input asynchronously and returns a Promise that resolves with the input as a string.

### `parseCliArgs()`

Parses the command line arguments and returns a Promise that resolves with an object containing key-value pairs of the parsed arguments.

### `createFileWithContent(filePath: string, content: string)`

Ensures the directory exists and creates a file at the specified `filePath` with the given `content`.

### `ensureDirectoryExists(directoryPath: string)`

Ensures that the specified `directoryPath` exists.

### `getModulesFromPath(directoryPath: string)`

Gets the names of modules from the specified `directoryPath`.

networking.ts

# Bun Server Utils

A collection of utilities for building servers with [Bun](https://github.com/ninpeng/bun).

## Installation

```
npm install @openai/bun-server-utils
```

## Usage

### Fetcher

The `createFetcher` function provides a simple utility for making API requests and handling errors, including validation errors.

```typescript
import { createFetcher } from "@openai/bun-server-utils";

type Post = {
  title: string;
  body: string;
};

const fetchPosts = createFetcher<Post[]>();

// Usage:
const posts = await fetchPosts("https://jsonplaceholder.typicode.com/posts", {
  method: "GET",
});
```

### Router

The `createRouter` function provides a basic router implementation for handling HTTP requests.

```typescript
import { createRouter } from "@openai/bun-server-utils";

const router = createRouter();

router.addRoute("/test", "GET", (req) => {
  return new Response("Test route", { status: 200 });
});

// Usage:
const response = router.handleRequest(new Request("/test"));
```

### CRUD Server

The `createCrudServer` function builds a basic CRUD server with API and router functionality.

```typescript
import { createCrudServer } from "@openai/bun-server-utils";

type UserSchema = {
  id: number;
  name: string;
  email: string;
};

const crudServer = createCrudServer<UserSchema>({
  id: "number",
  name: "string",
  email: "string",
});

crudServer.router["/api/users/create"] = async (req) => {
  const user = (await req.json()) as UserSchema;
  // TODO: Add create logic
  return new Response("Created", { status: 201 });
};

// Usage:
const server = crudServer.start();
```

### OpenAI Completions

The `createOpenAICompletions` function provides a simple utility for interacting with the OpenAI Completions API.

```typescript
import { createOpenAICompletions } from "@openai/bun-server-utils";

const openaiCompletions = createOpenAICompletions<{ message: string }>({
  apiKey: "MY_API_KEY",
});

// Usage:
const completions = await openaiCompletions.getCompletions({
  prompt: "Hello, my name is",
  numCompletions: 5,
  maxTokens: 25,
});
```

data-storage.ts

# SQLite Interface Module

This is a Node.js module for interacting with an SQLite database using a simple interface that supports CRUD operations.

## Installation

Install the module using npm:

```
npm install sqlite-interface
```

## Usage

### Basic Setup

Create a new instance of the database interface by calling `createSqliteInterface` with a table name and schema definition. The schema definition should be an object where the keys are the field names and the values are the corresponding data types. Supported data types are `"string"`, `"number"`, `"boolean"`, and `"datetime"`. 

```javascript
const { createSqliteInterface } = require('sqlite-interface');

const schema = {
  id: 'number',
  name: 'string',
  email: 'string',
  age: 'number'
};

const users = createSqliteInterface('users', schema);
```

### Create

To create a new item in the database, call the `create` function with an object that contains the field values for the new item.

```javascript
await users.create({
  name: 'John',
  email: 'john@example.com',
  age: 30
});
```

### Read

To read all items from the database, call the `read` function.

```javascript
const allUsers = await users.read();
```

### Update

To update an item in the database, call the `update` function with the ID of the item to update and an object that contains the fields to update.

```javascript
await users.update(1, { age: 31 });
```

### Delete

To delete an item from the database, call the `deleteById` function with the ID of the item to delete.

```javascript
await users.deleteById(1);
```

## License

This module is licensed under the MIT License.

types.ts

# Type Mapping Utility

This module provides a utility for defining a type mapping and validating data against a schema. It also includes a type inference function to automatically infer TypeScript types based on a given schema.

## Usage

Start by defining your schema:

```typescript
const schema = {
  id: 'number',
  name: 'string',
  isVerified: 'boolean',
  createdAt: 'date'
}
```

Then, you can validate data against this schema using the `ValidationResult` type and the `TypeInference` utility type:

```typescript
import { TypeInference, ValidationResult } from 'type-mapping-utility';

type MyData = TypeInference<typeof schema>;

const data: unknown = {
  id: 1,
  name: 'John Doe',
  isVerified: true,
  createdAt: new Date()
};

const result: ValidationResult<typeof schema> = {
  data: [data as MyData]
};
```

You can also use the `infer` function to automatically infer TypeScript types based on the schema:

```typescript
const myData = infer(schema, data);
// myData is of type MyData: { id: number, name: string, isVerified: boolean, createdAt: Date }
```

## API

### `TypeMapping`

A type mapping defines the mapping between string type names and their actual types. By default, the following type mapping is defined:

```typescript
type TypeMapping = {
  string: string;
  number: number;
  boolean: boolean;
  date: Date;
};
```

### `TypeInference<Schema>`

This utility type automatically infers TypeScript types based on a given schema. It takes a `Schema` type, which is a record of keys (string) and values (string literals representing the types from the `TypeMapping`).

### `ValidationResult<Schema>`

This type represents the result of validating data against a schema. It can either have an `error` property if the validation failed, or a `data` property containing the validated data.

### `SchemaType`

This is a type alias for a record with string keys and values that match the keys from the `TypeMapping`.

### `infer<Schema>(schema: Schema, data?: unknown): TypeInference<Schema>`

This function infers TypeScript types based on the given schema and data. It takes a `schema` argument of type `SchemaType` and an optional `data` argument of type `unknown`. Returns an object of inferred TypeScript types based on the schema.

## Installation

This module is available as an npm package:

```
npm install type-mapping-utility
```

security.ts

# Encryption Key Generator

This module exports a function `generateEncryptionKey` which generates a string of length 32 containing random characters from the set of uppercase and lowercase alphabets and numbers. 

## Installation

This module can be installed from NPM using the following command:

```
npm install encryption-key-generator
```

## Usage

```
const generateEncryptionKey = require('encryption-key-generator');

const key = generateEncryptionKey();
console.log(key);
// Output: "sldjflsghdfnlkfgds8w36498ryfhsd"
```

## API

### generateEncryptionKey()

This function generates and returns a string of length 32 containing random characters from the set of uppercase and lowercase alphabets and numbers.

## License

MIT

gpt-utils.ts

# Debug Prompt Module

This module exports the following:

- `DebugPromptOptions` type
- `createDebugPromptFromInputOutput` function

## DebugPromptOptions

This is a type that serves as the shape for the options object passed into `createDebugPromptFromInputOutput` function. It has the following optional properties:

- `functionName` (string): Name of the function being debugged
- `moduleName` (string): Name of the module/file containing the function being debugged
- `additionalContentToAppend` (string): Additional content that should be appended to the debug prompt

## createDebugPromptFromInputOutput

This is a function that takes three arguments:

- `input` (string): The input passed into the function being debugged
- `output` (string): The output of the function being debugged
- `options` (DebugPromptOptions): An optional object containing additional data about the function being debugged

The function returns a string that can be used as a debug prompt. It includes the input and output of the function being debugged, and any additional information provided in the `options` object.

### Example usage

```typescript
import { createDebugPromptFromInputOutput } from 'debug-prompt';

const input = 'hello';
const output = 'olleh';

const prompt = createDebugPromptFromInputOutput(input, output, {
  functionName: 'reverseString',
  moduleName: 'stringUtils.js',
  additionalContentToAppend: 'This function has a bug'
});

console.log(prompt);

// Output:
// I'm given:
// hello
//
// Output:
// olleh
//
// Function name: reverseString
// File name: stringUtils.js
//
// Additional content:
// This function has a bug
```

error-handler-validation.ts

# Validation Module

This is a simple validation module written in TypeScript. It provides a `createValidator` function that takes in a schema definition and returns functions to validate data against the schema.

## Usage

To use this module, you can import it as follows:

```typescript
import createValidator from './validation';
```

Once you have the `createValidator` function, you can create a validator by passing a schema definition to it. For example:

```typescript
const userSchema = {
  name: 'string',
  age: 'number',
  email: 'string',
};

const validator = createValidator(userSchema);
```

The resulting `validator` object has two functions:

- `validateItem(item: unknown): TypeInference<Schema>`
- `validateAgainstArraySchema(schema: Schema, data: unknown[]): ValidationResult<Schema>`

These can be used to validate individual objects and arrays of objects against the schema, respectively. For example:

```typescript
const user = { name: 'John', age: 30, email: 'john@example.com' };

try {
  const validUser = validator.validateItem(user);
  console.log(validUser); // { name: 'John', age: 30, email: 'john@example.com' }
} catch (error) {
  console.error(error);
}

const users = [
  { name: 'John', age: 30, email: 'john@example.com' },
  { name: 'Jane', age: 25, email: 'jane@example.com' },
];

const result = validator.validateAgainstArraySchema(userSchema, users);

if (result.error) {
  console.error(result.error);
} else {
  console.log(result.data); // [{ name: 'John', age: 30, email: 'john@example.com' }, { name: 'Jane', age: 25, email: 'jane@example.com' }]
}
```

## Error Handling

If validation fails, the functions provided by this module will throw a `CustomError` object with a `type` and `message` field. The `type` field will be one of `"ValidationError"`, `"APIError"`, or `"JavaScriptError"`, depending on the nature of the error. The `message` field will contain a human-readable error message.

To catch and handle errors, you can use a try-catch block or pass `true` as the second argument to the `handleError` function provided by this module. For example:

```typescript
import { handleError } from './validation';

try {
  // do something that might throw a CustomError
} catch (error) {
  const handledError = handleError(error as Error);
  console.error(handledError);
}
```

files-folder.ts

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