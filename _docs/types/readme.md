# Module README

This module provides utility types and functions for working with JSON schemas that define the types of data to be validated or inferred in TypeScript.

## Types

### `TypeMapping`

A type mapping object that defines the correspondence between schema types (strings) and TypeScript types. The default mapping includes `string`, `number`, `boolean`, and `date`.

### `TypeInference<Schema>`

A utility type that infers TypeScript types from a given schema, based on its corresponding `TypeMapping`. The `Schema` type parameter should be a record that maps schema property names to schema type strings.

### `ValidationResult<Schema>`

A validation result object that contains either an error message or validated data (inferred TypeScript types), based on a given schema.

### `SchemaType`

A type alias for a record that maps schema property names to schema type strings.

## Functions

### `infer<Schema>(schema: Schema, data?: unknown): TypeInference<Schema>`

A function that performs type inference on the given `data` object, based on the given `schema`. If `data` is not provided, the function returns a stub object with the inferred types.

## Example Usage

```typescript
import { infer } from './index'

const schema = {
  name: 'string',
  age: 'number',
  isEmployed: 'boolean',
  dateOfBirth: 'date'
}

const data = {
  name: 'John Doe',
  age: 30,
  isEmployed: true,
  dateOfBirth: new Date('1990-01-01')
}

const inferredData = infer(schema, data)

// inferredData has type: {
//   name: string;
//   age: number;
//   isEmployed: boolean;
//   dateOfBirth: Date;
// }
```