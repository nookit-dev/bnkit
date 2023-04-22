## Module: `debugPromptUtils.ts`

This module exports a single function `createDebugPromptFromInputOutput` that takes in two strings (`input` and `output`) and an optional object (`options`) with three optional properties (`functionName`, `moduleName`, `additionalContentToAppend`), and returns a string formatted with the given input and output, as well as the optional properties if they are provided.

### Dependencies

This module does not depend on any other modules.

### Features

- `createDebugPromptFromInputOutput`: a function that takes in two strings (`input` and `output`) and an optional object (`options`) with three optional properties (`functionName`, `moduleName`, `additionalContentToAppend`), and returns a string formatted with the given input and output, as well as the optional properties if they are provided.

### Technical Description

The `createDebugPromptFromInputOutput` function takes in three parameters: 

- `input`: a string representing the input to a function
- `output`: a string representing the output of the function
- `options` (optional): an object with three optional properties:
  - `functionName` (optional): a string representing the name of the function that was called
  - `moduleName` (optional): a string representing the name of the module in which the function was defined
  - `additionalContentToAppend` (optional): a string representing any additional content that should be included in the debug prompt

The function then constructs a string that starts with "I'm given:" and includes the `input`, followed by "Output:" and the `output`. If the `functionName` is provided, it includes "Function name:" and the `functionName` in the string. If the `moduleName` is provided, it includes "File name:" and the `moduleName` in the string. If `additionalContentToAppend` is provided, it includes "Additional content:" and the `additionalContentToAppend` in the string.

The function then returns the constructed string.