text-utils.ts

This module provides a set of functions to handle Markdown to HTML conversion and prettify HTML code. The most important features of this module are:

1. `prettifyHTMLString`: This function takes a raw HTML string and returns a formatted and indented HTML string. It uses a stack to keep track of opening and closing tags, and updates the indent level accordingly.

2. `replaceMarkdown`: This is a utility function that replaces the Markdown syntax with HTML tags.

3. `parseHeaders`: This function parses Markdown headers and replaces them with `h1` to `h6` HTML tags.

4. `useMdToHtml`: This is a factory function that returns an object with functions to parse various Markdown elements including bold, italic, links, unordered lists, and ordered lists.

5. `replaceMarkdown` and `parseHeaders`: These functions are also exported individually.

6. `templatingEngine`: This is an empty object that can be used to add custom templating functionality. 

List of exports:
- `prettifyHTMLString`
- `replaceMarkdown`
- `parseHeaders`
- `useMdToHtml`
- `templatingEngine`

cli.ts

This module includes functions for handling user input, parsing command line arguments, creating and checking directories, and retrieving module names from a directory. 

Exports:
- `getUserInput()`: asynchronous function that retrieves user input
- `parseCliArgs()`: asynchronous function that parses command line arguments and returns an object of key/value pairs
- `createFileWithContent(filePath: string, content: string)`: function that creates a file with the given path and content
- `directoryExists(directoryPath: string)`: function that ensures a directory exists at the given path
- `getModulesFromPath(directoryPath: string)`: function that retrieves an array of module names from the given directory path

networking.ts

This module exports functions and types for creating a CRUD server and router, as well as a function for creating a fetcher to handle API requests. It also includes a function for creating OpenAI completions and a type for the response. The exports are:

- createFetcher: a function that creates a fetcher to handle API requests
- RouteHandler: a type for a function that handles a route request
- ServerRoute: a type for a server route with a path, method, and handler
- ServerRouter: a type for a server router with addRoute and handleRequest functions
- createRouter: a function that creates a router with addRoute and handleRequest functions
- CrudServer: a type for a CRUD server with start, stop, and router properties
- createCrudServer: a function that creates a CRUD server with a router and port number
- useWebSockets: a function that returns an object with functions for handling WebSocket connections
- CompletionsResponse: a type for the response from OpenAI completions
- createOpenAICompletions: a function that creates an object with a getCompletions function for retrieving OpenAI completions.

data-storage.ts

This module provides a utility function for creating a SQLite table query, as well as a factory function for creating a CRUD interface for a given SQLite table.

Exports:
- `createTableQuery(tableName: string, schema: Record<string, keyof TypeMapping>): string`: a utility function that creates a SQLite table query string based on the given schema.
- `createSqliteInterface(tableName: string, schema: Record<string, keyof TypeMapping>): CreateSqliteInterface<SchemaType>`: a factory function that creates a CRUD interface object for the given SQLite table, using the given schema. The interface object has `create`, `read`, `update`, and `deleteById` methods for performing CRUD operations on the table.

types.ts

This module provides utilities for working with data schemas and type mappings in TypeScript. The most important features include:

- A `TypeMapping` type that maps string keys to TypeScript types such as `string`, `number`, `boolean`, and `Date`.
- A `TypeInference` type that infers TypeScript types from a schema definition that maps string keys to `TypeMapping` keys.
- A `ValidationResult` type that represents the result of validating data against a schema and includes an optional error message and validated data.
- A `SchemaType` type that is a shorthand for a `Record` that maps string keys to `TypeMapping` keys.
- An `infer` function that takes a schema and optional data and infers the TypeScript types for the data based on the schema.

Exports:

- `TypeMapping`
- `TypeInference`
- `ValidationResult`
- `SchemaType`
- `infer`

security.ts

This module exports a single function: `generateEncryptionKey()`. It generates a random encryption key that consists of 32 characters, including uppercase and lowercase letters, and numbers. The function uses a string of possible characters and a loop with the `Math.random()` function to create the key. The key is then returned as a string.

gpt-utils.ts

This module includes a function called `createDebugPromptFromInputOutput` that takes in two strings (an input and an output), as well as optional parameters for function name, file name, and additional content. It returns a single string that summarizes the input, output, and any additional information provided.

Exports:
- `createDebugPromptFromInputOutput` (function)

error-handler-validation.ts

This module exports several types including ErrorType and CustomError. It also exports a map of API errors, a function to map built-in error types, a function to get the error type, and a function to handle errors. Additionally, the module exports a createValidator function that returns an object with two validation functions. 

Exports:
- ErrorType
- CustomError
- apiErrorMap
- getErrorType
- handleError
- createValidator

files-folder.ts

This module consists of several functions for working with files and directories:

- `getFilesForDirectory(directory, options)`: returns an array of filenames in the specified directory, excluding those listed in the `ignoreFiles` option.
- `getFilesForDirectoryFromRoot(directory, options)`: similar to the above function, but starts from the root of the project rather than the current working directory.
- `isRootFolder(folderPath)`: returns true if the given folder contains a `tsconfig.json` file.
- `findAppRoot(startingPath)`: searches upwards from the given starting path to find the root of the project (i.e. the folder containing the `tsconfig.json` file).
- `saveResultToFile(filePath, content)`: writes the given content to the specified file path.

Exports:

- `getFilesForDirectory`
- `getFilesForDirectoryFromRoot`
- `isRootFolder`
- `findAppRoot`
- `saveResultToFile`