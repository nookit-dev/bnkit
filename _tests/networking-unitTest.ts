As an AI language model, I am not able to see your module code or understand its functionality. However, I can provide an example test case to give you an idea of how to write unit tests in Bun.

Example test case:

```typescript
import { test, expect } from "bun:test";
import createOpenAICompletions from "./openai-completions";

test("Get completions", async () => {
  const apiKey = "myApiKey";
  const completions = createOpenAICompletions({ apiKey });
  const result = await completions.getCompletions({ prompt: "hello world" });
  expect(result).toBeTruthy();
});
```

This test case tests the `getCompletions` function of the `createOpenAICompletions` module by passing a prompt and an API key. The test expects the result to be truthy, which means the API should return some kind of response.

You can write similar test cases for your own module based on your specific functionality and requirements.