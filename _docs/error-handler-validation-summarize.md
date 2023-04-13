Summary:
- The module exports a type `ErrorType` and a type `CustomError`.
- The module exports a constant `apiErrorMap` which is an object of mapped errors.
- The module exports a function `getErrorType` which takes an error or custom error object as input, and returns the error type.
- The module exports a function `handleError` which takes an error or custom error object as input and an optional boolean `throwError`, and returns a custom error object or throws an error.
- The module exports a function `createValidator` which takes a schema object as input, and returns an object with two functions `validateAgainstArraySchema` and `validateItem` for validating data against the schema.

Exports:
- `ErrorType`
- `CustomError`
- `apiErrorMap`
- `getErrorType`
- `handleError`
- `createValidator`