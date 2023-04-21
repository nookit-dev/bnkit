_docs/security/explain.md

This file contains a single exported function called "generateEncryptionKey()" which generates a random string of 32 alphanumeric characters. It depends on just the JavaScript built-in Math and String methods.

Features of the module:
- Generates a random encryption key
- Uses a combination of uppercase letters, lowercase letters, and numbers
- Returns the key as a string

Technical description:
The "generateEncryptionKey()" function initializes a variable called "possibleChars" with a string containing all possible characters to use in the encryption key. It then loops 32 times and randomly selects a character from "possibleChars" using the Math.random() method and adds it to the "key" variable using the String.charAt() method. Finally, it returns the complete "key" string.

_docs/text-utils/explain.md

This module is a tool for formatting and prettifying HTML and converting markdown syntax to HTML tags. It has several utility functions for handling different markdown elements, including headers, bold and italic text, links, and ordered and unordered lists. It also includes a templating engine of unspecified functionality. 

This module depends on regular expressions and the built-in string and array methods of JavaScript. 

Features of the module include: 
- Prettifying raw HTML code with proper indentation and line breaks
- Converting markdown syntax to HTML tags for headers, bold and italic text, links, and lists
- Ability to add custom functionality through the templating engine

Overall, this module provides useful tools for developers working with HTML and markdown syntax.

_docs/jwt/explain.md

This is a TypeScript module that exports two functions: `jwtClient` and `jwtServer`. 

The `jwtClient` function has two sub-functions: `decodeJwt`, which decodes a JWT and returns its header and payload as an object, and `isJwtExpired`, which checks if a given JWT has expired based on its `exp` (expiration time) claim.

The `jwtServer` function has two sub-functions: `createJwt`, which creates a JWT using a given payload, secret key, and expiration time, and `verifyJwt`, which verifies the signature of a given JWT and returns its header and payload.

This module depends on the built-in `crypto` module for hashing and signing.

Features of this module include JWT decoding, creation, and verification, as well as expiration checking. The technical implementation includes encoding and decoding JWT header and payload using Base64 and signing the JWT using a secret key with the HMAC-SHA256 algorithm.

_docs/gpt-utils/explain.md

This file exports a type called DebugPromptOptions and a function called createDebugPromptFromInputOutput. The function takes in two string parameters (input and output) and an optional object parameter (options) that can have properties of functionName, moduleName, and additionalContentToAppend. 

The function creates a string that displays the input and output of a given task/problem, including any additional content specified in the options object. If functionName or moduleName are specified, they will be included in the display string as well. 

This module does not depend on any other modules. 

The main feature of this module is to create a debug prompt for displaying input/output for a specific task/problem. The prompt can be customized with additional information such as function or module names. 

In technical terms, this module takes in two strings and an optional object parameter. It then creates a new string by concatenating the input and output strings along with any additional content specified in the options object. If functionName or moduleName are specified, they are also concatenated into the string. Finally, the resulting string is returned. The module utilizes basic string manipulation techniques and optional parameter handling.

_docs/data-storage/explain.md

This file is a module that exports a function called `createSqliteInterface`. It depends on the `bun:sqlite` package, the `createValidator` function from a separate file, and the `TypeInference` and `TypeMapping` types from another file. 

Features of the module are:
- `createTableQuery` function to create a table query string based on a schema object
- `CreateSqliteInterface` type for defining the interface of a SQLite database CRUD operations
- `createSqliteInterface` function to create a SQLite database CRUD interface based on a schema object and a table name

The `createSqliteInterface` function accepts a schema object that maps field names to data types, and a table name. It creates a new SQLite database using the `bun:sqlite` package and creates a table in the database based on the schema object. It then returns an object with four methods: `create`, `read`, `update`, and `deleteById`, which correspond to the CRUD operations for interfacing with the database. 

Overall, this module provides a simple and convenient way to create a SQLite database interface in TypeScript.

_docs/networking/explain.md

This module is a CRUD (Create, Read, Update, Delete) server for an API, with support for websockets and integration with OpenAI's API for generating completions. 

Dependencies: "bun" for serving http requests and websockets, "error-handler-validation" for handling and validating errors, and "types" for defining type mappings.

Features:
- A fetcher function for making http requests to the API.
- A router for defining and handling routes.
- A CRUD server for handling API requests, with support for creating, reading, updating, and deleting items.
- Integration with OpenAI's API for generating completions.
- Support for websockets for real-time communication.

Technical Description:
The module creates a fetcher function for making http requests to the API, and a router for defining and handling routes. It then creates a CRUD server for handling API requests, with support for creating, reading, updating, and deleting items. Additionally, it integrates with OpenAI's API for generating completions, using a function to create a completion client with an API key. The module also supports websockets for real-time communication with connected clients.

_docs/cli/explain.md

This file is a collection of utility functions for common tasks in command line interface (CLI) applications. 

Dependencies: 
- "error-handler-validation"
- "fs"
- "path"
- "readline"

