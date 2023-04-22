## Module: errorUtils.ts

### Dependencies:
- ./types

### Features:
- `ErrorType` type definition: a union type of string literals that represents the different types of errors (`"ValidationError"`, `"APIError"`, `"JavaScriptError"`).
- `CustomError` type definition: an object type that defines a custom error, consisting of a `type` property (ErrorType) and a `message` property (string).
- `apiErrorMap` object: a mapping of the ErrorType values to human-readable strings.
- `getErrorType(error: Error | CustomError): ErrorType` function: returns the ErrorType of an error, either by checking if it is a CustomError or by mapping a built-in JavaScript error to an ErrorType.
- `handleError(error: Error | CustomError, throwError = false): CustomError | undefined` function: creates a custom error from the provided error, throws the error if `throwError` is true, otherwise returns the custom error.
- `createValidator<Schema extends SchemaType>(schema: Schema)` function: a generic function that takes a schema (an object where each property represents the expected type of a key in an object) and returns an object with two methods: `validateAgainstArraySchema` that takes an array of data and returns a validated array of the same type as the schema, and `validateItem` that takes a single item and returns a validated item of the same type as the schema.

### Technical Description:
This module provides a set of utility functions to create and handle custom errors, as well as a function to create a schema validator. The `ErrorType` and `CustomError` type definitions are used to standardize the type of errors thrown in the application. The `apiErrorMap` object maps the ErrorType values to user-friendly strings that can be displayed in the UI. The `getErrorType` function checks if the error is a CustomError or a built-in JavaScript error and returns the appropriate ErrorType. The `handleError` function creates a custom error from the provided error, either by using it directly if it is a CustomError, or by mapping it to an ErrorType and creating a new CustomError. The `createValidator` function takes a schema and returns an object with two methods that can be used to validate data against the schema.