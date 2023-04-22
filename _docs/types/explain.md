This module defines a few utility types and functions for validating and infering TypeScript types from a given schema. 

Dependencies:
- none

Features:
- `TypeMapping`: a type with mapping of common JS types to their TypeScript counterparts
- `TypeInference<T>`: a type that infers TypeScript types from a given schema object
- `ValidationResult<Schema>`: a type with either an error or inferred types data property for a given schema object
- `SchemaType`: a type that is a record with keys and values that correspond to properties and types
- `infer<Schema>`: a function that takes a schema object and optional data and returns an inferred TypeScript type that matches the schema.

Overall, this module provides a convenient way to validate and infer TypeScript types based on a given JS schema.