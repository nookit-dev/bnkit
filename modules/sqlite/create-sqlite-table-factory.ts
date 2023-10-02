import Database from "bun:sqlite";
import { SchemaType, SchemaTypeInference } from "../types";
import { createTableQuery } from "./sqlite-utils/create-table-query-string";
import {
  createItem,
  deleteItemById,
  readItems,
  updateItem,
} from "./sqlite-utils/crud-fn-utils";

export type ForeignKeysType<Schema> =
  | { column: keyof Schema; references: string }[]
  | null;

export type CreateSqliteTableFactoryParams<Schema extends SchemaType> = {
  db: Database;
  tableName: string;
  schema: Schema;
};

export type CreateSqliteTableOptions<Schema extends SchemaType> = {
  debug?: boolean;
  enableForeignKeys?: boolean;
  foreignKeys?: ForeignKeysType<Schema>;
};

// Logger utility
function logger(debug: boolean) {
  return (...args: any[]) => {
    if (debug) {
      console.info(...args);
    }
  };
}

export function createSqliteTableFactory<Schema extends SchemaType>(
  params: CreateSqliteTableFactoryParams<Schema>,
  options: CreateSqliteTableOptions<Schema> = {}
) {
  const { db, schema, tableName } = params;
  const { debug = false, foreignKeys = null } = options;

  const log = logger(debug);

  db.query(createTableQuery({ tableName, schema, foreignKeys, debug })).run();

  // Pass necessary context to external CRUD functions
  function create(item: SchemaTypeInference<Schema>) {
    return createItem(db, tableName, log, item);
  }

  function read(): Schema[] {
    return readItems(db, tableName, log);
  }

  function update(id: string | number, item: Partial<Omit<Schema, "id">>) {
    updateItem(db, tableName, log, id, item);
  }

  function deleteById(id: number) {
    deleteItemById(db, tableName, log, id);
  }

  return {
    create,
    read,
    update,
    deleteById,
  };
}
