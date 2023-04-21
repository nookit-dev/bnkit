### Example Usage of ErrorUtils Module

```typescript
import createValidator from "./validator";
import { CustomError, ErrorType } from "./errorUtils";

// Example schema for validating incoming data
const userSchema = {
  name: "string",
  age: "number",
  email: "string",
  address: {
    line1: "string",
    line2: "string",
    city: "string",
    state: "string",
    zip: "number",
  },
};

// Create a validator function for the schema
const userValidator = createValidator(userSchema);

// Example usage of validateItem function
try {
  const userData = {
    name: "John Doe",
    age: 32,
    email: "johndoe@example.com",
    address: {
      line1: "123 Main St",
      line2: "Apt 5",
      city: "Anytown",
      state: "CA",
      zip: 12345,
    },
  };

  const validatedUserData = userValidator.validateItem(userData);
  console.log(validatedUserData);

  /*
  Output:
  {
    name: "John Doe",
    age: 32,
    email: "johndoe@example.com",
    address: {
      line1: "123 Main St",
      line2: "Apt 5",
      city: "Anytown",
      state: "CA",
      zip: 12345,
    }
  }
  */
} catch (error) {
  // Handle errors using handleError function
  const handledError: CustomError = handleError(error);
  console.log(apiErrorMap[handledError.type]); // "JavaScript Error"
}

// Example usage of validateAgainstArraySchema function
try {
  const userData = [
    {
      name: "John Doe",
      age: 32,
      email: "johndoe@example.com",
      address: {
        line1: "123 Main St",
        line2: "Apt 5",
        city: "Anytown",
        state: "CA",
        zip: 12345,
      },
    },
    {
      name: "Jane Doe",
      age: 28,
      email: "janedoe@example.com",
      address: {
        line1: "456 Oak St",
        line2: "",
        city: "Somecity",
        state: "NY",
        zip: 67890,
      },
    },
  ];

  const validatedUserData = userValidator.validateAgainstArraySchema(
    userData
  );
  console.log(validatedUserData);

  /*
  Output:
  {
    data: [
      {
        name: "John Doe",
        age: 32,
        email: "johndoe@example.com",
        address: {
          line1: "123 Main St",
          line2: "Apt 5",
          city: "Anytown",
          state: "CA",
          zip: 12345,
        }
      },
      {
        name: "Jane Doe",
        age: 28,
        email: "janedoe@example.com",
        address: {
          line1: "456 Oak St",
          line2: "",
          city: "Somecity",
          state: "NY",
          zip: 67890,
        }
      }
    ]
  }
  */
} catch (error) {
  // Handle errors using handleError function
  const handledError: CustomError = handleError(error);
  console.log(apiErrorMap[handledError.type]); // "JavaScript Error"
}
```