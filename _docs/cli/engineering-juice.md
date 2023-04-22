## Functions

### `getUserInput()` 

- Input: None
- Output: Promise\<string\>
- Description: Gets user input asynchronously.

### `parseCliArgs()`

- Input: None
- Output: Promise\<ParsedArgs\>
- Description: Parses and returns command line arguments.

### `createFileWithContent(filePath: string, content: string)`

- Input: `filePath` (string), `content` (string)
- Output: None
- Description: Ensures directory exists and creates file with the provided content.

### `directoryExists(directoryPath: string)`

- Input: `directoryPath` (string)
- Output: None
- Description: Ensures directory exists.

### `getModulesFromPath(directoryPath: string)`

- Input: `directoryPath` (string)
- Output: Array\<string\>
- Description: Gets module names from the provided path.

### `getAdditionalPrompt()`

- Input: None
- Output: Promise\<string\>
- Description: Returns a promise that resolves with user input.

### `chooseActions(actionsConfig: Record<string, any>)`

- Input: `actionsConfig` (Record\<string, any\>)
- Output: Promise\<Array\<keyof typeof actionsConfig\>\>
- Description: Returns a promise that resolves with selected action indexes.