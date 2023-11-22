import Database from "bun:sqlite";
import { SQLiteSchemaInfer, SchemaMap } from "./sqlite-factory";
import {
  createItem,
  deleteItemById,
  readFirstItemByKey,
  readItemById,
  readItems,
  readItemsWhere,
  updateItem,
} from "./sqlite-utils/crud-fn-utils";
import { createTableQuery } from "./sqlite-utils/table-query-gen";

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
  TranslatedSchema extends SQLiteSchemaInfer<Schema> = SQLiteSchemaInfer<Schema>
>(
  params: SqliteTableFactoryParams<Schema>,
  options: SqliteTableOptions<Schema> = {}
) {
  const { db, schema, tableName } = params;
  const { debug = false } = options;

  const log = logger(debug);

  db.query(createTableQuery({ tableName, schema, debug })).run();

  return {
    readItemsWhere(where: Partial<TranslatedSchema>) {
      return readItemsWhere<Schema>(db, tableName, log, where);
    },
    create(item: TranslatedSchema) {
      return createItem<Schema>(db, tableName, log, item);
    },
    readAll(): TranslatedSchema[] {
      return readItems<Schema>(db, tableName, log) as TranslatedSchema[];
    },
    readById(id: string | number) {
      return readItemById<Schema>(db, tableName, log, id);
    },
    readItemByKey(key: string, value: string | number) {
      return readFirstItemByKey<Schema>(
        db,
        tableName,
        log,
        key,
        value
      ) as unknown as TranslatedSchema;
    },
    update(id: string | number, item: Partial<Omit<TranslatedSchema, "id">>) {
      return updateItem<Schema>(db, tableName, log, id, item);
    },
    deleteById(id: number | string) {
      return deleteItemById(db, tableName, log, id);
    },
    infer(): TranslatedSchema {
      return undefined as any as TranslatedSchema;
    },
  };
}
