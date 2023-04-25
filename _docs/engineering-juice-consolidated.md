## Prompt
_docs/security/engineering-juice.md

### Functions
- `generateEncryptionKey(): string` - Generates a 32-character encryption key composed of uppercase and lowercase letters and numbers. Returns the key as a string.

_docs/gpt-utils/engineering-juice.md

```typescript
/**
 * Generates a prompt for debugging with the given input and output, including optional function and file name information.
 *
 * @param input - The input value as a string.
 * @param output - The output value as a string.
 * @param options - Additional options to append to the prompt, such as function and module name.
 */
export const createDebugPromptFromInputOutput = (
  input: string,
  output: string,
  options?: DebugPromptOptions
): string => {}
```

_docs/types/engineering-juice.md

### Functions

#### `infer`

- Input: `schema: SchemaType`, `data?: unknown`
- Output: `TypeInference<Schema>`
- Description: Infers TypeScript types from a given schema and data.

#### `TypeInference`

- Input: `T extends Record<string, keyof TypeMapping>`
- Output: `{[K in keyof T]: TypeMapping[T[K]];}`
- Description: Utility type to infer TypeScript types from the schema.

#### `ValidationResult`

- Input: `Schema extends Record<string, keyof TypeMapping>`
- Output: `{error?: string;data?: TypeInference<Schema>[];}`
- Description: Validates and returns either error or data, from the given schema.

#### `SchemaType`

- Output: `Record<string, keyof TypeMapping>`
- Description: Represents the schema type mapping.

#### `TypeMapping`

- Output: `{string: string;number: number;boolean: boolean;date: Date;}`
- Description: Represents the type mapping for strings, numbers, booleans, and dates.

_docs/arduino/engineering-juice.md

## Functions

### `createArduinoInterface(options: ArduinoOptions)`

Creates an interface to communicate with an Arduino device over a serial port.

- Input: `options` - An object containing the `port` string and optional `baudRate` number.
- Output: An object containing `onData` and `write` functions.

### `onData(callback: (data: string) => void)`

Registers a callback function to be called when data is received from the Arduino.

- Input: `callback` - A function that accepts a string parameter.

### `write(data: string): Promise<void>`

Writes data to the Arduino.

- Input: `data` - A string to be sent to the Arduino.
- Output: A promise which resolves when the data has been successfully written.

### `listPorts(): Promise<Array<{ path: string; manufacturer: string }>>`

Lists all available serial ports on the system.

- Output: A promise which resolves to an array of objects containing the `path` and `manufacturer` of each available port.

_docs/jwt/engineering-juice.md

## Function List:

### `jwtClient()`
* (no input parameters)
* Returns an object with two functions:
  * `decodeJwt(token: string): { header: object, payload: object }` - Decodes a JWT token and returns an object containing the decoded header and payload.
  * `isJwtExpired(token: string): boolean` - Takes a JWT token and returns a boolean indicating whether the token has expired.

### `jwtServer(secret: string)`
* Takes a secret string as input.
* Returns an object with two functions:
  * `createJwt(payload: object, secret: string, expiresIn?: number): string` - Creates and returns a signed JWT token, using the provided payload, secret, and (optional) expiration time (in seconds).
  * `verifyJwt(token: string, secret: string): { header: object, payload: object }` - Verifies the signature of a JWT token, and returns the decoded header and payload if the signature is valid.

_docs/networking/engineering-juice.md

Function List:

- createRouter(routeConfigs?: ServerRoute[]): ServerRouter
  - Input: routeConfigs, an optional array of ServerRoute objects
  - Output: ServerRouter, an object with addRoute and handleRequest functions
  - Description: Creates a router object for handling HTTP request routing

- createCrudServer<Schema extends Record<string, keyof TypeMapping>>({ router, port }: { router?: ServerRouter; port?: number; }): CrudServer<Schema> 
  - Input: router, an optional ServerRouter object, and port, an optional number
  - Output: CrudServer, an object with start, stop, and router properties
  - Description: Creates a server to handle CRUD operations

- useWebSockets(): Object
  - Input: None
  - Output: Object, an object with open, message, close, error, and drain functions
  - Description: Sets up WebSocket communication with the server

- createOpenAICompletions({ apiKey }: { apiKey: string }): Object
  - Input: apiKey, a string representing the OpenAI API key
  - Output: Object, an object with a getCompletions function
  - Description: Creates a fetcher function for retrieving completion data from the OpenAI API.

_docs/data-storage/engineering-juice.md

# Functions

## createTableQuery(tableName: string, schema: Record<string, keyof TypeMapping>): string

