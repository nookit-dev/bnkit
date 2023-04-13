_docs/summarize.md

## Module Summary

This module provides utility functions for parsing and formatting HTML and markdown text. The main export is `prettifyHTMLString`, which takes a raw HTML string and formats it for better readability by indenting nested tags. Other exports include utility functions for parsing markdown syntax and replacing it with corresponding HTML tags.

## Exports

- `prettifyHTMLString(rawHTML: string): string` - Formats a raw HTML string by indenting nested tags for better readability.
- `replaceMarkdown(text: string, regex: RegExp, replacement: string): string` - Replaces instances of a regular expression in a string with a replacement string.
- `parseHeaders(text: string): string` - Parses markdown headers into corresponding HTML tags.
- `useMdToHtml()`: An object with the following methods for parsing various markdown syntax into HTML tags:
  - `parseBold(text: string): string`
  - `parseItalic(text: string): string`
  - `parseLinks(text: string): string`
  - `parseUnorderedLists(text: string): string`
  - `parseOrderedLists(text: string): string`
- `templatingEngine`: An empty object that currently does not hold any functionality.

_docs/summarize.md

## Module Summary

This module contains functions for handling user input, parsing command line arguments, file manipulation, directory validation, and extracting module names from a directory path.

## Exports

- `getUserInput(): Promise<string>` - a function that gets user input asynchronously and returns a promise that resolves with the user input as a string.

- `parseCliArgs(): Promise<ParsedArgs>` - a function that parses command line arguments and returns a promise that resolves with an interface defining the parsed arguments.

- `createFileWithContent(filePath: string, content: string): void` - a function that ensures a directory exists and creates a file with the specified content.

- `directoryExists(directoryPath: string): void` - a function that ensures a directory exists at the specified path.

- `getModulesFromPath(directoryPath: string): string[]` - a function that returns an array of module names extracted from the provided directory path.

_docs/summarize.md

## Module: `bun`

### Exports:
- `Server`: a class representing a web server that can be started and stopped
- `ServerWebSocket`: a class representing a WebSocket connection on the server side
- `serve`: a function that creates a new `Server` instance and starts it

### Functions:
- `createFetcher<Type, ErrorType>()`: creates a function that can be used to make HTTP requests with error handling
- `createRouter(routeConfigs?: ServerRoute[]): ServerRouter`: creates a router for handling HTTP requests
- `createCrudServer<Schema>()`: creates a CRUD server with API routes for create, read, update, and delete operations
- `useWebSockets()`: returns a set of functions for handling WebSocket connections

### Types:
- `SchemaType`: a type representing the schema of a database
- `TypeMapping`: a type mapping from schema keys to value types
- `RouteHandler`: a function that handles a HTTP request and returns a response
- `ServerRoute`: an object representing a route on the server with a path, HTTP method, and route handler function
- `ServerRouter`: an object representing a router on the server with functions for adding routes and handling requests
- `CrudServer<Schema>`: an object representing a CRUD server with functions for starting and stopping the server and a router for handling HTTP requests

### Interfaces:
- `CompletionChoice`: an interface representing a possible completion for OpenAI's GPT-3 model
- `CompletionsResponse`: an interface representing the response from the OpenAI GPT-3 completions API

### Usage:
This module provides several useful functions and types for creating web servers and handling HTTP requests and WebSocket connections. The `createFetcher` function can be used to create a function that can make HTTP requests with error handling, while the `createRouter` function can be used to create a router that can handle HTTP requests based on their path and HTTP method. The `createCrudServer` function can be used to create a full-featured CRUD server with API routes for create, read, update, and delete operations.

In addition, the `useWebSockets` function returns a set of functions for handling WebSocket connections. OpenAI's GPT-3 model is also supported through a set of interfaces and a function for creating completions with the model.

_docs/summarize.md

## Summary

This module provides functions for creating a SQLite interface for CRUD (create, read, update, delete) operations on a database table with a specified schema. It includes a utility function for generating SQL create table queries, as well as functions for validating and manipulating data based on the schema.

## Exports

- `createTableQuery(tableName: string, schema: Record<string, keyof TypeMapping>): string`: Utility function for generating a SQL CREATE TABLE query based on a table name and schema.

- `createSqliteInterface<Schema extends Record<string, keyof TypeMapping>>(tableName: string, schema: Schema): CreateSqliteInterface<Schema>`: Function for creating a CRUD interface for a SQLite database table based on a specified schema. Returns an object with functions for create, read, update, and delete operations.

- `TypeInference<T>`: Generic type for inferring the types of a record in the schema.

