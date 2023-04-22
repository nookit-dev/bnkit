Below is a generated output of what instant bun is:
Prompt
_docs/security/engineering-juice.md

generateEncryptionKey(): string: returns a randomly generated 32 character string that includes uppercase letters, lowercase letters, and digits.
_docs/gpt-utils/engineering-juice.md

Sorry, as an AI language model, I do not have access to the module or its functions. Could you please provide more information or context so I can better understand your request?

_docs/arduino/engineering-juice.md

Functions
createArduinoInterface
({ port: string, baudRate?: number }): { onData: (callback: (data: string) => void) => void, write: (data: string) => Promise<void> }

Creates an interface for connecting to and communicating with an Arduino device via serial port. Takes an object with port (string) and optional baudRate (number) properties. Returns an object with onData and write methods.

listPorts
() : Promise<Array<{ path: string; manufacturer: string }>>

Lists available serial ports. Returns a Promise that resolves to an array of port objects with path (string) and manufacturer (string) properties.

_docs/error-handler-validation/engineering-juice.md

Functions
getErrorType(error: Error | CustomError): ErrorType
Input: error of type Error or CustomError
Output: ErrorType
**Description`: Determines the error type based on the input error.
handleError(error: Error | CustomError, throwError = false): CustomError | undefined
Input: error of type Error or CustomError, throwError of type boolean (default false)
Output: CustomError or undefined
**Description`: Handles the input error by creating a custom error object or throwing an error.
createValidator<Schema extends SchemaType>(schema: Schema)
Input: schema of type SchemaType
Output: Object with functions validateAgainstArraySchema and validateItem
Description: Creates a validator object with two functions to validate data against a given schema.
_docs/text-utils/engineering-juice.md

Functions:

prettifyHTMLString(rawHTML: string): string - Input: string, Output: string. Formats raw HTML string by adding proper indentation and line breaks.
replaceMarkdown(text: string, regex: RegExp, replacement: string): string - Input: string, RegExp, string, Output: string. Replaces parts of a string that match a given regular expression with a replacement string.
convertMarkdownToHTML(markdownText: string): string - Input: string, Output: string. Converts markdown text to HTML format by applying various parsing rules.
isSelfClosingTag(attributes: string): boolean - Input: string, Output: boolean. Checks if the given HTML tag has a self-closing slash at the end.
updateIndent(isOpeningTag: boolean, indent: number): number - Input: boolean, number, Output: number. Updates the indentation level based on whether an HTML tag is an opening or closing one.
_docs/networking/engineering-juice.md

The module contains the following functions:

createRouter(routeConfigs?: ServerRoute[]): ServerRouter

Inputs: optional array of ServerRoute objects
Output: ServerRouter object
Creates a router object that can add routes and handle requests based on the routes.
createCrudServer<Schema extends Record<string, keyof TypeMapping>>({ router, port }: { router?: ServerRouter; port?: number; }): CrudServer

Inputs: optional ServerRouter object and port number
Output: CrudServer object
Creates a server that can handle CRUD operations and optional routing.
useWebSockets()

Inputs: none
Output: an object with WebSocket event handlers
Returns an object containing WebSocket event handlers such as open, message, close, error, and drain.
createOpenAICompletions({ apiKey }: { apiKey: string })

Inputs: an API key string
Output: an object with a function to fetch OpenAI completions
Returns an object containing a function to retrieve OpenAI text completions given a prompt.
_docs/jwt/engineering-juice.md

Functions
jwtClient()
Input: None

Output: Object with methods decodeJwt() and isJwtExpired()

decodeJwt(token: string)
Input: A JWT token string

Output: An object with the parsed header and payload sections of the JWT token

isJwtExpired(token: string)
Input: A JWT token string

Output: Boolean, true if the token is expired, else false

jwtServer(secret: string)
Input: A secret string used for signing JWT tokens

Output: Object with methods createJwt() and verifyJwt()

createJwt(payload: JwtPayload, secret: string, expiresIn: number = 60 * 60)
Input: An object containing the payload to be included in the JWT, the secret used to sign the JWT, and an optional expiration time (default 1 hour)

