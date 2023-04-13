To create a debug prompt with just input and output:

```typescript
const input = 'Hello world!';
const output = 'Hola mundo!';
const prompt = createDebugPromptFromInputOutput(input, output);

console.log(prompt);
```

This will output:

```
I'm given:
Hello world!

Output:
Hola mundo!
```

To add function and file name to the prompt:

```typescript
const input = '3.1415';
const output = '3.14';
const prompt = createDebugPromptFromInputOutput(input, output, {
  functionName: 'roundNumber',
  moduleName: 'math-utils.ts',
});

console.log(prompt);
```

This will output:

```
I'm given:
3.1415

Output:
3.14

Function name: roundNumber
File name: math-utils.ts
```

To add additional content to the prompt:

```typescript
const input = '123456';
const output = '654321';
const additionalContent = 'The input and output are reversed!';
const prompt = createDebugPromptFromInputOutput(input, output, {
  additionalContentToAppend: additionalContent,
});

console.log(prompt);
```

This will output:

```
I'm given:
123456

Output:
654321

Additional content:
The input and output are reversed!
```