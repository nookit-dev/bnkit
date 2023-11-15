import { Database } from "bun:sqlite";

import {
  SqliteTableFactoryParams,
  sqliteTableFactory,
} from "./sqlite-table-factory";

type CreateSqliteFactoryParams = {
  db: Database;
  debug?: boolean;
  enableForeignKeys?: boolean;
};

type DBTableFactoryParams<Schema extends SchemaMap> = Omit<
  SqliteTableFactoryParams<Schema>,
  "db"
> & {
  debug?: boolean;
};

// Mapping of SQLite types to TypeScript types.
export type SQLiteToTypeScriptTypes = {
  TEXT: string;
  NUMERIC: number | string;
  INTEGER: number;
  REAL: number;
  BLOB: any;
  DATE: Date;
};

export type SQLiteDataTypes = keyof SQLiteToTypeScriptTypes;

export type FieldDefinition = {
  type: SQLiteDataTypes;
  primaryKey?: boolean;
  unique?: boolean;
  foreignKey?: string;
  required?: boolean;
  defaultValue?: string | number;
};

// Mapped type that takes a schema with SQLite types and returns a schema with TypeScript types.
export type SQLiteSchemaInfer<T extends SchemaMap> = {
  [K in keyof T]: T[K] extends FieldDefinition
    ? SQLiteToTypeScriptTypes[T[K]["type"]]
    : never;
};

export type SchemaMap = Partial<Record<string, FieldDefinition>>;

export const createTableSchema = <Schema extends SchemaMap>(
  schema: Schema
): string => {
  return undefined as any as string;
};

export const getType = <T extends SchemaMap>(
  schema: T
): SQLiteSchemaInfer<T> => {
  return undefined as any as SQLiteSchemaInfer<T>;
};

export function createSqliteFactory({
  db,
  debug = false,
  // because foreign keys in sqlite are disabled by default
  // https://renenyffenegger.ch/notes/development/databases/SQLite/sql/pragma/foreign_keys#:~:text=pragma%20foreign_keys%20%3D%20on%20enforces%20foreign,does%20not%20enforce%20foreign%20keys.&text=Explicitly%20turning%20off%20the%20validation,dump%20'ed%20database.
  // turning off foreign keys may be using when importing a .dump'ed database
  enableForeignKeys = false,
}: CreateSqliteFactoryParams) {
  if (enableForeignKeys) {
    // Enable foreign key constraints
    db.query("PRAGMA foreign_keys = ON;").run();
  }

  function dbTableFactory<Schema extends SchemaMap>({
    debug: debugTable = debug || false,
    schema,
    tableName,
  }: DBTableFactoryParams<Schema>) {
    return sqliteTableFactory(
      {
        db,
        schema,
        tableName,
      },
      {
        debug: debugTable,
        enableForeignKeys: debug,
      }
    );
  }

  return { dbTableFactory };
}
