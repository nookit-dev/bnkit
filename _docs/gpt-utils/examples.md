### Example 1

```typescript
const input = "hello";
const output = "olleh";
const options = {
  functionName: "reverseString",
  moduleName: "stringUtils.ts",
  additionalContentToAppend: "This function is used to reverse a string.",
};

const debugPrompt = createDebugPromptFromInputOutput(input, output, options);

console.log(debugPrompt);
```

This will output:

```
I'm given:
hello

Output:
olleh

Function name: reverseString
File name: stringUtils.ts

Additional content:
This function is used to reverse a string.
```

### Example 2

```typescript
const input = "hello";
const output = "hello";
const options = {
  functionName: "capitalizeString",
  moduleName: "stringUtils.ts",
};

const debugPrompt = createDebugPromptFromInputOutput(input, output, options);

console.log(debugPrompt);
```

This will output:

```
I'm given:
hello

Output:
hello

Function name: capitalizeString
File name: stringUtils.ts
```

### Example 3

```typescript
const input = "10, 20, 30";
const output = "60";
const options = {
  additionalContentToAppend:
    "This is the output of adding the numbers in the input string.",
};

const debugPrompt = createDebugPromptFromInputOutput(input, output, options);

console.log(debugPrompt);
```

This will output:

```
I'm given:
10, 20, 30

Output:
60

Additional content:
This is the output of adding the numbers in the input string.
```