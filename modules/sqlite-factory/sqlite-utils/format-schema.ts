import { TypeMapping } from "mod/types";

export function formatSchema<Schema extends Record<string, keyof TypeMapping>>(
    schema: Schema
  ): string {
    return Object.entries(schema)
      .map(([key, type]) => `${key} ${type.toUpperCase()}`)
      .join(", ");
  }
  