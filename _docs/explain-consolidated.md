_docs/types/explain.md

This module defines a few utility types and functions for validating and infering TypeScript types from a given schema. 

Dependencies:
- none

Features:
- `TypeMapping`: a type with mapping of common JS types to their TypeScript counterparts
- `TypeInference<T>`: a type that infers TypeScript types from a given schema object
- `ValidationResult<Schema>`: a type with either an error or inferred types data property for a given schema object
- `SchemaType`: a type that is a record with keys and values that correspond to properties and types
- `infer<Schema>`: a function that takes a schema object and optional data and returns an inferred TypeScript type that matches the schema.

Overall, this module provides a convenient way to validate and infer TypeScript types based on a given JS schema.

_docs/text-utils/explain.md

This file is a TypeScript module that exports several functions to convert raw Markdown text into formatted HTML. It depends on the built-in regular expression support in JavaScript.

Features of the module include:

- Converting different types of Markdown syntax into HTML tags, such as headers, bold and italic text, links, unordered and ordered lists, blockquotes, code blocks and inline code.
- Generating HTML code that conforms to proper indentation rules and tag nesting.
- Prettifying raw HTML code by indenting nested tags properly.

The main function in the module, `convertMarkdownToHTML`, takes raw Markdown text as an input and returns the equivalent HTML code as a string. The module also exports some utility functions for replacing and parsing specific Markdown syntax, as well as a helper function for prettifying raw HTML code. To use this module, a developer would import it into their TypeScript codebase and call the relevant functions from within their code.

_docs/security/explain.md

# Module Explanation

## Dependencies

This module has no external dependencies.

## Features

- `generateEncryptionKey`: A function that generates a random encryption key.
  - Returns a string.
  - The string consists of 32 characters, randomly selected from a pool of letters (both upper and lower case) and numbers.

## Technical Description

This module exports a single function named `generateEncryptionKey`. When called, the function generates a random encryption key by selecting 32 characters from a pool of possible characters. The pool consists of 62 different characters, including both upper and lower case letters and the digits 0 through 9.

To generate the key, the function loops 32 times, each time adding one character to the key string. During each iteration, a random index is selected within the pool of possible characters using `Math.floor(Math.random() * possibleChars.length)`. The character at this index is then added to the key string using the `key += possibleChars.charAt(...)` syntax.

Finally, the function returns the completed key string.

_docs/data-storage/explain.md

## Module: sqlite-interface.ts
### Dependencies:
- `bun:sqlite`
- `./validator`
- `./types`

### Features:
- Utility function `createTableQuery` to generate a SQL query for creating a new table in an SQLite database
- Type `CreateSqliteInterface` for defining a CRUD interface for an SQLite database table
- Function `createSqliteInterface` for creating an object that implements the `CreateSqliteInterface`

### Technical Description:
This module provides utility functions and types for creating and interacting with an SQLite database. The `createTableQuery` function takes a table name and a schema object and generates a SQL query for creating a new table in the database. The `CreateSqliteInterface` type defines a set of functions for creating, reading, updating, and deleting records in an SQLite database table, and `createSqliteInterface` is a function that returns an object that implements this interface. The module depends on the `bun:sqlite` package for connecting to the SQLite database, as well as the local `./validator` and `./types` modules for validating data and defining schema types.

_docs/fetcher/explain.md

This file exports a function `createFetcher` that returns an object containing functions to make HTTP requests. It depends on the `handleError` function from the `error-handler-validation` module.

Features:
- `get<Type>(endpoint: string): Promise<Type>`: makes a GET request to the specified endpoint and returns the response as a Promise of the specified type.
- `post<Type>({ endpoint, params, headers }): Promise<Type>`: makes a POST request with the specified endpoint, params, and headers and returns the response as a Promise of the specified type.
- `getStatus<Type>(endpoint: string): Promise<Type>`: makes a HEAD request to the specified endpoint and returns the response status as a Promise of the specified type.

Technical description:
The `createFetcher` function takes a `FetchOptions` object with a `baseUrl` string property and returns an object with three functions (`get`, `post`, and `getStatus`). Each function makes an HTTP request using the `fetch` API and returns a Promise that resolves with the deserialized response data of the specified type. The `handleResponse` function is used to handle the response returned by `fetch`, throwing an error if the status code is not in the 200 range. `handleError` is used to create an error object with the API error type and status text message.

