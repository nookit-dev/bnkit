#### Example 1

```javascript
const input = "Hello";
const output = "olleH";
const options = {
  functionName: "reverseString",
  moduleName: "stringUtils.js",
  additionalContentToAppend: "This is a helper function for manipulating strings."
};

const debugPrompt = createDebugPromptFromInputOutput(input, output, options);

console.log(debugPrompt);
```

Output:

```
I'm given:
Hello

Output:
olleH

Function name: reverseString
File name: stringUtils.js

Additional content:
This is a helper function for manipulating strings.
```

#### Example 2

```javascript
const input = "23,54,123";
const output = "300";
const options = {
  functionName: "sumValues",
  additionalContentToAppend: "This function calculates the sum of the values in a comma-separated string."
};

const debugPrompt = createDebugPromptFromInputOutput(input, output, options);

alert(debugPrompt);
```

Output (as an alert box):

```
I'm given:
23,54,123

Output:
300

Function name: sumValues

Additional content:
This function calculates the sum of the values in a comma-separated string.
```