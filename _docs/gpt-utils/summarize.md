## Module Summary

This module provides a function for creating a debug prompt string from input and output strings, with the ability to optionally include function and file name information as well as additional content.

### Exports

- `DebugPromptOptions`: A TypeScript interface defining the optional inputs for the `createDebugPromptFromInputOutput` function.
- `createDebugPromptFromInputOutput`: A function that takes in input and output strings, along with optional `DebugPromptOptions`, and returns a debug prompt string.