- **Input:** tableName(string), schema(Record<string, keyof TypeMapping>)
- **Output:** string
- Returns a CREATE TABLE SQL query string.

## createSqliteInterface(tableName: string, schema: Record<string, keyof TypeMapping>)

- **Input:** tableName(string), schema(Record<string, keyof TypeMapping>)
- **Output:** CreateSqliteInterface
- Creates a new SQLite interface with CRUD functionality.

## create(item: TypeInference<Schema>)

- **Input:** item(TypeInference)
- **Output:** Promise<void>
- Creates a new item in the SQLite database.

## read()

- **Input:** none
- **Output:** Promise<TypeInference[]>
- Reads all items from the SQLite database.

## update(id: number, item: Partial<TypeInference<Schema>>)

- **Input:** id(number), item(Partial<TypeInference>)
- **Output:** Promise<void>
- Updates an item in the SQLite database.

## deleteById(id: number)

- **Input:** id(number)
- **Output:** Promise<void>
- Deletes an item from the SQLite database by its ID.

_docs/fetcher/engineering-juice.md

```
## Functions
### createFetcher
- Input: FetchOptions
- Output: Object containing functions `get`, `post`, and `getStatus`
- Creates a fetcher object with a base URL and three functions for making GET, POST, and HEAD requests with error handling.

### get
- Input: string
- Output: Promise<Type>
- Makes a GET request to the specified endpoint and returns the resulting data as a Promise of the specified Type.

### post
- Input: Object with optional endpoint (string), params (any), and headers (Record<string, any>)
- Output: Promise<Type>
- Makes a POST request with the given parameters and headers to the specified endpoint (or base URL if none is provided) and returns the resulting data as a Promise of the specified Type.

### getStatus
- Input: string
- Output: Promise<Type>
- Makes a HEAD request to the specified endpoint and returns the resulting data as a Promise of the specified Type.

### handleResponse
- Input: Response
- Output: Promise<Type>
- Helper function to handle the response from any of the fetch requests. Throws an APIError if the response is not OK (status code < 200 or > 299) or returns the parsed response data as a Promise of the specified Type.
```

_docs/cli/engineering-juice.md

## Functions

### `getUserInput()`
- Input: None
- Output: `Promise<string>`
- Asynchronously gets user input from the command line.

### `parseCliArgs()`
- Input: None
- Output: `Promise<ParsedArgs>`
- Parses command line arguments and returns an object with the parsed arguments.

### `createFileWithContent(filePath, content)`
- Input: `string`, `string`
- Output: `void`
- Ensures that the directory exists and then creates a file with the provided content and file path.

### `directoryExists(directoryPath)`
- Input: `string`
- Output: `void`
- Ensures that the directory exists, creating it if necessary.

### `getModulesFromPath(directoryPath)`
- Input: `string`
- Output: `Array<string>`
- Gets the module names from the provided directory path.

### `getAdditionalPrompt()`
- Input: None
- Output: `Promise<string>`
- Asynchronously prompts the user for additional input.

### `chooseActions(actionsConfig)`
- Input: `Record<string, any>`
- Output: `Promise<Array<keyof typeof actionsConfig>>`
- Asynchronously prompts the user to choose from a list of actions and returns the selected actions.

_docs/error-handler-validation/engineering-juice.md

## Functions

### `getErrorType(error: Error | CustomError): ErrorType`

- **Input:** `error: Error | CustomError`, an `Error` object or a `CustomError` object
- **Returns:** `ErrorType`, the type of the error (one of "ValidationError", "APIError", or "JavaScriptError")
- **Description:** Determines the type of the error object

### `handleError(error: Error | CustomError, throwError = false): CustomError | undefined`

- **Input:**
  - `error: Error | CustomError`, an `Error` object or a `CustomError` object
  - `throwError = false`, a boolean indicating whether or not to throw the error
- **Returns:** `CustomError | undefined`, a `CustomError` object or `undefined`
- **Description:** Handles the given error object, optionally throwing it

### `createValidator<Schema extends SchemaType>(schema: Schema)`

- **Input:** `schema: Schema`, a schema object
- **Returns:** An object with the following properties:
  - `validateAgainstArraySchema(schema: Schema, data: unknown[]): ValidationResult<Schema>`, a function that validates an array of objects against the given schema, returning a `ValidationResult<Schema>` object
  - `validateItem(item: unknown): TypeInference<Schema>`, a function that validates an object against the given schema, returning a `TypeInference<Schema>` object
- **Description:** Creates a validator object based on the given schema object, which can validate objects against the schema

_docs/text-utils/engineering-juice.md

