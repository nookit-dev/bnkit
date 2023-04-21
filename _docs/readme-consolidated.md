_docs/security/readme.md

# Encryption Key Generator

This module exports a function `generateEncryptionKey` that generates a random 32-character string that can be used as an encryption key.

## Installation

```
npm install encryption-key-generator
```

## Usage

```
import { generateEncryptionKey } from 'encryption-key-generator';

const key = generateEncryptionKey(); // e.g. "6i8a7Etp74FzxywCcVbG0nQ2lJhKRO9Z"
```

## License

This module is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

_docs/cli/readme.md

# Module Name

This is a template for a Node.js module.

## Usage

To use this module, follow these steps:

1. Install the module using npm: `npm install module-name`
2. Import the module in your script: `const moduleName = require('module-name')`
3. Use the module's functions as needed

## Functions

This module contains the following functions:

- `getUserInput()`
- `parseCliArgs()`
- `directoryExists(directoryPath: string)`
- `getModulesFromPath(directoryPath: string)`
- `getAdditionalPrompt(): Promise<string>`
- `chooseActions(actionsConfig: Record<string, any>): Promise<Array<keyof typeof actionsConfig>>`

_docs/error-handler-validation/readme.md

# error-utils

A utility module for handling errors and creating validators.

## Handlers

### `getErrorType(error: Error | CustomError): ErrorType`

- `error` - An instance of an Error or CustomError.

Returns the type of error as a string, either "ValidationError", "APIError", or "JavaScriptError".

### `handleError(error: Error | CustomError, throwError = false): CustomError | undefined`

- `error` - An instance of an Error or CustomError.
- `throwError` - A boolean indicating whether to throw the error or return it.

Returns a CustomError object with a type and message property. If `throwError` is `true`, throws the error instead of returning it.

## Validators

### `createValidator<Schema>()`

- `schema` - An object representing the expected schema for validation.

Returns an object with two methods:

#### `validateItem(item: unknown): TypeInference<Schema>`

- `item` - An unknown value to validate against the schema.

Returns an object representing the validated item. Throws a `CustomError` if the input `item` is not an object or if it does not match the expected schema.

#### `validateAgainstArraySchema(schema: Schema, data: unknown[]): ValidationResult<Schema>`

- `schema` - An object representing the expected schema for validation.
- `data` - An array of unknown values to validate against the schema.

Returns an object with either a `data` property containing an array of validated items or an `error` property containing a validation error message.

_docs/types/readme.md

# Module README

This module provides utility types and functions for working with JSON schemas that define the types of data to be validated or inferred in TypeScript.

## Types

### `TypeMapping`

A type mapping object that defines the correspondence between schema types (strings) and TypeScript types. The default mapping includes `string`, `number`, `boolean`, and `date`.

### `TypeInference<Schema>`

A utility type that infers TypeScript types from a given schema, based on its corresponding `TypeMapping`. The `Schema` type parameter should be a record that maps schema property names to schema type strings.

### `ValidationResult<Schema>`

A validation result object that contains either an error message or validated data (inferred TypeScript types), based on a given schema.

### `SchemaType`

A type alias for a record that maps schema property names to schema type strings.

## Functions

### `infer<Schema>(schema: Schema, data?: unknown): TypeInference<Schema>`

A function that performs type inference on the given `data` object, based on the given `schema`. If `data` is not provided, the function returns a stub object with the inferred types.

## Example Usage

```typescript
import { infer } from './index'

const schema = {
  name: 'string',
  age: 'number',
  isEmployed: 'boolean',
  dateOfBirth: 'date'
}

const data = {
  name: 'John Doe',
  age: 30,
  isEmployed: true,
  dateOfBirth: new Date('1990-01-01')
}

const inferredData = infer(schema, data)

// inferredData has type: {
//   name: string;
//   age: number;
//   isEmployed: boolean;
//   dateOfBirth: Date;
// }
```

_docs/fetcher/readme.md

# Fetcher module

This module provides a simple way to create a fetcher object that can be used to perform HTTP requests.

## Installation

