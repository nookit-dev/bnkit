Example usage of the `errorUtils` module:

```typescript
import createValidator from "./validator";
import { CustomError, apiErrorMap } from "./errorUtils";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const userSchema = {
  id: "number",
  name: "string",
  email: "string",
  age: "number",
};

const validator = createValidator(userSchema);

function getUsers(): User[] {
  try {
    const rawData = fetch("https://myapi.com/users").then((res) => res.json());
    const validatedData = validator.validateAgainstArraySchema(userSchema, rawData);
    return validatedData.data;
  } catch (error) {
    const handledError = handleError(error);
    if (handledError) {
      const apiError = {
        type: "APIError",
        message: apiErrorMap[handledError.type] ?? handledError.message,
      } as CustomError;
      throw apiError;
    }
  }
}
```

In the example above, we first define a schema for our "User" object, which specifies the expected types for each property. We then use the `createValidator` function to create a validator object that we can use to validate data against this schema.

In the `getUsers` function, we first fetch some raw data from an external API, and then pass it through our validator using the `validateAgainstArraySchema` method. If any validation errors occur, we catch them and convert them into a more user-friendly "APIError" object using the `handleError` function and the `apiErrorMap` object.

Note that since `handleError` function can return `undefined`, we need to check for this when creating our "APIError" object. We do this using the nullish coalescing operator (`??`), which returns the value on the left if it is not null or undefined, and the value on the right otherwise.