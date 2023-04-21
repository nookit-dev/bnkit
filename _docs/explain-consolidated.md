_docs/security/explain.md

## Module: `generateEncryptionKey.ts`

### Dependencies:
- None

### Features:
- `generateEncryptionKey()` function that returns a randomly generated encryption key string.

### Technical Description:
This module exports a single function `generateEncryptionKey()` which generates a random 32 character string consisting of alphanumeric characters. It achieves this by initializing a string `possibleChars` containing all the possible characters and then using `Math.random()` and `Math.floor()` to select a random character for each of the 32 positions in the key. The selected character is added to the `key` string using the `+=` operator. Once all 32 positions have been filled, the function returns the generated `key` string.

_docs/gpt-utils/explain.md

## Module: createDebugPromptFromInputOutput

### Dependencies:
- None

### Features:
- Creates a debug prompt from input and output, with optional parameters for function name, module name, and additional content to append.
- Returns the formatted prompt as a string.

### Technical Description:
The `createDebugPromptFromInputOutput` function takes in two strings representing the input and output of a code snippet, along with an optional configuration object containing a function name, module name, and additional content to append. It then formats and returns a string prompt including the input and output, as well as any optional configuration parameters. The function does not depend on any external modules or libraries, and can be used standalone to generate debug prompts for code testing and troubleshooting.

_docs/types/explain.md

## Module: type-inference.ts

**Dependencies:**
- None

**Features:**
- TypeMapping interface: a map of TypeScript types to their corresponding JavaScript types.
- TypeInference type: a utility type that infers TypeScript types from a given schema.
- ValidationResult type: a type that defines the output of the validate function.
- SchemaType type: an interface that defines the schema object structure.
- infer function: a function that infers types from data based on a given schema.

**Description:**
The `type-inference.ts` module is a utility for inferring TypeScript types from data based on a schema object. The module exports several useful types, including `TypeMapping`, which maps TypeScript types to their corresponding JavaScript types; `TypeInference`, which infers TypeScript types based on a given schema; and `ValidationResult`, which specifies the expected output of the `validate` function. The module also exports a function called `infer`, which takes a schema object and data as arguments and returns the inferred TypeScript types. This module is useful for validating data types or ensuring data is properly formatted according to a defined schema.

_docs/fetcher/explain.md

## Module: `fetcher.ts`

### Dependencies:
- `error-handler-validation`

### Features:
- `createFetcher` function which returns an object with 3 functions:
  - `get<Type>(endpoint: string): Promise<Type>`
  - `post<Type>({ endpoint, params, headers }): Promise<Type>`
  - `getStatus<Type>(endpoint: string): Promise<Type>`
- `handleResponse<Type>(response: Response): Promise<Type>` function which handles the response received from `fetch()` and either returns the parsed JSON response or throws an error using the `handleError` function from the `error-handler-validation` module.

### Description:
This module exports a `createFetcher` function which can be used to create an object containing three functions for making HTTP requests: `get`, `post`, and `getStatus`. Each function takes in an endpoint (a string representing the path to the resource), and the `post` function also accepts an optional `params` and `headers`. The `createFetcher` function takes one argument, an object with a `baseUrl` string defining the URL to prepend to the endpoint strings. 

The `handleResponse` function is used internally to handle and parse the response object received from the `fetch()` call. If the response is not OK, it throws an error using the `handleError` function from the `error-handler-validation` module.

Overall, this module provides a flexible and reusable way to make HTTP requests using the `fetch()` API.

_docs/text-utils/explain.md

This file contains two main functions: "prettifyHTMLString" and "convertMarkdownToHTML", as well as a helper function "replaceMarkdown" and an object with various parsers for different markdown elements. 

Dependencies: This module does not appear to depend on any other modules.

"prettifyHTMLString": This function takes a raw HTML string and formats it by adding indentation and line breaks to make it more human-readable. It achieves this by using regular expressions to parse through the HTML tags, identifying opening and closing tags and their corresponding attributes, and then adding appropriate spacing and line breaks to the formatted output.

