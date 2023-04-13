Copy code

## Bun Testing - Engineering Summary

Bun is a fast test runner with a Jest-like API, supporting both JavaScript and TypeScript.

### 1. Installation

Bun comes with a built-in test runner, so no additional installations are needed.

### 2. File naming

Bun automatically searches for test files in the working directory using these patterns:

- \*.test.{js|jsx|ts|tsx}
- \*\_test.{js|jsx|ts|tsx}
- \*.spec.{js|jsx|ts|tsx}
- \*\_spec.{js|jsx|ts|tsx}

### 3. Filtering tests

Run a specific set of tests by passing file or directory names as filters:

bun test <filter> <filter> ...

sql
Copy code

### 4. Writing tests

Use the Jest-like API from the `bun:test` module to define tests, group them into suites, and handle asynchronous tests:

```typescript
import { expect, test, describe } from "bun:test";

describe("arithmetic", () => {
  test("2 + 2", () => {
    expect(2 + 2).toBe(4);
  });

  test("2 * 2", () => {
    expect(2 * 2).toBe(4);
  });
});

test("2 * 2", async () => {
  const result = await Promise.resolve(2 * 2);
  expect(result).toEqual(4);
});
5. Setup and teardown
Use beforeEach, afterEach, beforeAll, and afterAll for per-test or per-scope setup and teardown.

6. Skipping tests
Use test.skip to skip individual tests.

7. Expect matchers
Bun provides various matchers similar to Jest. Full Jest compatibility is planned for future releases.

By following these steps, you can write and run tests in Bun using a familiar Jest-like API.

arduino
Copy code

This text can be used in any markdown-supported environment for documentation or note-taking purposes.


```
