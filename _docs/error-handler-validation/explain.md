# ErrorUtils Module

The `errorUtils.ts` module exports types, functions, and a validator creator that are useful for handling and validating errors in JavaScript code.

## Dependencies

The `errorUtils.ts` module depends on the following modules:

- `types.ts`: provides type definitions

## Features

The `errorUtils.ts` module provides the following features:

- `ErrorType`: a type alias for the three types of errors that the module can handle: `ValidationError`, `APIError`, and `JavaScriptError`
- `CustomError`: an interface for creating a custom error object with a type and message
- `apiErrorMap`: an object that maps `ErrorType` values to their respective string representations
- `mapBuiltInErrorType`: a function that maps built-in errors to `ErrorType` values
- `getErrorType`: a function that returns the `ErrorType` of an error object, whether it is a built-in error or a custom error
- `handleError`: a function that handles an error object, optionally throwing an error or returning a custom error
- `createValidator`: a function that creates a validator for a given schema, to validate items or arrays of items against their expected types.

## `createValidator` Function

The `createValidator` function creates a validator for a given schema that can be used to validate objects or arrays of objects against their expected types.

### Parameters

- `schema` (required): an object that defines the expected types of each property

### Return Value

The `createValidator` function returns an object with two methods:

- `validateAgainstArraySchema`: a function that validates an array of data against the given schema and returns a `ValidationResult` object with either the validated data or an error message
- `validateItem`: a function that validates a single item against the given schema and returns an object with the same structure as the `schema`, with values coerced to the expected types.

## Usage

To use the `errorUtils.ts` module, import the desired functionality from the module with the appropriate import statement, like this:

```typescript
import createValidator, { CustomError } from './errorUtils';
```

Then, use the imported functions and types in your JavaScript code to handle and validate errors.