Output: A JWT token string

verifyJwt(token: string, secret: string)
Input: A JWT token string and the secret used to sign the token

Output: Object with the parsed header and payload sections of the JWT token if token is valid, otherwise throws an error

_docs/types/engineering-juice.md

Functions:
infer<Schema extends SchemaType>(schema: Schema, data?: unknown): TypeInference<Schema> - Input: Schema (Record of string keys and TypeMapping values), data (optional unknown type). Output: TypeInference<Schema>. Infers TypeScript types from a given schema and optionally provided data.
type TypeMapping = {string: string; number: number; boolean: boolean; date: Date;} - Defines a TypeMapping object with string keys and corresponding types.
type TypeInference<T extends Record<string, keyof TypeMapping>> = { [K in keyof T]: TypeMapping[T[K]]; } - Defines a TypeInference type for inferring TypeScript types from a given schema.
type ValidationResult<Schema extends Record<string, keyof TypeMapping>> = { error?: string; data?: TypeInference<Schema>[]; }; - Defines a ValidationResult type for validating a schema and returning error or data.
type SchemaType = Record<string, keyof TypeMapping>; - Defines a SchemaType type for defining a schema with string keys and corresponding TypeMapping values.
_docs/cli/engineering-juice.md

Functions
getUserInput()
Input: None
Output: Promise<string>
Description: Gets user input asynchronously.
parseCliArgs()
Input: None
Output: Promise<ParsedArgs>
Description: Parses and returns command line arguments.
createFileWithContent(filePath: string, content: string)
Input: filePath (string), content (string)
Output: None
Description: Ensures directory exists and creates file with the provided content.
directoryExists(directoryPath: string)
Input: directoryPath (string)
Output: None
Description: Ensures directory exists.
getModulesFromPath(directoryPath: string)
Input: directoryPath (string)
Output: Array<string>
Description: Gets module names from the provided path.
getAdditionalPrompt()
Input: None
Output: Promise<string>
Description: Returns a promise that resolves with user input.
chooseActions(actionsConfig: Record<string, any>)
Input: actionsConfig (Record<string, any>)
Output: Promise<Array<keyof typeof actionsConfig>>
Description: Returns a promise that resolves with selected action indexes.
_docs/fetcher/engineering-juice.md

Functions:
createFetcher({ baseUrl }: FetchOptions) => { get, post, getStatus }
Input: { baseUrl: string }
Output: { get: (endpoint: string) => Promise<Type>, post: ({ endpoint, params, headers }: { endpoint?: string; params?: any; headers?: Record<string, any>; }) => Promise<Type>, getStatus: (endpoint: string) => Promise<Type> }
Creates a fetch instance with base URL and returns three HTTP methods - get, post, and getStatus.

get<Type>(endpoint: string) => Promise<Type>
Input: endpoint: string
Output: Promise<Type>
Method to send a GET request to the specified endpoint and return a JSON response of specified type.

post<Type>({ endpoint, params, headers }: { endpoint?: string; params?: any; headers?: Record<string, any>; }) => Promise<Type>
Input: { endpoint?: string; params?: any; headers?: Record<string, any>; }
Output: Promise<Type>
Method to send a POST request to the specified endpoint with optional parameters and headers and return a JSON response of specified type.

getStatus<Type>(endpoint: string) => Promise<Type>
Input: endpoint: string
Output: Promise<Type>
Method to send a HEAD request to the specified endpoint to check status and return the JSON response of specified type.

handleResponse<Type>(response: Response) => Promise<Type>
Input: response: Response
Output: Promise<Type>
Handles the fetch response and throw an error in case of bad response code or returns JSON response of specified type.

_docs/data-storage/engineering-juice.md

