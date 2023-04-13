This module provides utilities for working with data schemas and type mappings in TypeScript. The most important features include:

- A `TypeMapping` type that maps string keys to TypeScript types such as `string`, `number`, `boolean`, and `Date`.
- A `TypeInference` type that infers TypeScript types from a schema definition that maps string keys to `TypeMapping` keys.
- A `ValidationResult` type that represents the result of validating data against a schema and includes an optional error message and validated data.
- A `SchemaType` type that is a shorthand for a `Record` that maps string keys to `TypeMapping` keys.
- An `infer` function that takes a schema and optional data and infers the TypeScript types for the data based on the schema.

Exports:

- `TypeMapping`
- `TypeInference`
- `ValidationResult`
- `SchemaType`
- `infer`