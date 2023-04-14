# createDebugPromptFromInputOutput

A function that generates a debug prompt message given input and output strings. The prompt message includes the input and output strings, as well as an optional function name and module name.

## Installation

```
npm install create-debug-prompt-from-input-output
```

## Usage

```js
import { createDebugPromptFromInputOutput } from 'create-debug-prompt-from-input-output';

const input = 'Hello, world!';
const output = 'Hola, mundo!';
const options = { functionName: 'greet', moduleName: 'greetings.js' };

const prompt = createDebugPromptFromInputOutput(input, output, options);
```

## API

### createDebugPromptFromInputOutput(input: string, output: string, options?: DebugPromptOptions): string

Generates a debug prompt message given input and output strings. 

#### Parameters:

- `input` (string): The input string to include in the debug prompt message.
- `output` (string): The output string to include in the debug prompt message.
- `options` (optional object):
  - `functionName` (string): The name of the function that generated the given output.
  - `moduleName` (string): The name of the module/file that contains the function that generated the given output.
  - `additionalContentToAppend` (string): Additional content to append to the end of the debug prompt message.

#### Returns:

- (string): The generated debug prompt message.

## License

MIT © [Your Name]