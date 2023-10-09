import Database from "bun:sqlite";
import { SchemaT, SchemaTInference } from "../types";
import { createTableQuery } from "./sqlite-utils/create-table-query-string";
import {
  createItem,
  deleteItemById,
  readItems,
  updateItem,
} from "./sqlite-utils/crud-fn-utils";

export type ForeignKeysT<Schema> =
  | { column: keyof Schema; references: string }[]
  | null;

export type CreateSqliteTableFactoryParams<Schema extends SchemaT> = {
  db: Database;
  tableName: string;
  schema: Schema;
};

export type CreateSqliteTableOptions<Schema extends SchemaT> = {
  debug?: boolean;
  enableForeignKeys?: boolean;
  foreignKeys?: ForeignKeysT<Schema>;
};

// Logger utility
function logger(debug: boolean) {
  return (...args: any[]) => {
    if (debug) {
      console.info(...args);
    }
  };
}

export function createSqliteTableFactory<Schema extends SchemaT>(
  params: CreateSqliteTableFactoryParams<Schema>,
  options: CreateSqliteTableOptions<Schema> = {}
) {
  const { db, schema, tableName } = params;
  const { debug = false, foreignKeys = null } = options;

  const log = logger(debug);

  db.query(createTableQuery({ tableName, schema, foreignKeys, debug })).run();

  // Pass necessary context to external CRUD functions
  function create(item: SchemaTInference<Schema>) {
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
