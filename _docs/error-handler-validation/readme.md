# Error Utils

This module contains utility functions for handling and mapping errors in JavaScript applications.

## Error Types

There are three types of errors handled by this module: ValidationError, APIError, and JavaScriptError. Custom errors can also be defined using the CustomError type.

## API Error Map

An API error map is provided for mapping API errors to their corresponding type.

## Error Type Mapping

The `mapBuiltInErrorType` function maps built-in JavaScript errors to their corresponding ErrorType.

## Error Handling

The `handleError` function can be used to handle errors by returning a CustomError object or throwing the error if `throwError` is set to true.

## Validator

The `createValidator` function returns a validator object with two methods: `validateAgainstArraySchema` and `validateItem`. These can be used to validate data against a schema and return the validated data or an error message.