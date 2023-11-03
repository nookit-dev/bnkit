import Database from "bun:sqlite";
import {
  CreateSqliteFactory,
  SQLiteSchemaToTypeScript,
  SchemaMap,
} from "./sqlite-factory";
import {
  createItem,
  deleteItemById,
  readItems,
  updateItem,
} from "./sqlite-utils/crud-fn-utils";
import { createTableQuery } from "./sqlite-utils/table-query-string";

export type ForeignKeysT<Schema> =
  | { column: keyof Schema; references: string }[]
  | null;

export type SqliteTableFactoryParams<Schema extends SchemaMap> = {
  db: Database;
  tableName: string;
  schema: Schema;
};

export type SqliteTableOptions<Schema extends SchemaMap> = {
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

export function sqliteTableFactory<
  Schema extends SchemaMap,
  TranslatedSchema extends SQLiteSchemaToTypeScript<Schema> = SQLiteSchemaToTypeScript<Schema>
>(
  params: SqliteTableFactoryParams<Schema>,
  options: SqliteTableOptions<Schema> = {}
) {
  const { db, schema, tableName } = params;
  const { debug = false, foreignKeys = null } = options;

  const log = logger(debug);

  db.query(createTableQuery({ tableName, schema, foreignKeys, debug })).run();

  // Pass necessary context to external CRUD functions
  function create(item: TranslatedSchema) {
    return createItem<Schema>(db, tableName, log, item);
  }

  function read(): TranslatedSchema[] {
    return readItems<Schema>(db, tableName, log) as TranslatedSchema[];
  }

  function update(
    id: string | number,
    item: Partial<Omit<TranslatedSchema, "id">>
  ) {
    updateItem<Schema>(db, tableName, log, id, item);
  }

  function deleteById(id: number| string) {
    deleteItemById(db, tableName, log, id);
  }

  function infer(): CreateSqliteFactory<Schema> {
    return undefined as any as CreateSqliteFactory<Schema>;
  }

  return {
    create,
    read,
    update,
    deleteById,
    infer,
  };
}