_docs/jwt/explain.md

This file exports two functions, `jwtClient` and `jwtServer`, both of which are related to JSON Web Tokens (JWTs). 

This module depends on Node's built-in `crypto` module for generating HMAC signatures.

### jwtClient

`jwtClient` exports two methods: 

- `decodeJwt(token: string)`: decodes a JWT and returns the header and payload as a JavaScript object.
- `isJwtExpired(token: string)`: decodes a JWT, checks if it has an expiration time, and if so, compares it to the current time to determine if the token is expired.

### jwtServer

`jwtServer` exports two methods:

- `createJwt(payload: JwtPayload, secret: string, expiresIn: number = 60 * 60)`: creates a JWT with an optional expiration time and returns it as a string. The payload is expected to be a JavaScript object, and the `secret` parameter is used to generate the HMAC signature.
- `verifyJwt(token: string, secret: string): { header: JwtHeader, payload: JwtPayload }`: takes a JWT as a string, verifies its signature and expiration time, and returns the decoded header and payload as a JavaScript object.

This module makes use of the `base64UrlEncode` and `base64UrlDecode` functions to encode and decode JWT header and payload strings. It also uses the `sign` function to generate HMAC signatures for verifying and creating JWTs. 

The `JwtHeader` and `JwtPayload` interfaces define the expected shape of JWT headers and payloads. 

Overall, this module provides a convenient way to generate and verify JWTs, which are commonly used in authentication and authorization processes.

_docs/files-folder/explain.md

# Module: file-utils.js

## Dependencies
- fs
- path
- (local) error-handler-validation.js

## Features
- `getFilesForDirectory(directory, { ignoreFiles })`: returns an array of filenames for a given directory, excluding any files specified in the `ignoreFiles` array.
- `getFilesForDirectoryFromRoot(directory, { ignoreFiles })`: returns the same array of filenames as `getFilesForDirectory`, but the `directory` path is relative to the project root (determined by finding the first directory with a `tsconfig.json` file).
- `isRootFolder(folderPath)`: checks if a given folder is the project root directory (by checking for the presence of a `tsconfig.json` file).
- `findAppRoot(startingPath)`: recursively searches up the directory tree from `startingPath` to find the project root directory (using `isRootFolder`).
- `saveResultToFile(filePath, content)`: writes `content` to a file at `filePath`, creating any necessary directories in the process.
- `readFilesContents(filePaths)`: returns an array of objects, each containing a file path and its contents, for an array of file paths.

## Description
`file-utils.js` is a module containing utility functions for working with files and directories in a Node.js project. All functions are exported and can be used individually as needed. These functions are useful for tasks such as finding files, reading and writing files, and determining the project root directory. The module depends on the built-in Node.js modules `fs` and `path`, as well as the `error-handler-validation.js` module in the same project.

_docs/gpt-utils/explain.md

## Module: `debugPromptUtils.ts`

This module exports a single function `createDebugPromptFromInputOutput` that takes in two strings (`input` and `output`) and an optional object (`options`) with three optional properties (`functionName`, `moduleName`, `additionalContentToAppend`), and returns a string formatted with the given input and output, as well as the optional properties if they are provided.

### Dependencies

This module does not depend on any other modules.

### Features

- `createDebugPromptFromInputOutput`: a function that takes in two strings (`input` and `output`) and an optional object (`options`) with three optional properties (`functionName`, `moduleName`, `additionalContentToAppend`), and returns a string formatted with the given input and output, as well as the optional properties if they are provided.

### Technical Description

The `createDebugPromptFromInputOutput` function takes in three parameters: 

- `input`: a string representing the input to a function
- `output`: a string representing the output of the function
- `options` (optional): an object with three optional properties:
  - `functionName` (optional): a string representing the name of the function that was called
  - `moduleName` (optional): a string representing the name of the module in which the function was defined
  - `additionalContentToAppend` (optional): a string representing any additional content that should be included in the debug prompt

