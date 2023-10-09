import { TypeMapping } from "mod/types";
import { ForeignKeysT } from "../create-sqlite-table-factory";
import { formatForeignKeys } from "./format-foreign-keys";
import { formatSchema } from "./format-schema";

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
  foreignKeys?: ForeignKeysT<Schema>;
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
