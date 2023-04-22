## Functions

### `getErrorType(error: Error | CustomError): ErrorType`

- **Input**: `error` of type `Error` or `CustomError`
- **Output**: `ErrorType`
- **Description`: Determines the error type based on the input error.

### `handleError(error: Error | CustomError, throwError = false): CustomError | undefined`

- **Input**: `error` of type `Error` or `CustomError`, `throwError` of type `boolean` (default `false`)
- **Output**: `CustomError` or `undefined`
- **Description`: Handles the input error by creating a custom error object or throwing an error.

### `createValidator<Schema extends SchemaType>(schema: Schema)`

- **Input**: `schema` of type `SchemaType`
- **Output**: Object with functions `validateAgainstArraySchema` and `validateItem`
- **Description**: Creates a validator object with two functions to validate data against a given schema.