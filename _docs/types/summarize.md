### Module Summary

This module defines a `TypeMapping` object that maps TypeScript types to their corresponding JavaScript types. It also provides a type inference utility function `infer`, which takes a `SchemaType` object and optional data as input, and returns a type-inferred object based on the given schema.

The module also includes types for validation results and the schema, as well as a utility type `TypeInference` that infers TypeScript types from the provided schema.

### Exports

This module exports the following items:

- `TypeMapping`: a type object that maps TypeScript types to JavaScript types.
- `TypeInference`: a utility type to infer TypeScript types from the schema.
- `ValidationResult`: a type for validation results.
- `SchemaType`: a type alias for defining the schema.
- `infer`: a function that infers the TypeScript types of an object based on the provided schema.