To install, run:

```
npm install @your-organization/fetcher
```

## Usage

### Step 1: Import the module

```javascript
import { createFetcher } from "@your-organization/fetcher";
```

### Step 2: Create a fetcher object

```javascript
const fetcher = createFetcher({ baseUrl: "https://api.example.com" });
```

### Step 3: Use the fetcher object to perform HTTP requests

The fetcher object has three methods: `get`, `post`, and `getStatus`. These methods correspond to HTTP GET, POST, and HEAD requests, respectively.

```javascript
try {
  const data = await fetcher.get<{ foo: string }>("/data");
  console.log(data.foo);
} catch (error) {
  console.error(error);
}

try {
  const response = await fetcher.post<{ bar: number }>({
    endpoint: "/submit",
    params: { baz: "qux" },
    headers: { Authorization: "Bearer TOKEN" },
  });
  console.log(response.bar);
} catch (error) {
  console.error(error);
}

try {
  const status = await fetcher.getStatus<{ online: boolean }>("/health");
  console.log(status.online ? "API is online" : "API is offline");
} catch (error) {
  console.error(error);
}
```

The `get` and `post` methods expect a generic type parameter that specifies the shape of the response data. The `getStatus` method returns a boolean value.

If the HTTP response status is not `200 OK`, the `handleResponse` function will throw an `APIError` with the corresponding status text. You can use the `handleError` function from the `error-handler-validation` module to format the error message.

_docs/gpt-utils/readme.md

# Debug Prompt Module

This module provides a utility function `createDebugPromptFromInputOutput` that makes it easy to create debug prompts with relevant information. 

## Installation

To install, simply run:

```
npm install debug-prompt
```

## Usage

```javascript
import { createDebugPromptFromInputOutput } from 'debug-prompt';

const input = '2, 3, 4';
const output = '10';

const options = {
  functionName: 'sumArray',
  moduleName: 'math.js',
  additionalContentToAppend: 'Check for edge cases',
};

const debugPrompt = createDebugPromptFromInputOutput(input, output, options);

console.log(debugPrompt);
// I'm given:
// 2, 3, 4
//
// Output:
// 10
//
// Function name: sumArray
// File name: math.js
//
// Additional content:
// Check for edge cases
```

## API

### `createDebugPromptFromInputOutput(input: string, output: string, options?: DebugPromptOptions): string`

This function returns a string that contains the input, output, and any additional information passed in through the `options` object. 

#### `input`

Type: `string`

The input that was given to the function or code being debugged.

#### `output`

Type: `string`

The output that was produced by the function or code being debugged.

#### `options`

Type: `DebugPromptOptions` (optional)

An object that contains additional information to be included in the debug prompt. 

##### `functionName`

Type: `string` (optional)

The name of the function being debugged.

##### `moduleName`

Type: `string` (optional)

The name of the module or file that contains the function being debugged.

##### `additionalContentToAppend`

Type: `string` (optional)

Any additional information that should be included in the debug prompt. 

## License