"convertMarkdownToHTML": This function takes a raw markdown string and converts it to HTML. It does this by iterating through an object of parsers for different markdown elements (such as headers, bold/italic text, links, lists, etc.), and applying the appropriate parser to the markdown string. Once all the parsers have been applied, the resulting string is returned as HTML.

"replaceMarkdown": This is a helper function used by the various parsers in "convertMarkdownToHTML". It takes a text string, a regular expression to match, and a replacement string, and applies the regular expression to the text string, replacing any matches with the replacement string.

Overall, this module provides functionality for converting and formatting HTML and markdown strings.

_docs/networking/explain.md

# Module Explanation: `crud-server`

## Dependent Modules
- `bun`
- `fetcher`

## Features
- `createRouter`: creates a router that can handle HTTP requests for different paths and methods
- `ServerRouter`: a type for the router object that has two methods: `addRoute` to add new routes, and `handleRequest` to handle incoming HTTP requests
- `createCrudServer`: a factory function that creates a Server object with CRUD (Create, Read, Update, Delete) functionality for a given schema
- `CrudServer`: a type for the Server object returned by `createCrudServer`, which has three methods: `start` to start the server, `stop` to stop the server, and `router` to access the router object used by the server
- `useWebSockets`: a function that returns an object with callback functions to handle WebSocket connections

## Technical Description
The `crud-server` module provides a set of helper functions and types for building a CRUD server. It utilizes the `createRouter` function to handle incoming HTTP requests for Create, Read, Update, and Delete operations, and `createCrudServer` to create a Server object with the CRUD functionality for a given schema. 

The `useWebSockets` function provides a set of callback functions for handling WebSocket connections, and the `createOpenAICompletions` function creates an API client for the OpenAI Completions API.

Overall, this module provides a convenient and powerful toolkit for building CRUD servers in a scalable and modular way.

_docs/cli/explain.md

# Module: cli-utils

## Dependencies
- error-handler-validation
- fs
- path
- readline

## Features
- `getUserInput()`: Get user input asynchronously
- `ParsedArgs`: Interface for parsed command line arguments
- `parseCliArgs()`: Parse command line arguments
- `createFileWithContent(filePath: string, content: string)`: Ensure directory exists and create file with content
- `directoryExists(directoryPath: string)`: Ensure directory exists
- `getModulesFromPath(directoryPath: string)`: Get module names from path
- `getAdditionalPrompt()`: Get additional prompt from user
- `chooseActions(actionsConfig: Record<string, any>): Promise<Array<keyof typeof actionsConfig>>`: Choose and return selected actions from given config

## Technical Description
`cli-utils` is a collection of utility functions that aid in creating a command line interface (CLI) for Node.js programs. 

`parseCliArgs()` takes command line arguments passed to the program and returns an object with parsed key-value pairs. 

`createFileWithContent()` creates a file at the given file path with provided contents. The function also ensures that the directory containing the file exists. 

`directoryExists()` checks if a directory exists at the given file path and creates it if it doesn't exist.

`getModulesFromPath()` returns an array of module names present in a directory.

`getAdditionalPrompt()` prompts the user for additional input and returns the user's response as a string.

`chooseActions()` takes a configuration object with various actions and prompts the user to choose among those actions by entering their corresponding numbers. It returns an array of selected action keys.

These functions provide a streamlined way of accepting user input, handling command line arguments, and performing file system related tasks in a command line interface.

_docs/files-folder/explain.md

# Module Description

This module provides several functions for working with directories and files in a Node.js application. It depends on the `fs` and `path` built-in modules and also imports a custom `handleError()` function from another module.

## Features

- `getFilesForDirectory()`: Returns an array of file names in a specified directory, excluding any files listed in an optional `ignoreFiles` parameter.
- `getFilesForDirectoryFromRoot()`: Similar to the above function, but starts the search for files from the root directory of the application.
- `isRootFolder()`: Returns true if a given directory path contains a `tsconfig.json` file (indicating the root directory of a TypeScript application).
- `findAppRoot()`: Searches upwards from a given directory until it finds the root directory of a TypeScript application.
- `saveResultToFile()`: Writes content to a file at a specified path, including any missing directories in the path.
- `readFilesContents()`: Returns an array of objects containing the contents of specified files and their relative paths.