Features:
- `getUserInput`: Asynchronously retrieves user input from the CLI.
- `parseCliArgs`: Parses CLI arguments into a JavaScript object, with support for different data types and default values.
- `createFileWithContent`: Creates a file with the given content and ensures the directory exists.
- `directoryExists`: Checks if a directory exists, and creates it if it does not exist.
- `getModulesFromPath`: Retrieves the names of all directories in a given path.
- `getAdditionalPrompt`: Asynchronously prompts the user for additional input.
- `chooseActions`: Asynchronously prompts the user to select from a list of available actions.

Technical description:
The module uses built-in Node.js modules such as `fs`, `path`, and `readline` to perform common CLI tasks. The functions are designed to be modular and reusable, with convenient abstractions for common actions such as file and directory creation, user input retrieval, and action selection. The `parseCliArgs` function supports a wide range of parameter types and allows for the specification of default values, making it suitable for use in a variety of CLI applications. Overall, this module provides a useful set of utilities for building command line interfaces in Node.js.

_docs/types/explain.md

This file defines several types and functions related to validating and inferring TypeScript types from a schema. 

Dependencies:
- TypeMapping: an object with keys representing primitive types and values representing their corresponding TypeScript types
- Date: built-in JavaScript date object

Features:
- TypeMapping: provides a standardized mapping from primitive types to TypeScript types
- TypeInference: a utility type that infers TypeScript types from a provided schema
- ValidationResult: a type that represents the result of validating data against a schema, including an optional error message and type-inferred data
- SchemaType: a type that represents a schema as an object with keys representing field names and values representing primitive types
- infer: a function that infers TypeScript types for data based on a provided schema

Technical Description:
The TypeMapping object provides a mapping between primitive types (such as 'string' or 'boolean') and their corresponding TypeScript types (such as 'string' or 'boolean'). The TypeInference type utilizes this mapping to infer TypeScript types from a provided schema. The ValidationResult type represents the result of validating data against a schema, including an optional error message and type-inferred data. The SchemaType type defines a schema as an object with keys representing field names and values representing primitive types. Finally, the infer function takes a schema and optional data, and returns the type-inferred data.

_docs/error-handler-validation/explain.md

This file, errorUtils.ts, exports several types and functions related to error handling and validation. 

It depends on the following modules:
- "./types": for accessing the types SchemaType and TypeInference, which are used in creating a validator

Features:
- ErrorType type: a union type of strings used to represent different types of errors
- CustomError type: an object representing a custom error, with a type (from ErrorType) and a message
- apiErrorMap object: a mapping of ErrorType values to human-readable error messages
- getErrorType function: a function that takes an Error or CustomError and returns its type (either the custom type or a mapped built-in type)
- handleError function: a function that takes an Error or CustomError and an optional boolean flag, and returns a custom error object (or throws it if the flag is true)
- createValidator function: a generic function that takes a schema object and returns a validator object with two functions: validateItem (which validates a single item based on the schema) and validateAgainstArraySchema (which validates an array of items based on the schema)

Technical description:
This module provides functions and types for handling and mapping different types of errors, as well as a generic function for creating a validator object based on a provided schema. The createValidator function returns an object with two functions that can be used for validating data against the schema (either for one item or an array of items). The module also handles some common built-in error types and maps them to corresponding custom error types. Overall, this module provides useful tools for robust error handling and validation in TypeScript applications.

_docs/files-folder/explain.md

This file is a collection of utility functions for working with files and directories in a Node.js application. 

Modules it depends on:
- fs: a built-in Node.js module for interacting with the file system
- path: a built-in Node.js module for working with file and directory paths

Features of the module:
- `getFilesForDirectory`: given a directory path, returns an array of file names (without extensions) within that directory, optionally ignoring specified files
- `getFilesForDirectoryFromRoot`: given a directory path relative to the root of the application (determined by searching upwards for a 'tsconfig.json' file), returns an array of file names (without extensions) within that directory, optionally ignoring specified files
- `isRootFolder`: determines whether a given path represents the root directory of the application (in this case, by checking for the presence of a 'tsconfig.json' file)
- `findAppRoot`: given a starting path, searches upward for the application root directory (see `isRootFolder` for definition)
- `saveResultToFile`: given a file path and contents, creates any necessary directories and writes the contents to the file
- `readFilesContents`: given an array of file paths, returns an array of objects containing the file name and contents

Technical description:
This file defines several functions that interact with the file system using the `fs` module and manipulate file paths using the `path` module. These functions can be used in a Node.js application to perform file-related tasks, such as finding files in a directory, reading file contents, and saving results to a file. Some of the functions are designed to work relative to the application root directory, which is determined by searching upwards for a specific file ('tsconfig.json' in this case) using the `findAppRoot` function. The `saveResultToFile` function also creates any directories needed to write to the specified file path. Overall, these functions provide useful utility for working with files and directories in a Node.js application.