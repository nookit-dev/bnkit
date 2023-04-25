## Functions

### `getUserInput()`
- Input: None
- Output: `Promise<string>`
- Asynchronously gets user input from the command line.

### `parseCliArgs()`
- Input: None
- Output: `Promise<ParsedArgs>`
- Parses command line arguments and returns an object with the parsed arguments.

### `createFileWithContent(filePath, content)`
- Input: `string`, `string`
- Output: `void`
- Ensures that the directory exists and then creates a file with the provided content and file path.

### `directoryExists(directoryPath)`
- Input: `string`
- Output: `void`
- Ensures that the directory exists, creating it if necessary.

### `getModulesFromPath(directoryPath)`
- Input: `string`
- Output: `Array<string>`
- Gets the module names from the provided directory path.

### `getAdditionalPrompt()`
- Input: None
- Output: `Promise<string>`
- Asynchronously prompts the user for additional input.

### `chooseActions(actionsConfig)`
- Input: `Record<string, any>`
- Output: `Promise<Array<keyof typeof actionsConfig>>`
- Asynchronously prompts the user to choose from a list of actions and returns the selected actions.