Functions
createTableQuery(tableName: string, schema: Record<string, keyof TypeMapping>): string
Input: tableName (string), schema (Record<string, keyof TypeMapping>)
Output: string
Creates a SQL CREATE TABLE statement as a string based on tableName and schema
createSqliteInterface(tableName: string, schema: Record<string, keyof TypeMapping>): CreateSqliteInterface<Record<string, keyof TypeMapping>>
Input: tableName (string), schema (Record<string, keyof TypeMapping>)
Output: CreateSqliteInterface<Record<string, keyof TypeMapping>>
Creates a SQLite interface with CRUD methods based on tableName and schema
create(item: TypeInference<Schema>): Promise<void>
Input: item (TypeInference)
Output: Promise
Creates a new record in the SQLite database with the validated item
read(): Promise<TypeInference<Schema>[]>
Input: none
Output: Promise<TypeInference[]>
Reads data from the SQLite database and returns an array of validated records
update(id: number, item: Partial<TypeInference<Schema>>): Promise<void>
Input: id (number), item (Partial<TypeInference>)
Output: Promise
Updates a record in the SQLite database with the given id and validated item
deleteById(id: number): Promise<void>
Input: id (number)
Output: Promise
Deletes a record from the SQLite database with the given id
_docs/files-folder/engineering-juice.md

Functions
getFilesForDirectory(directory: string, { ignoreFiles }: { ignoreFiles?: string[] } = {}): string[]|undefined
Input:
directory: A string representing the directory path to retrieve the files from.
ignoreFiles: An optional array of strings representing the filenames to exclude from the returned array.
Output: An array of strings representing the filenames in the specified directory that were not ignored.
Description: Retrieves the filenames in the specified directory and filters out any ignored files.
getFilesForDirectoryFromRoot(directory: string, { ignoreFiles }: { ignoreFiles?: string[] } = {}): string[]|undefined
Input:
directory: A string representing the directory path to retrieve the files from, relative to the root path.
ignoreFiles: An optional array of strings representing the filenames to exclude from the returned array.
Output: An array of strings representing the filenames in the specified directory that were not ignored.
Description: Retrieves the filenames in the specified directory, relative to the app root path, and filters out any ignored files.
isRootFolder(folderPath: string): boolean|undefined
Input: A string representing a directory path.
Output: A boolean indicating whether the given directory is the root folder of an app.
Description: Checks if the given directory is the root folder of an app by checking if the tsconfig.json file exists in that path.
findAppRoot(startingPath: string): string|null|undefined
Input: A string representing a directory path.
Output: A string representing the app root directory path, or null if not found.
Description: Recursively checks the given directory and its parents until it finds the root directory of an app.
saveResultToFile(filePath: string, content: string): Promise<void>|undefined
Input:
filePath: A string representing the path to the file to be saved.
content: A string representing the content to be saved in the file.
Output: A promise that resolves when the file is saved successfully, or undefined if an error occurs.
Description: Saves the given content to the specified file.
readFilesContents(filePaths: string[]): { path: string; content: string }[]|undefined
Input: An array of strings representing the paths to the files to be read.
Output: An array of objects, each containing a path and content property representing the file name and content respectively.
Description: Reads the contents of the files in the specified paths and returns them as an array of objects containing the filename and content. Can you create a final text consolidation that explains the purpose of each moduless functions
Response
The generateEncryptionKey function generates a secure 32-character encryption key.

The createArduinoInterface function creates an interface to connect to and communicate with an Arduino device via serial port.

The getErrorType function determines the error type based on the input error, and the handleError function handles the input error by creating a custom error object or throwing an error.

The prettifyHTMLString function formats an HTML string with proper indentation and line breaks, and the convertMarkdownToHTML function converts markdown text to HTML format.

The createRouter and createCrudServer functions create a server with routing and CRUD functionality.

The jwtClient and jwtServer functions create client and server interfaces for generating and verifying JSON Web Tokens.

The createFetcher function creates a fetch instance with base URL and returns three HTTP methods - get, post, and getStatus - for making API requests.

The data storage module contains functions like createTableQuery to create a SQL table, and createSqliteInterface to create a SQLite interface for CRUD operations.

The files-folder module provides functions like getFilesForDirectory to retrieve filenames in a specified directory, and saveResultToFile to save content to a specified file.