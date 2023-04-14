## Overview

The `errorUtils` module provides utilities for handling and mapping errors. It also exports a `CustomError` type and an `ErrorType` union type for use across the application.

Additionally, the module exports a `createValidator` function that returns an object with methods for validating data against a schema.

## Exports

- `ErrorType`: a union type representing the types of errors that can occur in the application (`ValidationError`, `APIError`, or `JavaScriptError`).
- `CustomError`: an object type with `type` and `message` properties, used to wrap and handle errors.
- `apiErrorMap`: an object mapping `ErrorType` values to human-readable error messages.
- `getErrorType`: a function that takes an error object and returns its `ErrorType`, either by checking the error type directly or by mapping built-in `Error` types to an `ErrorType`.
- `handleError`: a function that takes an error object and a boolean flag indicating whether to re-throw the error, and returns a `CustomError`. If `throwError` is `true`, the function will also throw the `CustomError`.
- `createValidator`: a function that takes a schema object and returns an object with methods for validating data against that schema. The returned object includes `validateAgainstArraySchema` and `validateItem` methods.