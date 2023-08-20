import { TypeMapping } from "types";
import { ForeignKeysType } from "./create-sqlite-table-factory";

// Utility functions
export function formatSchema<Schema extends Record<string, keyof TypeMapping>>(
  schema: Schema
): string {
  return Object.entries(schema)
    .map(([key, type]) => `${key} ${type.toUpperCase()}`)
    .join(", ");
}

export function formatForeignKeys<
  Schema extends Record<string, keyof TypeMapping>
>(foreignKeys: ForeignKeysType<Schema> | undefined): string {
  if (!foreignKeys) return "";
  return foreignKeys
    .map(
      (fk) => `FOREIGN KEY (${String(fk.column)}) REFERENCES ${fk.references}`
    )
    .join(", ");
}

export function createTableQuery<
  Schema extends Record<string, keyof TypeMapping>
>({
  schema,
  tableName,
  debug = false,
  foreignKeys,
}: {
  tableName: string;
  schema: Schema;
  debug?: boolean;
  foreignKeys?: ForeignKeysType<Schema>;
}): string {
  if (debug) {
    console.info({ schema, tableName });
  }

  const fields = formatSchema(schema);
  const foreignKeysConstraints = formatForeignKeys(foreignKeys);

  let query = `CREATE TABLE IF NOT EXISTS ${tableName} (${fields});`;

  if (foreignKeysConstraints) {
    query = `CREATE TABLE IF NOT EXISTS ${tableName} (${fields}, ${foreignKeysConstraints});`;
  }

  if (debug) {
    console.info({ query, fields, schema, tableName });
  }

  return query;
}
