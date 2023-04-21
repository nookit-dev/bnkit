## Summary

This module contains utility functions for handling and validating errors, as well as a function for creating data validators based on a provided schema. It exports various types and functions to be used in other modules.

## Exports

### Types

- `ErrorType`: a union type representing the different types of errors that can occur (`"ValidationError" | "APIError" | "JavaScriptError"`)
- `CustomError`: an object type representing a custom error, with a `type` property of type `ErrorType`, and a `message` property of type `string`

### Functions

- `apiErrorMap`: an object mapping `ErrorType` values to string error message descriptions
- `getErrorType(error: Error | CustomError): ErrorType`: a function that takes an `Error` or `CustomError` object and returns its `type` property, or maps a `JavaScriptError` based on the type of `Error`
- `handleError(error: Error | CustomError, throwError = false): CustomError | undefined`: a function that takes an `Error` or `CustomError` object, creates a `CustomError` object if necessary, and optionally throws the error or returns it
- `createValidator<Schema extends SchemaType>(schema: Schema)`: a function that takes a schema and returns an object with two methods:
  - `validateAgainstArraySchema(schema: Schema, data: unknown[]): ValidationResult<Schema>`: a function that validates an array of data against the provided schema, returning either an error message or an array of validated data
  - `validateItem(item: unknown): TypeInference<Schema>`: a function that validates a single item against the provided schema, returning an object with properties corresponding to the schema keys