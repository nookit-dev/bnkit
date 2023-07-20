import { Database } from "bun:sqlite";
import { SchemaType, SchemaTypeInference, TypeMapping } from "types";

import {
  CreateSqliteTableFactoryParams,
  createSqliteTableFactory,
} from "./create-sqlite-table-factory";

// Utility functions
export function createTableQuery<
  Schema extends Record<string, keyof TypeMapping>
>(tableName: string, schema: Schema): string {
  const fields = Object.entries(schema)
    .map(([key, type]) => `${key} ${type.toUpperCase()}`)
    .join(", ");

  return `CREATE TABLE IF NOT EXISTS ${tableName} (${fields});`;
}

export type CreateSqliteInterface<Schema extends SchemaType> = {
  create: (item: SchemaTypeInference<Schema>) => Promise<void>;
  read: () => Promise<SchemaTypeInference<Schema>[]>;
  update: (
    id: number,
    item: Partial<SchemaTypeInference<Schema>>
  ) => Promise<void>;
  deleteById: (id: number) => Promise<void>;
};

export function createSqliteFactory({
  db,
  debug,
}: {
  db: Database;
  debug?: boolean;
}) {
  function dbTableFactory<Schema extends SchemaType>({
    debug: debugTable = debug || false,
    schema,
    tableName,
  }: Omit<CreateSqliteTableFactoryParams<Schema>, "db">) {
    return createSqliteTableFactory({
      db,
      debug: debugTable,
      schema,
      tableName,
    });
  }

  return { dbTableFactory };
}
