## Functions

### `getErrorType(error: Error | CustomError): ErrorType`

- **Input:** `error: Error | CustomError`, an `Error` object or a `CustomError` object
- **Returns:** `ErrorType`, the type of the error (one of "ValidationError", "APIError", or "JavaScriptError")
- **Description:** Determines the type of the error object

### `handleError(error: Error | CustomError, throwError = false): CustomError | undefined`

- **Input:**
  - `error: Error | CustomError`, an `Error` object or a `CustomError` object
  - `throwError = false`, a boolean indicating whether or not to throw the error
- **Returns:** `CustomError | undefined`, a `CustomError` object or `undefined`
- **Description:** Handles the given error object, optionally throwing it

### `createValidator<Schema extends SchemaType>(schema: Schema)`

- **Input:** `schema: Schema`, a schema object
- **Returns:** An object with the following properties:
  - `validateAgainstArraySchema(schema: Schema, data: unknown[]): ValidationResult<Schema>`, a function that validates an array of objects against the given schema, returning a `ValidationResult<Schema>` object
  - `validateItem(item: unknown): TypeInference<Schema>`, a function that validates an object against the given schema, returning a `TypeInference<Schema>` object
- **Description:** Creates a validator object based on the given schema object, which can validate objects against the schema