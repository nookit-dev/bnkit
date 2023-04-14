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