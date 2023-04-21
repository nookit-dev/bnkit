This file, errorUtils.ts, exports several types and functions related to error handling and validation. 

It depends on the following modules:
- "./types": for accessing the types SchemaType and TypeInference, which are used in creating a validator

Features:
- ErrorType type: a union type of strings used to represent different types of errors
- CustomError type: an object representing a custom error, with a type (from ErrorType) and a message
- apiErrorMap object: a mapping of ErrorType values to human-readable error messages
- getErrorType function: a function that takes an Error or CustomError and returns its type (either the custom type or a mapped built-in type)
- handleError function: a function that takes an Error or CustomError and an optional boolean flag, and returns a custom error object (or throws it if the flag is true)
- createValidator function: a generic function that takes a schema object and returns a validator object with two functions: validateItem (which validates a single item based on the schema) and validateAgainstArraySchema (which validates an array of items based on the schema)

Technical description:
This module provides functions and types for handling and mapping different types of errors, as well as a generic function for creating a validator object based on a provided schema. The createValidator function returns an object with two functions that can be used for validating data against the schema (either for one item or an array of items). The module also handles some common built-in error types and maps them to corresponding custom error types. Overall, this module provides useful tools for robust error handling and validation in TypeScript applications.