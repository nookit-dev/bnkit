# Debug Prompt Module

This module exports the following:

- `DebugPromptOptions` type
- `createDebugPromptFromInputOutput` function

## DebugPromptOptions

This is a type that serves as the shape for the options object passed into `createDebugPromptFromInputOutput` function. It has the following optional properties:

- `functionName` (string): Name of the function being debugged
- `moduleName` (string): Name of the module/file containing the function being debugged
- `additionalContentToAppend` (string): Additional content that should be appended to the debug prompt

## createDebugPromptFromInputOutput

This is a function that takes three arguments:

- `input` (string): The input passed into the function being debugged
- `output` (string): The output of the function being debugged
- `options` (DebugPromptOptions): An optional object containing additional data about the function being debugged

The function returns a string that can be used as a debug prompt. It includes the input and output of the function being debugged, and any additional information provided in the `options` object.

### Example usage

```typescript
import { createDebugPromptFromInputOutput } from 'debug-prompt';

const input = 'hello';
const output = 'olleh';

const prompt = createDebugPromptFromInputOutput(input, output, {
  functionName: 'reverseString',
  moduleName: 'stringUtils.js',
  additionalContentToAppend: 'This function has a bug'
});

console.log(prompt);

// Output:
// I'm given:
// hello
//
// Output:
// olleh
//
// Function name: reverseString
// File name: stringUtils.js
//
// Additional content:
// This function has a bug
```