The function then constructs a string that starts with "I'm given:" and includes the `input`, followed by "Output:" and the `output`. If the `functionName` is provided, it includes "Function name:" and the `functionName` in the string. If the `moduleName` is provided, it includes "File name:" and the `moduleName` in the string. If `additionalContentToAppend` is provided, it includes "Additional content:" and the `additionalContentToAppend` in the string.

The function then returns the constructed string.

_docs/networking/explain.md

# Module Explanation

This module defines a `CrudServer` that handles CRUD operations for a given schema. It uses a `ServerRouter` to handle incoming requests, and can also handle WebSocket connections. It also includes a function to interact with the OpenAI completions API.

## Dependencies

The module depends on the following modules:
- `"bun"` - for server functionality and WebSocket support
- `"fetcher"` - for making HTTP requests to the OpenAI API
- `"./error-handler-validation"` and `"./types"` - for handling and validating errors and data types

## Features

- `createRouter`: creates a `ServerRouter` that can handle incoming requests based on predefined routes
- `createCrudServer`: creates a `CrudServer` that handles CRUD operations for a given schema, using a `ServerRouter` to handle incoming requests and WebSocket connections
- `useWebSockets`: returns an object containing functions to handle WebSocket connections
- `createOpenAICompletions`: a function that interacts with the OpenAI GPT-3 completions API, returning completions based on the given input prompt.

## Technical Description

The `createRouter` function creates a `ServerRouter` object that can add and handle custom routes. It keeps track of an array of `ServerRoute` objects, each defining a path, method, and handler function.

The `createCrudServer` function creates a `CrudServer` object that starts a server and listens for incoming requests. It uses a `ServerRouter` to handle incoming requests, comparing the requested path and method to defined routes. It also includes functions to handle WebSocket connections.

The `useWebSockets` function returns an object containing functions to handle WebSocket connections including `open`, `message`, `close`, `error`, and `drain`.

The `createOpenAICompletions` function creates an object that interacts with the OpenAI GPT-3 completions API. It contains a function `getCompletions` that receives a prompt and returns completions based on the input prompt. It uses the `fetcher` module to make HTTP requests to the API.

_docs/cli/explain.md

# Module: cli-helpers

## Dependencies:
- error-handler-validation
- fs
- path
- readline

## Features: 
- `getUserInput()`: A function that gets user input asynchronously.
- `parseCliArgs()`: A function that parses command line arguments.
- `createFileWithContent(filePath: string, content: string)`: A function that ensures a directory exists and creates a file with the given content.
- `directoryExists(directoryPath: string)`: A function that ensures a directory exists.
- `getModulesFromPath(directoryPath: string)`: A function that gets module names from a directory path.
- `getAdditionalPrompt()`: A function that prompts the user for additional input.
- `chooseActions(actionsConfig: Record<string, any>)`: A function that prompts the user to choose from available actions and returns the selected actions.

## Technical Description:
This module provides helper functions for command line interface (CLI) applications. 

`getUserInput()` uses the `spawn()` method of the `child_process` module to asynchronously get user input.

`parseCliArgs()` parses command line arguments by iterating through the arguments and checking if they match any of the predefined options with optional default values. It returns an object with the parsed arguments.

`createFileWithContent(filePath, content)` ensures that the directory containing the file specified in `filePath` exists and creates the file with the content specified in `content` using the `writeFileSync()` method of the `fs` module.

`directoryExists(directoryPath)` checks if a directory specified in `directoryPath` exists using the `existsSync()` method of the `fs` module, creates it if it doesn't exist, and logs a message to the console.

`getModulesFromPath(directoryPath)` reads the contents of a directory specified in `directoryPath` and returns an array of the names of each subdirectory using the `readdirSync()` method of the `fs` module.

`getAdditionalPrompt()` prompts the user for additional input and returns the user's input using the `createInterface()` method of the `readline` module.

`chooseActions(actionsConfig)` prompts the user to choose from a list of available actions specified in `actionsConfig`. It returns an array of keys corresponding to the selected actions.

_docs/error-handler-validation/explain.md

## Module: errorUtils.ts

### Dependencies:
- ./types

