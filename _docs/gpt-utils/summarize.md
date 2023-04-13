## Summary

This module exports a function `createDebugPromptFromInputOutput` for generating a string prompt based on input and output values, with optional arguments for specifying function name, module name, and additional content to append.

## Exports

- `createDebugPromptFromInputOutput(input: string, output: string, options: DebugPromptOptions = {}): string` - Generates a string prompt based on input and output values, with optional arguments for specifying function name, module name, and additional content to append.
- `DebugPromptOptions` - An interface for defining optional parameters for `createDebugPromptFromInputOutput()`, including `functionName`, `moduleName`, and `additionalContentToAppend`.