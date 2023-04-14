_docs/text-utils/summarize.md

This module provides a number of functions and utilities for working with HTML and Markdown:

exports:
- `prettifyHTMLString(rawHTML: string): string`: Formats an HTML string with proper indentation and formatting
- `replaceMarkdown(text: string, regex: RegExp, replacement: string): string`: Replaces Markdown syntax with HTML tags
- `parseHeaders(text: string): string`: Parses Markdown headers into HTML headings
- `templatingEngine`: An empty object that can be used as a starting point for building a templating engine. 

Additionally, the `useMdToHtml()` function returns an object with several methods for parsing various Markdown elements into HTML, including:
- `parseBold(text: string): string`: Parses double asterisks (`**text**`) into HTML strong tags
- `parseItalic(text: string): string`: Parses single asterisks (`*text*`) into HTML emphasis tags
- `parseLinks(text: string): string`: Parses links (`[text](url)`) into HTML anchor tags
- `parseUnorderedLists(text: string): string`: Parses unordered lists (`- list item`) into HTML unordered lists
- `parseOrderedLists(text: string): string`: Parses ordered lists (`1. list item`) into HTML ordered lists.

Overall, this module provides helpful tools for working with HTML and Markdown, making it easier to parse and format text for use on the web.

_docs/cli/summarize.md

# Module Summary

The module includes functions for handling user input, parsing command line arguments, ensuring directory existence, creating files with content, and getting module names from a path.

## Exports

- `getUserInput()`: Asynchronously gets user input as a string.
- `parseCliArgs()`: Asynchronously parses command line arguments and returns an object with keyed values.
- `directoryExists(directoryPath: string)`: Ensures a directory exists at the provided path. If it doesn't exist, it creates the directory.
- `createFileWithContent(filePath: string, content: string)`: Ensures a directory exists at the path of the specified file, and creates the file with the specified content. If the directory doesn't exist, it creates the directory.
- `getModulesFromPath(directoryPath: string)`: Returns an array of module names found in the specified directory.

_docs/networking/summarize.md

## Module `bun`

### Exports
- `Server`: A class for creating and running a web server.
- `ServerWebSocket`: A class for handling WebSocket connections.
- `serve`: A function that creates a new server instance.

## Module `error-handler-validation`

### Exports
- `handleError`: A function for handling and validating errors.

## Module `types`

### Types
- `SchemaType`: An interface for defining a schema.
- `TypeMapping`: A mapping of data types to TypeScript types.

## Module `crud-server`

### Types
- `CrudServer`: An interface for defining a CRUD server.
- `ServerRoute`: An interface for defining a server route.
- `ServerRouter`: An interface for defining a server router.
- `CompletionsResponse`: An interface for defining a response from the OpenAI completions API.

### Functions
- `createFetcher<Type, ErrorType>()`: A function for creating a fetcher function that handles errors.
- `createRouter(routeConfigs?: ServerRoute[]): ServerRouter`: A function for creating a new server router instance.
- `createCrudServer<Schema extends Record<string, keyof TypeMapping>>({ router, port }: { router?: ServerRouter; port?: number }): CrudServer<Schema>`: A function for creating a new CRUD server instance.
- `useWebSockets(): Record<string, Function>`: A function that returns an object containing callback functions for WebSocket events.

## Module `openai-completions`

### Types
- `BaseOpenAICompletionsParams`: An interface for defining the parameters of a request to the OpenAI completions API.

### Functions
- `createOpenAICompletions<Type>({ apiKey }: { apiKey: string }): { getCompletions(params: BaseOpenAICompletionsParams): Promise<Type> }`: A function for creating a new instance of the OpenAI completions API client.

_docs/data-storage/summarize.md

## SQLite Interface Module

This module provides a convenient CRUD interface for SQLite databases, allowing users to easily create, read, update, and delete data.

### Exports

The following exports are available:

- `createTableQuery`: A utility function for creating a SQL CREATE TABLE query based on a provided schema object.
- `createSqliteInterface`: A function that creates an interface object for performing CRUD operations on a SQLite database.
- `CreateSqliteInterface`: A type definition for the interface object returned by `createSqliteInterface`.
- `TypeMapping`: A type definition for mapping TypeScript types to SQLite column types.
- `TypeInference`: A type definition for inferring the TypeScript type of a schema object based on its values.

### Usage

To use this module, first install it in your project:

```bash
npm install sqlite-interface
```

Then, import the desired exports:

```js
import { createSqliteInterface, CreateSqliteInterface, TypeMapping, TypeInference } from "sqlite-interface";
```

Next, create a schema object that defines the structure of your database table:

```js
const mySchema = {
  id: "INTEGER PRIMARY KEY AUTOINCREMENT",
  name: "TEXT",
  age: "INTEGER",
};
```

Note that the keys of the schema object define the column names, while their values map to SQLite column types.

Then, create a SQLite interface object by calling the `createSqliteInterface` function:

```js
const myInterface = createSqliteInterface("myTable", mySchema);
```

This function takes two arguments: the name of the database table, and the schema object.

The resulting interface object has four methods: `create`, `read`, `update`, and `deleteById`. These methods allow you to perform CRUD operations on your database.

For example, to create a new record:

```js
myInterface.create({ name: "John", age: 30 });
```

Or to read all records:

```js
const allRecords = await myInterface.read();
```

Or to update a record:

```js
myInterface.update(1, { age: 31 });
```

Or to delete a record:

```js
myInterface.deleteById(1);
```

_docs/types/summarize.md

## Module: Type Inference

### Exports:
- `TypeMapping`: A type that maps the supported data types to their corresponding TypeScript types.
- `TypeInference`: A utility type that infers TypeScript types from a given schema using `TypeMapping`.
- `ValidationResult`: A type that defines the return value of schema validation functions. It includes an optional error message and an array of objects that match the inferred types of the provided schema.
- `SchemaType`: A type that represents a schema, which is simply a `Record` with keys of `string` type and values of any type from `TypeMapping`.
- `infer`: A function that takes a schema and optional data as input, and returns an inferred object using `TypeInference`.

_docs/security/summarize.md

### Summary of Module Features
- Generates an encryption key consisting of 32 characters
- Uses a combination of uppercase and lowercase letters, as well as numbers
- Randomly selects characters from the possible characters string

### List of Exports
- `generateEncryptionKey` function: generates and returns the encryption key as a string.

_docs/gpt-utils/summarize.md

## Module Summary

This module contains a function (`createDebugPromptFromInputOutput`) that creates a debug prompt message from provided input and output strings. It also accepts optional parameters for specifying the function name, file name, and additional content to include in the prompt.

## Exports

### `DebugPromptOptions`

An object type that defines the optional parameters for creating a debug prompt message. It includes:
- `functionName`: a string representing the name of the function being debugged
- `moduleName`: a string representing the name of the file/module being debugged
- `additionalContentToAppend`: a string representing any additional information to append to the prompt message

### `createDebugPromptFromInputOutput(input: string, output: string, options?: DebugPromptOptions): string`

A function that creates a debug prompt message from provided input and output strings. It accepts optional parameters for specifying the function name, file name, and additional content to include in the prompt. It returns a string representing the complete debug prompt message.

_docs/error-handler-validation/summarize.md

## Overview

The `errorUtils` module provides utilities for handling and mapping errors. It also exports a `CustomError` type and an `ErrorType` union type for use across the application.

Additionally, the module exports a `createValidator` function that returns an object with methods for validating data against a schema.

## Exports

- `ErrorType`: a union type representing the types of errors that can occur in the application (`ValidationError`, `APIError`, or `JavaScriptError`).
- `CustomError`: an object type with `type` and `message` properties, used to wrap and handle errors.
- `apiErrorMap`: an object mapping `ErrorType` values to human-readable error messages.
- `getErrorType`: a function that takes an error object and returns its `ErrorType`, either by checking the error type directly or by mapping built-in `Error` types to an `ErrorType`.
- `handleError`: a function that takes an error object and a boolean flag indicating whether to re-throw the error, and returns a `CustomError`. If `throwError` is `true`, the function will also throw the `CustomError`.
- `createValidator`: a function that takes a schema object and returns an object with methods for validating data against that schema. The returned object includes `validateAgainstArraySchema` and `validateItem` methods.

_docs/files-folder/summarize.md

# Module Summary

This module provides functions for working with files and directories, including getting a list of files in a specific directory, finding the root directory of a project, and saving content to a file.

## Exports

- `getFilesForDirectory(directory: string, options?: { ignoreFiles?: string[] }): string[]`: Returns a list of files in the specified directory, excluding any files listed in the `ignoreFiles` array.
- `getFilesForDirectoryFromRoot(directory: string, options?: { ignoreFiles?: string[] }): string[]`: Returns a list of files in the specified directory relative to the project root, excluding any files listed in the `ignoreFiles` array.
- `findAppRoot(startingPath: string): string | null`: Returns the path to the root directory of the project that contains the specified `startingPath`.
- `saveResultToFile(filePath: string, content: string): Promise<void>`: Saves the given `content` to the file specified by `filePath`. Any missing directories in the path will be created automatically.