Note that in each of the exported functions, the `directory` parameter can be one of several string values for convenience in specifying paths relative to the current module.

## Technical Description

The `fs` and `path` modules are imported at the top of the file for working with file system operations and file paths, respectively. The `handleError()` function is imported from another module for standardized error handling.

Each of the exported functions takes one or more parameters related to its specific function, and optional parameters can be passed as an object (destructured with default values). The functions use a combination of built-in methods for working with files and directories, such as `readdirSync()`, `join()`, `parse()`, `existsSync()`, and `promises.mkdir()`. Some functions also use utility functions defined within the module, like `isRootFolder()` and `findAppRoot()`, for convenience.

If an error is encountered during function execution, it is passed to the `handleError()` function to log a detailed error message to the console. Finally, each function returns its result or `undefined` if there is an error.

_docs/data-storage/explain.md

# Module: `sqlite-interface.ts`

## Dependencies:
- `bun:sqlite`: A SQLite database driver for Node.js.
- `./validator`: A module that exports functions for validating data against a specified schema.
- `./types`: A module that exports type mappings used for SQLite table creation.

## Features:
- `createTableQuery`: A utility function that generates a SQLite CREATE TABLE query based on a specified table name and schema.
- `CreateSqliteInterface`: A generic type that describes the shape of a SQLite CRUD interface.
- `createSqliteInterface`: A function that creates a SQLite CRUD interface based on a specified table name and schema.
  - `create`: A function that creates a new record in the table based on a specified data object.
  - `read`: A function that returns all records in the table and validates them against the specified schema.
  - `update`: A function that updates a record in the table with the specified ID and data object.
  - `deleteById`: A function that deletes a record from the table with the specified ID.

## Technical Description:
`sqlite-interface.ts` is a module that exports functions for creating a CRUD interface for a SQLite database based on a specified schema. The `createSqliteInterface` function creates a new SQLite database connection, generates a CREATE TABLE query using the `createTableQuery` utility function, and returns an object with four functions that correspond to the CRUD operations available in a typical database: create, read, update, and delete. The `create` function inserts a new record into the table, the `read` function returns all records in the table and validates them against the specified schema using the `validateAgainstArraySchema` function from the `./validator` module, the `update` function updates a specific record in the table with the specified ID and data object, and the `deleteById` function deletes a specific record from the table with the specified ID. The module depends on the `bun:sqlite` database driver for Node.js, the `./validator` module for validating data against the specified schema, and the `./types` module for type mappings used in SQLite table creation.

_docs/jwt/explain.md

# Module Explanation

This module exports two functions, `jwtClient` and `jwtServer`, for encoding and decoding JSON web tokens (JWTs). 

## Dependencies

The module imports the `crypto` module from Node.js, which is used for generating HMAC digests.

## Features

The `jwtClient` function exports two methods: `decodeJwt` and `isJwtExpired`.

`decodeJwt` takes a JWT as a string and decodes its header and payload components. It returns an object with `header` and `payload` keys.

`isJwtExpired` takes a JWT as a string and checks if its expiry time has passed. It returns a boolean value.

The `jwtServer` function exports two methods: `createJwt` and `verifyJwt`.

`createJwt` takes the payload data as an object, a secret string for signing the token, and an optional expiry time in seconds. It returns a JWT as a string.

`verifyJwt` takes a JWT as a string and a secret string. It checks the integrity of the signature on the token and returns the token's header and payload as an object if successful. Otherwise, it raises an error.

## Technical Description

The module uses the `Buffer` class from Node.js to encode and decode base64 strings. It defines two functions, `base64UrlEncode` and `base64UrlDecode`, for encoding and decoding strings with characters that are URL-safe.

The `sign` function takes a string and a secret and computes an HMAC digest using the SHA-256 algorithm. It returns the digest as a base64-encoded string.