### Features:
- `ErrorType` type definition: a union type of string literals that represents the different types of errors (`"ValidationError"`, `"APIError"`, `"JavaScriptError"`).
- `CustomError` type definition: an object type that defines a custom error, consisting of a `type` property (ErrorType) and a `message` property (string).
- `apiErrorMap` object: a mapping of the ErrorType values to human-readable strings.
- `getErrorType(error: Error | CustomError): ErrorType` function: returns the ErrorType of an error, either by checking if it is a CustomError or by mapping a built-in JavaScript error to an ErrorType.
- `handleError(error: Error | CustomError, throwError = false): CustomError | undefined` function: creates a custom error from the provided error, throws the error if `throwError` is true, otherwise returns the custom error.
- `createValidator<Schema extends SchemaType>(schema: Schema)` function: a generic function that takes a schema (an object where each property represents the expected type of a key in an object) and returns an object with two methods: `validateAgainstArraySchema` that takes an array of data and returns a validated array of the same type as the schema, and `validateItem` that takes a single item and returns a validated item of the same type as the schema.

### Technical Description:
This module provides a set of utility functions to create and handle custom errors, as well as a function to create a schema validator. The `ErrorType` and `CustomError` type definitions are used to standardize the type of errors thrown in the application. The `apiErrorMap` object maps the ErrorType values to user-friendly strings that can be displayed in the UI. The `getErrorType` function checks if the error is a CustomError or a built-in JavaScript error and returns the appropriate ErrorType. The `handleError` function creates a custom error from the provided error, either by using it directly if it is a CustomError, or by mapping it to an ErrorType and creating a new CustomError. The `createValidator` function takes a schema and returns an object with two methods that can be used to validate data against the schema.

_docs/arduino/explain.md

## **File Explanation**

This file exports two functions, `createArduinoInterface` and `listPorts`, which work with Arduino devices over a serial port. The `createArduinoInterface` function creates a new interface with the Arduino device using the provided serial port and an optional baud rate. The `listPorts` function lists the available serial ports on the machine.

The file depends on two modules, `error-handler-validation` and `serialport`.

## **Module Features**

### **Function: createArduinoInterface**

This function creates a new interface with the Arduino device using the provided serial port and an optional baud rate. The function returns an object with two methods: `onData` and `write`.

#### **Method: onData**

The `onData` method takes a callback function that is executed every time new data is received from the Arduino device. The data is passed to the callback function as a string parameter.

#### **Method: write**

The `write` method takes a string parameter that is sent to the Arduino device over the serial port. The method returns a Promise that resolves when the data is successfully written to the device, and rejects with an error if the write operation fails.

### **Function: listPorts**

This function lists the available serial ports on the machine. It returns a Promise that resolves with an array of objects, each representing a single available serial port. Each object contains two properties: `path`, which represents the path of the serial port, and `manufacturer`, which represents the manufacturer of the device that is currently connected to the port.

## **Technical Description**

The `createArduinoInterface` function creates a new instance of the `SerialPort` class from the `serialport` module, which is used to establish a connection with the Arduino device over a serial port. The function takes an options object with two properties: `port`, which is the path of the serial port to use, and `baudRate`, which is the rate at which to communicate with the device (optional, defaults to 9600). The function returns an object with two methods: `onData` and `write`.

The `onData` method sets up an event listener on the `data` event of the `SerialPort` object, which is triggered every time new data is received from the device. When the event is triggered, the callback function provided in the `onData` method is executed with the received data passed as a string parameter. If an error occurs in the callback function, the `handleError` function from the `error-handler-validation` module is called with an object containing an error type of "APIError" and the error message.

The `write` method sends data to the Arduino device over the serial port using the `SerialPort` object's `write` method. The method takes a string parameter representing the data to be sent to the device. It returns a Promise that resolves when the data is successfully written to the device, and rejects with an error if the write operation fails. If an error occurs, the `handleError` function is called with an object containing an error type of "APIError" and the error message.

The `listPorts` function utilizes the `list` method from the `serialport` module to list all the available serial ports on the machine. The function maps over the array of ports, creating a new object for each port with the `path` and `manufacturer` properties, and returns an array of these objects. If an error occurs during the listing operation, the `handleError` function is called with an object containing an error type of "APIError" and the error message.