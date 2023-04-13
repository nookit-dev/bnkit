# Validation Module

This is a simple validation module written in TypeScript. It provides a `createValidator` function that takes in a schema definition and returns functions to validate data against the schema.

## Usage

To use this module, you can import it as follows:

```typescript
import createValidator from './validation';
```

Once you have the `createValidator` function, you can create a validator by passing a schema definition to it. For example:

```typescript
const userSchema = {
  name: 'string',
  age: 'number',
  email: 'string',
};

const validator = createValidator(userSchema);
```

The resulting `validator` object has two functions:

- `validateItem(item: unknown): TypeInference<Schema>`
- `validateAgainstArraySchema(schema: Schema, data: unknown[]): ValidationResult<Schema>`

These can be used to validate individual objects and arrays of objects against the schema, respectively. For example:

```typescript
const user = { name: 'John', age: 30, email: 'john@example.com' };

try {
  const validUser = validator.validateItem(user);
  console.log(validUser); // { name: 'John', age: 30, email: 'john@example.com' }
} catch (error) {
  console.error(error);
}

const users = [
  { name: 'John', age: 30, email: 'john@example.com' },
  { name: 'Jane', age: 25, email: 'jane@example.com' },
];

const result = validator.validateAgainstArraySchema(userSchema, users);

if (result.error) {
  console.error(result.error);
} else {
  console.log(result.data); // [{ name: 'John', age: 30, email: 'john@example.com' }, { name: 'Jane', age: 25, email: 'jane@example.com' }]
}
```

## Error Handling

If validation fails, the functions provided by this module will throw a `CustomError` object with a `type` and `message` field. The `type` field will be one of `"ValidationError"`, `"APIError"`, or `"JavaScriptError"`, depending on the nature of the error. The `message` field will contain a human-readable error message.

To catch and handle errors, you can use a try-catch block or pass `true` as the second argument to the `handleError` function provided by this module. For example:

```typescript
import { handleError } from './validation';

try {
  // do something that might throw a CustomError
} catch (error) {
  const handledError = handleError(error as Error);
  console.error(handledError);
}
```