_docs/security/summarize.md

### Summary:

This module exports a function called `generateEncryptionKey` that generates a 32-character string consisting of letters and numbers.

### List of exports:
- `generateEncryptionKey`: a function that returns a randomly generated 32-character string consisting of letters and numbers.

_docs/gpt-utils/summarize.md

## Module Summary

This module provides a function for creating a debug prompt string from input and output strings, with the ability to optionally include function and file name information as well as additional content.

### Exports

- `DebugPromptOptions`: A TypeScript interface defining the optional inputs for the `createDebugPromptFromInputOutput` function.
- `createDebugPromptFromInputOutput`: A function that takes in input and output strings, along with optional `DebugPromptOptions`, and returns a debug prompt string.

_docs/types/summarize.md

## TypeMapping
- A type alias that maps Javascript types to their corresponding TypeScript types.

## TypeInference
- A utility type that infers TypeScript types from a provided schema.

## ValidationResult
- A type that represents the result of validating data against a schema.

## SchemaType
- A type alias for a schema object that maps keys to Javascript types.

## infer
- A function that infers TypeScript types for provided schema and data.

### Exports:
- TypeMapping
- TypeInference
- ValidationResult
- SchemaType
- infer

_docs/cli/summarize.md

## Module: 

This module includes several functions to handle common tasks such as parsing command line arguments, interacting with the file system, and getting user input. 

### Exports:

- `getUserInput(): Promise<string>` - retrieves user input asynchronously and returns a string

- `ParsedArgs` - interface for parsed command line arguments

- `parseCliArgs(): Promise<ParsedArgs>` - parses command line arguments and returns an object of parsed arguments

- `createFileWithContent(filePath: string, content: string)` - ensures a directory exists and creates a file with the given content

- `directoryExists(directoryPath: string)` - ensures a directory exists

- `getModulesFromPath(directoryPath: string)` - gets module names from a given directory path

_docs/data-storage/summarize.md

## Summary

This module provides a utility function for creating SQLite database tables, as well as a CRUD interface for interacting with those tables. It also includes a validator for ensuring that data adheres to the specified schema.

## Exports

- `createTableQuery`: a function that takes a table name and schema, and returns a SQL query string for creating the table
- `CreateSqliteInterface`: a type describing the CRUD interface for a given schema
- `createSqliteInterface`: a function for creating an instance of the CRUD interface for a given schema

## Dependencies

- `bun:sqlite`: a SQLite database driver
- `./validator`: a module containing functions for validating data against a schema
- `./types`: a module containing type definitions for working with schema mappings

_docs/jwt/summarize.md

This module provides functions for decoding, encoding, signing, and verifying JSON Web Tokens (JWTs), as well as checking if a JWT has expired. The `jwtClient` function returns an object with a `decodeJwt` function and an `isJwtExpired` function, while the `jwtServer` function takes a secret string and returns an object with a `createJwt` function and a `verifyJwt` function.

Exports:

- `jwtClient(): { decodeJwt: (token: string) => { header: JwtHeader; payload: JwtPayload; }; isJwtExpired: (token: string) => boolean; }`
- `jwtServer(secret: string): { createJwt: (payload: JwtPayload, secret: string, expiresIn?: number) => string; verifyJwt: (token: string, secret: string) => { header: JwtHeader; payload: JwtPayload; }; }`
- `JwtHeader: interface { alg: string; typ: string; }`
- `JwtPayload: interface { exp?: number; [key: string]: any; }`

_docs/text-utils/summarize.md

This module provides functions for prettifying HTML and parsing markdown syntax into corresponding HTML tags.

Exports:
- `prettifyHTMLString`: function that takes a raw HTML string and returns the formatted HTML string with proper indentation.
- `replaceMarkdown`: utility function that replaces markdown syntax with corresponding HTML tags.
- `parseHeaders`: utility function that parses header syntax in markdown text and returns the corresponding HTML headers.
- `useMdToHtml`: function that returns an object with methods for parsing various markdown elements into corresponding HTML tags.

Raw Markdown:
This module provides functionality for formatting HTML and parsing markdown syntax. It exports the following functions and object:
- `prettifyHTMLString`: function that takes an HTML string and returns a formatted string with proper indentation.
- `replaceMarkdown`: utility function that replaces markdown syntax with corresponding HTML tags.
- `parseHeaders`: utility function that parses header syntax in markdown text and returns the corresponding HTML headers.
- `useMdToHtml`: function that returns an object with methods for parsing various markdown elements into corresponding HTML tags.
- `templatingEngine`: empty object.

