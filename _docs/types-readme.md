# Type Mapping Utility

This module provides a utility for defining a type mapping and validating data against a schema. It also includes a type inference function to automatically infer TypeScript types based on a given schema.

## Usage

Start by defining your schema:

```typescript
const schema = {
  id: 'number',
  name: 'string',
  isVerified: 'boolean',
  createdAt: 'date'
}
```

Then, you can validate data against this schema using the `ValidationResult` type and the `TypeInference` utility type:

```typescript
import { TypeInference, ValidationResult } from 'type-mapping-utility';

type MyData = TypeInference<typeof schema>;

const data: unknown = {
  id: 1,
  name: 'John Doe',
  isVerified: true,
  createdAt: new Date()
};

const result: ValidationResult<typeof schema> = {
  data: [data as MyData]
};
```

You can also use the `infer` function to automatically infer TypeScript types based on the schema:

```typescript
const myData = infer(schema, data);
// myData is of type MyData: { id: number, name: string, isVerified: boolean, createdAt: Date }
```

## API

### `TypeMapping`

A type mapping defines the mapping between string type names and their actual types. By default, the following type mapping is defined:

```typescript
type TypeMapping = {
  string: string;
  number: number;
  boolean: boolean;
  date: Date;
};
```

### `TypeInference<Schema>`

This utility type automatically infers TypeScript types based on a given schema. It takes a `Schema` type, which is a record of keys (string) and values (string literals representing the types from the `TypeMapping`).

### `ValidationResult<Schema>`

This type represents the result of validating data against a schema. It can either have an `error` property if the validation failed, or a `data` property containing the validated data.

### `SchemaType`

This is a type alias for a record with string keys and values that match the keys from the `TypeMapping`.

### `infer<Schema>(schema: Schema, data?: unknown): TypeInference<Schema>`

This function infers TypeScript types based on the given schema and data. It takes a `schema` argument of type `SchemaType` and an optional `data` argument of type `unknown`. Returns an object of inferred TypeScript types based on the schema.

## Installation

This module is available as an npm package:

```
npm install type-mapping-utility
```