# error-utils

A utility module for handling errors and creating validators.

## Handlers

### `getErrorType(error: Error | CustomError): ErrorType`

- `error` - An instance of an Error or CustomError.

Returns the type of error as a string, either "ValidationError", "APIError", or "JavaScriptError".

### `handleError(error: Error | CustomError, throwError = false): CustomError | undefined`

- `error` - An instance of an Error or CustomError.
- `throwError` - A boolean indicating whether to throw the error or return it.

Returns a CustomError object with a type and message property. If `throwError` is `true`, throws the error instead of returning it.

## Validators

### `createValidator<Schema>()`

- `schema` - An object representing the expected schema for validation.

Returns an object with two methods:

#### `validateItem(item: unknown): TypeInference<Schema>`

- `item` - An unknown value to validate against the schema.

Returns an object representing the validated item. Throws a `CustomError` if the input `item` is not an object or if it does not match the expected schema.

#### `validateAgainstArraySchema(schema: Schema, data: unknown[]): ValidationResult<Schema>`

- `schema` - An object representing the expected schema for validation.
- `data` - An array of unknown values to validate against the schema.

Returns an object with either a `data` property containing an array of validated items or an `error` property containing a validation error message.