- `TypeMapping`: Object mapping of types used in the schema.

- `createValidator<T extends Record<string, keyof TypeMapping>>(schema: T): { validateItem: (item: any) => { error: string | null, data: any }, validateAgainstArraySchema: (schema: any, data: any) => { error: string | null, data: any } }`: Function for creating a data validator based on a specified schema. Returns an object with functions for validating individual items and arrays of items.

- `Database`: Class for connecting to and interacting with a SQLite database. Can be imported from the "bun:sqlite" package.

_docs/summarize.md

### Module Summary

This module defines a `TypeMapping` object that maps TypeScript types to their corresponding JavaScript types. It also provides a type inference utility function `infer`, which takes a `SchemaType` object and optional data as input, and returns a type-inferred object based on the given schema.

The module also includes types for validation results and the schema, as well as a utility type `TypeInference` that infers TypeScript types from the provided schema.

### Exports

This module exports the following items:

- `TypeMapping`: a type object that maps TypeScript types to JavaScript types.
- `TypeInference`: a utility type to infer TypeScript types from the schema.
- `ValidationResult`: a type for validation results.
- `SchemaType`: a type alias for defining the schema.
- `infer`: a function that infers the TypeScript types of an object based on the provided schema.

_docs/summarize.md

## Summary

This module exports a single function that generates a random encryption key string.

## Exports

### `generateEncryptionKey(): string`

Generates and returns a random encryption key string consisting of 32 characters, including uppercase and lowercase letters and digits.

_docs/summarize.md

## Summary

This module exports a function `createDebugPromptFromInputOutput` for generating a string prompt based on input and output values, with optional arguments for specifying function name, module name, and additional content to append.

## Exports

- `createDebugPromptFromInputOutput(input: string, output: string, options: DebugPromptOptions = {}): string` - Generates a string prompt based on input and output values, with optional arguments for specifying function name, module name, and additional content to append.
- `DebugPromptOptions` - An interface for defining optional parameters for `createDebugPromptFromInputOutput()`, including `functionName`, `moduleName`, and `additionalContentToAppend`.

_docs/summarize.md

### ErrorUtils Module

This module provides utility functions for handling and mapping errors.

#### Exported Types:

- `ErrorType`: a union type of strings representing different error types (`ValidationError`, `APIError`, `JavaScriptError`).
- `CustomError`: an interface describing a custom error with a `type` field and a `message` field.
- `ValidationError`: an interface extending `CustomError` specifically for validation errors.

#### Exported Constants:

- `apiErrorMap`: a map of error types to string representations.

#### Exported Functions:

- `getErrorType`: a function that takes an `Error` or a `CustomError` object and returns its type (`ErrorType`).
- `handleError`: a function that takes an `Error` or a `CustomError` object and an optional boolean flag to indicate if the error should be thrown. It returns a `CustomError` object if the flag is `false`, otherwise it throws the error.
- `createValidator`: a higher-order function that takes a schema of a certain type and returns an object with two functions: `validateAgainstArraySchema` and `validateItem`. These functions validate data against the schema either individually or as an array.

_docs/summarize.md

## Module Overview

This module provides functions for working with files and directories, specifically for retrieving file names from a specified directory, identifying the root directory of a project, and saving content to a file.

### Exports

- `getFilesForDirectory(directory: string, options: { ignoreFiles?: string[] }): string[]`: Retrieves a list of file names from the specified directory.
  - `directory`: The directory path to search for files.
  - `options.ignoreFiles`: An optional array of file names to exclude from the results.
- `getFilesForDirectoryFromRoot(directory: string, options: { ignoreFiles?: string[] }): string[]`: Retrieves a list of file names from the specified directory, starting from the root directory of the project.
  - `directory`: The directory path to search for files.
  - `options.ignoreFiles`: An optional array of file names to exclude from the results.
- `isRootFolder(folderPath: string): boolean`: Returns `true` if the provided folder path is the root directory of a project.
  - `folderPath`: The directory path to check.
- `findAppRoot(startingPath: string): string | null`: Uses the provided path to recursively search for the root directory of a project. Returns the root directory path or `null` if not found.
  - `startingPath`: The path to start the search from.
- `saveResultToFile(filePath: string, content: string): Promise<void>`: Writes content to the specified file path. Creates the file and any necessary directories if they do not exist.
  - `filePath`: The path of the file to write to.
  - `content`: The string to write to the file.

Note: Some functions accept a directory path argument with specific string values, such as `_apps` and `_tests`. These are likely project-specific and should be modified or removed for use in other projects.