_docs/files-folder/summarize.md

## Module Summary

This module provides functions for finding and working with files within a project directory. It includes functions for getting a list of files in a directory, finding the root directory of a project, saving results to a file, and reading the contents of multiple files at once.

### Exports

- `getFilesForDirectory(directory: string, options: { ignoreFiles?: string[] }): string[]`: Returns a list of file names in the given directory, filtered to exclude any files in the `ignoreFiles` array.
- `getFilesForDirectoryFromRoot(directory: string, options: { ignoreFiles?: string[] }): string[]`: Returns a list of file names in the directory relative to the root directory of the project. Calls `getFilesForDirectory` with the full path to the target directory.
- `isRootFolder(folderPath: string): boolean`: Returns `true` if the given folder path represents the root directory of a project (determined by the presence of a `tsconfig.json` file)
- `findAppRoot(startingPath: string): string | null`: Searches for the root directory of a project starting from the given directory path, and returns the full path to the project root. Returns `null` if no root directory is found.
- `saveResultToFile(filePath: string, content: string): Promise<void>`: Creates any necessary directories and writes the given content to the given file path. Returns a Promise that resolves when the save is complete.
- `readFilesContents(filePaths: string[]): { path: string, content: string }[]`: Returns an array of objects representing the content of the files at the given file paths, where each object includes the file name and contents.

_docs/error-handler-validation/summarize.md

## Summary

This module contains utility functions for handling and validating errors, as well as a function for creating data validators based on a provided schema. It exports various types and functions to be used in other modules.

## Exports

### Types

- `ErrorType`: a union type representing the different types of errors that can occur (`"ValidationError" | "APIError" | "JavaScriptError"`)
- `CustomError`: an object type representing a custom error, with a `type` property of type `ErrorType`, and a `message` property of type `string`

### Functions

- `apiErrorMap`: an object mapping `ErrorType` values to string error message descriptions
- `getErrorType(error: Error | CustomError): ErrorType`: a function that takes an `Error` or `CustomError` object and returns its `type` property, or maps a `JavaScriptError` based on the type of `Error`
- `handleError(error: Error | CustomError, throwError = false): CustomError | undefined`: a function that takes an `Error` or `CustomError` object, creates a `CustomError` object if necessary, and optionally throws the error or returns it
- `createValidator<Schema extends SchemaType>(schema: Schema)`: a function that takes a schema and returns an object with two methods:
  - `validateAgainstArraySchema(schema: Schema, data: unknown[]): ValidationResult<Schema>`: a function that validates an array of data against the provided schema, returning either an error message or an array of validated data
  - `validateItem(item: unknown): TypeInference<Schema>`: a function that validates a single item against the provided schema, returning an object with properties corresponding to the schema keys

_docs/networking/summarize.md

## List of Exports

- `createFetcher<Type, ErrorType>()`: A function that creates and returns a fetcher function to handle API requests/responses.
- `RouteHandler`: A type that represents a request handler for a specific route.
- `ServerRoute`: An object that contains information about a specific server route, including its path, method, and handler.
- `ServerRouter`: An interface that defines a router for a server.
- `createRouter(routeConfigs?: ServerRoute[]): ServerRouter`: A function that creates a new ServerRouter instance with optionally provided server route configurations.
- `CrudServer<Schema extends SchemaType>`: A type that represents a CRUD server for a specific schema type.
- `createCrudServer<Schema extends Record<string, keyof TypeMapping>>({ router, port }: { router?: ServerRouter; port?: number; }): CrudServer<Schema>`: A function that creates a new CRUD server instance with optional router and port configurations.
- `useWebSockets(): {...}`: A function that returns an object containing callback functions for handling WebSocket events.
- `CompletionChoice`: A type that represents a completion choice object returned by the OpenAI API.
- `CompletionsResponse`: A type that represents the response object returned by the OpenAI API for generating completions.
- `BaseOpenAICompletionsParams`: An interface that defines the parameters for requesting completions from the OpenAI API.
- `createOpenAICompletions<Type>({ apiKey }: { apiKey: string }): {...}`: A function that creates an OpenAI completions instance with a provided API key and returns an object containing methods for requesting completions from the OpenAI API.

## Key Features

- Provides functions and types for handling and validating API requests/responses.
- Allows for creating and configuring a router for handling server requests.
- Enables the creation of CRUD servers for specific schema types.
- Offers a set of callback functions for handling WebSocket events.
- Provides methods for generating completions using the OpenAI API.