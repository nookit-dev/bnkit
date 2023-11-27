import { SchemaMap } from "../sqlite-factory";

export function formatSchema<Schema extends SchemaMap>(schema: Schema): string[] {
  return Object.entries(schema).map(([key, fieldDefinition]) => `${key} ${fieldDefinition?.type.toUpperCase()}`);
}