Functions:
- prettifyHTMLString(rawHTML: string): string - receives a string of raw HTML code and returns a prettified version of it.
- replaceMarkdown(text: string, regex: RegExp, replacement: string): string - replaces all occurrences of a regular expression in a string with a replacement string.
- parsers: object - contains different functions that each parse a specific markdown syntax and return the corresponding HTML code. The object is structured as follows:

  - headers(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any headers found in the text.
  - bold(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any bold text found in the text.
  - italic(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any italicized text found in the text.
  - links(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any links found in the text.
  - unorderedLists(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any unordered lists found in the text.
  - orderedLists(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any ordered lists found in the text.
  - blockquotes(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any blockquotes found in the text.
  - codeBlocks(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any code blocks found in the text.
  - inlineCode(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any inline code found in the text.
 
- convertMarkdownToHTML(markdownText: string): string - receives a string of raw markdown text and uses the parsers object to convert it to HTML code. Returns the resulting HTML code.

_docs/files-folder/engineering-juice.md

## Module Functions

### `getFilesForDirectory(directory: string, options: { ignoreFiles?: string[] }): string[] | undefined`
- Input
    - `directory`: Directory path to retrieve files from
    - `options`: Object containing an optional array of file names to ignore
- Output
    - Array of file names in the specified directory, with ignored files excluded
- Description
    - Retrieves all file names in the specified directory, filters out ignored files, and returns an array of the remaining file names.

### `getFilesForDirectoryFromRoot(directory: string, options: { ignoreFiles?: string[] }): string[] | undefined`
- Input
    - `directory`: Directory path to retrieve files from, relative to the root directory of the application
    - `options`: Object containing an optional array of file names to ignore
- Output
    - Array of file names in the specified directory, relative to the application's root, with ignored files excluded
- Description
    - Calls `findAppRoot` to determine the root directory of the application, then constructs the absolute path to the specified relative directory from the root, retrieves all file names in that directory, filters out ignored files, and returns an array of the remaining file names.

### `isRootFolder(folderPath: string): boolean | undefined`
- Input
    - `folderPath`: Path to a directory
- Output
    - Boolean value representing whether the specified directory is an application root directory
- Description
    - Determines if the specified directory is an application root directory by checking for the existence of a `tsconfig.json` file in that directory.

### `findAppRoot(startingPath: string): string | null | undefined`
- Input
    - `startingPath`: Absolute or relative path to a directory
- Output
    - Absolute path to the application's root directory, or `null` if it could not be found
- Description
    - Traverses up the directory tree from `startingPath` until an application root directory is found (by calling `isRootFolder`), then returns the absolute path to that directory.

### `saveResultToFile(filePath: string, content: string): Promise<void> | undefined`
- Input
    - `filePath`: Path to the file to write to
    - `content`: Contents to write to the file
- Output
    - Promise resolving to `undefined` if the file was successfully written to
- Description
    - Creates any directories in the file path that don't already exist, then writes `content` to the specified file.

### `readFilesContents(filePaths: string[]): { path: string; content: string }[] | undefined`
- Input
    - `filePaths`: Array of file paths to read from
- Output
    - Array of objects with `path` and `content` properties, containing the file name and contents, respectively, for each file in `filePaths`
- Description
    - Reads the contents of each file in `filePaths`, returning an array of objects containing the file name and contents of each file.
summarize all the technical details of each module and their responsibilities

## Response
The `engineering-juice` library contains several modules for different purposes. 

The `security` module has a `generateEncryptionKey` function that generates a 32-character encryption key composed of uppercase and lowercase letters and numbers.

The `gpt-utils` module has a `createDebugPromptFromInputOutput` function that generates a prompt for debugging with the given input and output.

The `types` module has functions for inferring TypeScript types from given schemas and data, validating schemas, and representing type mappings.

The `arduino` module has functions for creating an interface to communicate with an Arduino device over a serial port and listing all available serial ports on the system.

The `jwt` module has functions for encoding and decoding JWT tokens and verifying the signature of a JWT token.

The `networking` module has functions for creating routers for HTTP request routing, creating servers for handling CRUD operations, setting up WebSocket communication, and creating fetcher objects for making API requests.

The `data-storage` module has functions for creating SQL queries and a SQLite interface with CRUD functionality.

The `fetcher` module has functions for creating fetcher objects for making API requests with error handling.

The `cli` module has functions for parsing command-line arguments, creating files and directories, and prompting for user input.

The `error-handler-validation` module has functions for handling different types of errors and validating schemas.

The `text-utils` module has functions for prettifying HTML code, parsing Markdown syntax, and converting Markdown text to HTML code.

The `files-folder` module has functions for working with files and directories, including retrieving file names, determining application root directories, and reading and writing file contents.