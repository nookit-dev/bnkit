# Type Mapping Utility

This TypeScript module provides utility types and functions for working with type mappings.

## Installation

To install this module, run the following command:

```bash
npm install type-mapping-utility
```

## Usage

### TypeMapping

The `TypeMapping` type is a TypeScript type definition that maps JavaScript types to their corresponding TypeScript types.

### TypeInference

The `TypeInference` type is a TypeScript type definition that infers TypeScript types from a schema that maps keys to `TypeMapping` values.

### ValidationResult

The `ValidationResult` type is a TypeScript type definition that represents the result of validating data against a schema.

### SchemaType

The `SchemaType` type is a TypeScript type definition that represents a schema mapping keys to `TypeMapping` values.

### infer()

The `infer()` function is a TypeScript function that infers TypeScript types from data and a schema.

## Example

```typescript
import { infer } from 'type-mapping-utility';

const schema = {
  name: 'string',
  age: 'number',
  isEmployed: 'boolean',
  lastLogin: 'date',
};

const data = {
  name: 'John Doe',
  age: 35,
  isEmployed: true,
  lastLogin: new Date(),
};

const inferredData = infer(schema, data);

console.log(inferredData.name); // "John Doe"
console.log(inferredData.age); // 35
console.log(inferredData.isEmployed); // true
console.log(inferredData.lastLogin); // Date object
```

## License

This module is licensed under the MIT License. See the LICENSE file for more information.