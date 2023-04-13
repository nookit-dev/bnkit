### ErrorUtils Module

This module provides utility functions for handling and mapping errors.

#### Exported Types:

- `ErrorType`: a union type of strings representing different error types (`ValidationError`, `APIError`, `JavaScriptError`).
- `CustomError`: an interface describing a custom error with a `type` field and a `message` field.
- `ValidationError`: an interface extending `CustomError` specifically for validation errors.

#### Exported Constants:

- `apiErrorMap`: a map of error types to string representations.

#### Exported Functions:

- `getErrorType`: a function that takes an `Error` or a `CustomError` object and returns its type (`ErrorType`).
- `handleError`: a function that takes an `Error` or a `CustomError` object and an optional boolean flag to indicate if the error should be thrown. It returns a `CustomError` object if the flag is `false`, otherwise it throws the error.
- `createValidator`: a higher-order function that takes a schema of a certain type and returns an object with two functions: `validateAgainstArraySchema` and `validateItem`. These functions validate data against the schema either individually or as an array.