The `createJwt` function constructs a header object with an algorithm (`HS256`) and a type (`JWT`). It encodes the header and payload objects as base64 strings, concatenates them with a period (`.`) separator, and signs the resulting string with the `sign` function. It then encodes the signature as a base64 string and returns the concatenated string as a JWT.

The `verifyJwt` function first extracts the header, payload, and signature components from the input JWT. It then computes the signature of the header and payload components using the `sign` function and compares it to the decoded signature. If they match, it parses and returns the header and payload objects. Otherwise, it raises an error.

_docs/arduino/explain.md

# File Explanation

This file exports two functions, `createArduinoInterface` and `listPorts`, and imports three modules, `handleError`, `serialport`, and `SerialPort`.

## Dependencies

This module depends on the following modules:

- `error-handler-validation`: a module that exports a function for handling errors and validating error messages.
- `serialport`: a module that helps with serial communication with an Arduino device.
- `SerialPort`: a constructor for the `serialport` module.

## Features

### `createArduinoInterface`

This function takes an object with two parameters, `port` and `baudRate`, and returns an object with two functions, `onData` and `write`. 

#### `onData`

This function takes a callback function as a parameter and is called every time data is received from the Arduino. The data is converted to a string and passed to the callback function. Any errors thrown by the callback function are caught, and an APIError is thrown using the `handleError` function.

#### `write`

This function takes a string as a parameter and returns a `Promise`. It writes the string to the Arduino and calls the `resolve` function of the promise if successful. If an error occurs, the `reject` function of the promise is called with an APIError using the `handleError` function.

### `listPorts`

This function returns an array of objects containing information about all available ports. It calls the `list` function of the `SerialPort` module to get the list of ports. Any errors are caught, and an APIError is thrown using the `handleError` function. 

## Technical Description 

This module is used to communicate with an Arduino device through a serial port. The `createArduinoInterface` function creates an interface for sending and receiving data to the device. It creates a new `serialport` instance using the provided `port` and `baudRate`, and returns an object with two functions, `onData` and `write`. The `onData` function listens for data from the Arduino device and passes it to the provided callback function. The `write` function writes data to the device.

The `listPorts` function lists all available ports using the `SerialPort` module’s `list` function. It returns an array of objects containing the path and manufacturer of each port. 

The `handleError` function is used to handle and validate errors, and is imported from the `error-handler-validation` module.

_docs/error-handler-validation/explain.md

# ErrorUtils Module

The `errorUtils.ts` module exports types, functions, and a validator creator that are useful for handling and validating errors in JavaScript code.

## Dependencies

The `errorUtils.ts` module depends on the following modules:

- `types.ts`: provides type definitions

## Features

The `errorUtils.ts` module provides the following features:

- `ErrorType`: a type alias for the three types of errors that the module can handle: `ValidationError`, `APIError`, and `JavaScriptError`
- `CustomError`: an interface for creating a custom error object with a type and message
- `apiErrorMap`: an object that maps `ErrorType` values to their respective string representations
- `mapBuiltInErrorType`: a function that maps built-in errors to `ErrorType` values
- `getErrorType`: a function that returns the `ErrorType` of an error object, whether it is a built-in error or a custom error
- `handleError`: a function that handles an error object, optionally throwing an error or returning a custom error
- `createValidator`: a function that creates a validator for a given schema, to validate items or arrays of items against their expected types.

## `createValidator` Function

The `createValidator` function creates a validator for a given schema that can be used to validate objects or arrays of objects against their expected types.

### Parameters

- `schema` (required): an object that defines the expected types of each property

### Return Value

The `createValidator` function returns an object with two methods:

- `validateAgainstArraySchema`: a function that validates an array of data against the given schema and returns a `ValidationResult` object with either the validated data or an error message
- `validateItem`: a function that validates a single item against the given schema and returns an object with the same structure as the `schema`, with values coerced to the expected types.

## Usage

To use the `errorUtils.ts` module, import the desired functionality from the module with the appropriate import statement, like this:

```typescript
import createValidator, { CustomError } from './errorUtils';
```

Then, use the imported functions and types in your JavaScript code to handle and validate errors.