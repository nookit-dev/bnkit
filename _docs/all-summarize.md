text-utils.ts

This module provides functions to prettify HTML strings and to convert markdown syntax to HTML tags. The exports include:

- `prettifyHTMLString`: a function that takes a raw HTML string and adds indentation to make it more readable.
- `replaceMarkdown`: a utility function that replaces markdown syntax with HTML tags.
- `parseHeaders`: a function that parses headers in markdown syntax and replaces them with HTML tags.
- `useMdToHtml`: a function that returns an object with functions to parse markdown elements such as bold, italic, links, unordered lists, and ordered lists.
- `templatingEngine`: an empty object.

cli.ts

This module contains functions for handling user input, parsing command line arguments, creating files with content, ensuring directory existence, and getting module names from a given path. 

Exports:
- `getUserInput` - gets user input asynchronously and returns a Promise<string>
- `parseCliArgs` - parses command line arguments and returns a Promise of ParsedArgs interface
- `createFileWithContent` - creates a file with content at the given filePath
- `ensureDirectoryExists` - ensures that the given directoryPath exists
- `getModulesFromPath` - returns a list of module names from the given directoryPath

networking.ts

This module exports several functions and types for creating a CRUD server and working with websockets, as well as a function for making API requests to OpenAI's text completion API. 

Exports:
- createFetcher: a function for creating a fetcher function that handles errors
- Server, ServerWebSocket, and serve: from the "bun" library, used for creating and managing servers
- handleError: a function for handling errors with a standardized format
- SchemaType, TypeInference, TypeMapping: types used for defining schema and inferring types
- RouteHandler, ServerRoute, ServerRouter: types used for defining server routes and a server router
- createRouter: a function for creating a server router
- CrudServer, CrudServerRouter: types and functions for creating a CRUD server
- useWebSockets: a function that returns an object with functions for handling websocket connections
- CompletionChoice, CompletionsResponse: types for working with OpenAI's text completion API
- createOpenAICompletions: a function for making API requests to OpenAI's text completion API

data-storage.ts

This module exports utility functions and a CRUD interface for working with a SQLite database. 

Exports:
- `createTableQuery(tableName: string, schema: Schema): string`: Returns a SQL query string for creating a new table in the database.
- `createSqliteInterface(tableName: string, schema: Schema)`: Returns a CRUD interface for interacting with the specified table in the SQLite database. The interface includes methods for creating, reading, updating, and deleting data. 
- `CreateSqliteInterface`: A type that describes the shape of the CRUD interface returned by `createSqliteInterface`.
- `TypeInference`: A type that infers the data types of a schema object based on its values.
- `TypeMapping`: An object that maps types to their corresponding SQLite data types. 
- `createValidator(schema: Schema)`: Returns an object with methods for validating data against the specified schema.

types.ts

This module defines a TypeMapping for string, number, boolean, and date types, as well as a TypeInference utility type to infer TypeScript types from a schema. It also defines a ValidationResult type for validating data against a schema and a SchemaType for defining a schema. Finally, it exports the infer function for inferring types from a schema and data. 

Exports:
- TypeMapping
- TypeInference
- ValidationResult
- SchemaType
- infer

security.ts

This module exports a single function named `generateEncryptionKey` that generates a random 32-character string consisting of uppercase and lowercase letters, as well as numbers. 

Exports:
- `generateEncryptionKey`: function that returns a randomly generated 32-character string used as an encryption key.

gpt-utils.ts

This module exports a function called "createDebugPromptFromInputOutput" that takes in two string parameters "input" and "output", and an optional object parameter "options" with three possible properties - "functionName", "moduleName", and "additionalContentToAppend". This function returns a string prompt that includes the input and output parameters, as well as any additional information specified in the "options" object properties. 

Exports:
- createDebugPromptFromInputOutput: a function that creates a formatted debug prompt based on input and output strings, with optional additional information specified in the options object properties.

error-handler-validation.ts

Summary:
- The module exports a type `ErrorType` and a type `CustomError`.
- The module exports a constant `apiErrorMap` which is an object of mapped errors.
- The module exports a function `getErrorType` which takes an error or custom error object as input, and returns the error type.
- The module exports a function `handleError` which takes an error or custom error object as input and an optional boolean `throwError`, and returns a custom error object or throws an error.
- The module exports a function `createValidator` which takes a schema object as input, and returns an object with two functions `validateAgainstArraySchema` and `validateItem` for validating data against the schema.

Exports:
- `ErrorType`
- `CustomError`
- `apiErrorMap`
- `getErrorType`
- `handleError`
- `createValidator`

files-folder.ts

This module provides functions for getting a list of files within a directory, ignoring specified files, and finding the root directory of the current project. The main exports are:

- getFilesForDirectory(directory, { ignoreFiles }): returns a list of files within a specified directory, filtering out any files listed in the ignoreFiles array
- getFilesForDirectoryFromRoot(directory, { ignoreFiles }): same as getFilesForDirectory, but finds the root directory of the current project first
- isRootFolder(folderPath): checks if a given folder is the root directory of the project based on a specified condition (e.g. presence of a certain file)
- findAppRoot(startingPath): starting from a given path, finds the root directory of the project by repeatedly checking parent directories until a root folder is found.