This module is licensed under the [MIT License](https://opensource.org/licenses/MIT).

_docs/arduino/readme.md

# Node.js Arduino Interface

This module provides a simple way to interface with an Arduino board using Node.js.

## Installation

Use npm to install the module:

```
npm install node-arduino-interface
```

## Usage

### `createArduinoInterface(options: ArduinoOptions): { onData(callback: (data: string) => void), write(data: string): Promise<void> }`

Creates a new Arduino interface with the specified options. Returns an object with two methods: `onData` and `write`.

- `options` (`ArduinoOptions`): Options to configure the Arduino interface. Required fields:
  - `port` (`string`): The device path for the Arduino board, e.g. "/dev/ttyACM0".
- `onData(callback: (data: string) => void)`: Sets a callback function to be called when new data is received from the Arduino board.
  - `callback` (`function`): The function to be called. The argument is the received data as a string.
- `write(data: string): Promise<void>`: Writes data to the Arduino board.
  - `data` (`string`): The data to send to the board.
  - Returns a Promise that resolves when the data has been sent.

### `listPorts(): Promise<Array<{ path: string; manufacturer: string }>>`

Returns a list of available serial ports.

- Returns a Promise that resolves to an array of objects with two fields: `path` and `manufacturer`.

## Example

```javascript
import { createArduinoInterface } from "node-arduino-interface";

const arduino = createArduinoInterface({ port: "/dev/ttyACM0" });

arduino.onData((data: string) => {
  console.log(`Received data from Arduino: ${data}`);
});

arduino.write("Hello Arduino!");
```

## License

This module is released under the [MIT License](LICENSE).

_docs/networking/readme.md

# Bun Crud Server

This module provides utilities for creating a server using [Bun](https://github.com/bunnyyiusip/bun) that can handle CRUD (Create, Read, Update, Delete) operations for a given schema. It also includes a router for handling frontend pages and supports WebSockets.

## Installation

```
npm install bun-crud-server
```

## Usage

```typescript
import { createCrudServer, createRouter } from 'bun-crud-server';

const router = createRouter();

// Add API routes
router.addRoute('/api/create', 'POST', createItemHandler);
router.addRoute('/api/read', 'GET', readItemsHandler);
router.addRoute('/api/update', 'PUT', updateItemHandler);
router.addRoute('/api/delete', 'DELETE', deleteItemHandler);

const server = createCrudServer({ router });

// Start the server
server.start();
```

### API

#### `createCrudServer({router?: ServerRouter, port?: number}): CrudServer`

Creates a new `CrudServer` instance.

- `router`: An optional `ServerRouter` instance for handling frontend pages. Defaults to an empty router.
- `port`: The port number to use for the server. Defaults to `4000`.

Returns a `CrudServer` instance with three methods:

- `start()`: Starts the server and returns the `Server` instance.
- `stop()`: Stops the server.
- `router`: The `ServerRouter` instance used by the server.

#### `createRouter(routeConfigs?: ServerRoute[]): ServerRouter`

Creates a new `ServerRouter` instance.

- `routeConfigs`: An optional array of `ServerRoute` objects.

Returns a `ServerRouter` instance with two methods:

- `addRoute(path: string, method: string, handler: RouteHandler)`: Adds a new route with the given path, HTTP method, and handler function.
- `handleRequest(req: Request): Response`: Handles the given `Request` object and returns a `Response` object.

### License

[MIT](https://opensource.org/licenses/MIT)

_docs/jwt/readme.md

# JWT Util Module

This is a module for encoding, decoding, signing, and verifying JSON Web Tokens (JWTs) in Node.js applications.

## Installation

To install this module, use the following command:

```
npm install --save jwt-util
```

## Usage

### Client-Side

#### `decodeJwt(token: string)`

This function decodes a JWT string and returns an object containing the decoded header and payload.

**Arguments:**

- `token` (string): The JWT string to decode.

**Returns:**

An object with the following properties:

- `header` (object): The decoded header object.
- `payload` (object): The decoded payload object.

#### `isJwtExpired(token: string)`

This function checks whether a JWT has expired.

**Arguments:**

- `token` (string): The JWT string to check.

**Returns:**

A boolean indicating whether the JWT has expired.

### Server-Side

#### `createJwt(payload: JwtPayload, secret: string, expiresIn?: number)`

This function creates a new JWT string.

**Arguments:**

- `payload` (object): The payload object to include in the JWT.
- `secret` (string): The secret key to sign the JWT with.
- `expiresIn` (number, optional): The expiration time of the JWT, in seconds. Default is 3600 (1 hour).

**Returns:**

The JWT string.

#### `verifyJwt(token: string, secret: string)`

This function verifies the signature and expiration time of a JWT.

**Arguments:**

- `token` (string): The JWT string to verify.
- `secret` (string): The secret key to verify the JWT with.

**Returns:**

An object with the following properties:

- `header` (object): The decoded header object.
- `payload` (object): The decoded payload object.

**Throws:**

- `"Invalid signature"`: If the JWT signature is invalid.
- `"Token expired"`: If the JWT has expired.

## License

This module is licensed under the MIT License. See the `LICENSE` file for more information.

_docs/data-storage/readme.md

# sqlite-interface

A simple CRUD interface for SQLite databases in TypeScript.

## Installation

```
npm install sqlite-interface
```

## Usage

```typescript
import { createSqliteInterface } from "sqlite-interface";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

const taskSchema = {
  id: "integer PRIMARY KEY",
  title: "text NOT NULL",
  description: "text",
  completed: "integer NOT NULL"
} as const;

const taskInterface = createSqliteInterface<Task>("tasks", taskSchema);

// Create
await taskInterface.create({
  title: "Do laundry",
  completed: false
});

// Read
const tasks = await taskInterface.read();
console.log(tasks);

// Update
await taskInterface.update(1, { completed: true });

// Delete
await taskInterface.deleteById(1);
```

## API

The `createSqliteInterface` function creates a new CRUD interface for a SQLite database table.

```
createSqliteInterface<Schema extends Record<string, keyof TypeMapping>>(
  tableName: string,
  schema: Schema
): CreateSqliteInterface<Schema>
```

### `tableName`

The name of the SQLite database table to create the interface for.

### `schema`

An object describing the structure of the database table. The keys are the column names, and the values are strings describing the data type, optionally followed by database constraints. These strings should be compatible with SQLite data types.

### Returned interface

The `createSqliteInterface` function returns an object with the following methods:

#### `create`

```
create(item: TypeInference<Schema>): Promise<void>
```

Inserts a new item into the database table.

#### `read`

```
read(): Promise<TypeInference<Schema>[]>
```

Reads all items from the database table.

#### `update`

```
update(id: number, item: Partial<TypeInference<Schema>>): Promise<void>
```

Updates an existing item in the database table.

#### `deleteById`

```
deleteById(id: number): Promise<void>
```

Deletes an existing item from the database table by ID.

_docs/text-utils/readme.md

# Markdown Parser Module

This is a Node.js module that can be used to parse markdown syntax and convert it to HTML.

### Functions

- `replaceMarkdown(text: string, regex: RegExp, replacement: string): string` - Replaces text that matches a given regular expression with a specified replacement.
- `convertMarkdownToHTML(markdownText: string): string` - Converts markdown syntax to HTML by applying a series of parsing functions to the text.

### Parsers

The module provides the following parsers:

- `headers` - Parses up to six levels of header syntax (`#`).
- `bold` - Parses bold syntax (`**`).
- `italic` - Parses italic syntax (`*`).
- `links` - Parses link syntax (`[]()`).
- `unorderedLists` - Parses unordered list syntax (`-`).
- `orderedLists` - Parses ordered list syntax (`1.`).
- `blockquotes` - Parses blockquote syntax (`>`).
- `codeBlocks` - Parses code block syntax (`` ``` ``).
- `inlineCode` - Parses inline code syntax (`\``).

### Example Usage

```javascript
const { convertMarkdownToHTML } = require('markdown-parser-module');

const markdownText = '# Hello World\n\nThis is **bold** and this is *italic*. Click [here](https://example.com) to visit a link.\n\n- This is an unordered list item\n- This is another unordered list item\n\n1. This is an ordered list item\n2. This is another ordered list item\n\n> This is a blockquote.\n\n```\nconsole.log("This is a code block");\n```\n\nInline `code` is also supported.';

const html = convertMarkdownToHTML(markdownText);

console.log(html);
```

Output:

```html
<h1>Hello World</h1>

<p>This is <strong>bold</strong> and this is <em>italic</em>. Click <a href="https://example.com">here</a> to visit a link.</p>

<ul>
<li>This is an unordered list item</li>
<li>This is another unordered list item</li>
</ul>

<ol>
<li>This is an ordered list item</li>
<li>This is another ordered list item</li>
</ol>

<blockquote>
<p>This is a blockquote.</p>
</blockquote>

<pre><code>console.log("This is a code block");
</code></pre>

<p>Inline <code>code</code> is also supported.</p>
```

_docs/files-folder/readme.md

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