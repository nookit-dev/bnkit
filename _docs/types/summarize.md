## Module: Type Inference

### Exports:
- `TypeMapping`: A type that maps the supported data types to their corresponding TypeScript types.
- `TypeInference`: A utility type that infers TypeScript types from a given schema using `TypeMapping`.
- `ValidationResult`: A type that defines the return value of schema validation functions. It includes an optional error message and an array of objects that match the inferred types of the provided schema.
- `SchemaType`: A type that represents a schema, which is simply a `Record` with keys of `string` type and values of any type from `TypeMapping`.
- `infer`: A function that takes a schema and optional data as input, and returns an inferred object using `TypeInference`.