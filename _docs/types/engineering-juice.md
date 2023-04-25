### Functions

#### `infer`

- Input: `schema: SchemaType`, `data?: unknown`
- Output: `TypeInference<Schema>`
- Description: Infers TypeScript types from a given schema and data.

#### `TypeInference`

- Input: `T extends Record<string, keyof TypeMapping>`
- Output: `{[K in keyof T]: TypeMapping[T[K]];}`
- Description: Utility type to infer TypeScript types from the schema.

#### `ValidationResult`

- Input: `Schema extends Record<string, keyof TypeMapping>`
- Output: `{error?: string;data?: TypeInference<Schema>[];}`
- Description: Validates and returns either error or data, from the given schema.

#### `SchemaType`

- Output: `Record<string, keyof TypeMapping>`
- Description: Represents the schema type mapping.

#### `TypeMapping`

- Output: `{string: string;number: number;boolean: boolean;date: Date;}`
- Description: Represents the type mapping for strings, numbers, booleans, and dates.