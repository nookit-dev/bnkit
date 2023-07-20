
export type TypeMapping = {
  string: string;
  number: number;
  boolean: boolean;
  date: Date;
}

export type TypeMappingKeys = keyof TypeMapping;

// Utility type to infer TypeScript types from the schema
export type SchemaTypeInference<T extends Record<string, keyof TypeMapping>> = {
  [K in keyof T]: TypeMapping[T[K]];
};

export type ValidationResult<Schema extends object> = {
  error?: string;
  data?: Schema[];
};

export type SchemaType = Record<string, keyof TypeMapping>;

export function infer<Schema extends SchemaType>(
  schema: Schema,
  data?: unknown
): SchemaTypeInference<Schema> {
  return data as SchemaTypeInference<Schema>;
}
