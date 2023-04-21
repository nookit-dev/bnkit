# Debug Prompt Module

This module provides a utility function `createDebugPromptFromInputOutput` that makes it easy to create debug prompts with relevant information. 

## Installation

To install, simply run:

```
npm install debug-prompt
```

## Usage

```javascript
import { createDebugPromptFromInputOutput } from 'debug-prompt';

const input = '2, 3, 4';
const output = '10';

const options = {
  functionName: 'sumArray',
  moduleName: 'math.js',
  additionalContentToAppend: 'Check for edge cases',
};

const debugPrompt = createDebugPromptFromInputOutput(input, output, options);

console.log(debugPrompt);
// I'm given:
// 2, 3, 4
//
// Output:
// 10
//
// Function name: sumArray
// File name: math.js
//
// Additional content:
// Check for edge cases
```

## API

### `createDebugPromptFromInputOutput(input: string, output: string, options?: DebugPromptOptions): string`

This function returns a string that contains the input, output, and any additional information passed in through the `options` object. 

#### `input`

Type: `string`

The input that was given to the function or code being debugged.

#### `output`

Type: `string`

The output that was produced by the function or code being debugged.

#### `options`

Type: `DebugPromptOptions` (optional)

An object that contains additional information to be included in the debug prompt. 

##### `functionName`

Type: `string` (optional)

The name of the function being debugged.

##### `moduleName`

Type: `string` (optional)

The name of the module or file that contains the function being debugged.

##### `additionalContentToAppend`

Type: `string` (optional)

Any additional information that should be included in the debug prompt. 

## License

This module is licensed under the [MIT License](https://opensource.org/licenses/MIT).