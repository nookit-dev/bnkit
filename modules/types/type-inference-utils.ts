import { TypeMapping } from "./base-types";

// Utility type to infer TypeScript types from the schema
export type TypeInference<T extends Record<string, keyof TypeMapping>> = {
  [K in keyof T]: TypeMapping[T[K]];
};

export type ValidationResult<Schema extends Record<string, keyof TypeMapping>> =
  {
    error?: string;
    data?: TypeInference<Schema>[];
  };

export type SchemaType = Record<string, keyof TypeMapping>;

export function infer<Schema extends SchemaType>(
  schema: Schema,
  data?: unknown
): TypeInference<Schema> {
  return data as TypeInference<Schema>;
}
