import { Database } from "bun:sqlite";

import {
  SqliteTableFactoryParams,
  sqliteTableFactory,
} from "./sqlite-table-factory";

export type CreateSqliteFactory<Schema extends SchemaMap> = {
  create: (item: SQLiteSchemaToTypeScript<Schema>) => Promise<void>;
  read: () => Promise<SQLiteSchemaToTypeScript<Schema>[]>;
  update: (
    id: number,
    item: Partial<SQLiteSchemaToTypeScript<Schema>>
  ) => Promise<void>;
  deleteById: (id: number) => Promise<void>;
};

type CreateSqliteFactoryParams = {
  db: Database;
  debug?: boolean;
  enableForeignKeys?: boolean;
};

type DBTableFactoryParams<Schema extends SchemaMap> = Omit<
  SqliteTableFactoryParams<Schema>,
  "db"
> & {
  debug: boolean;
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

export type SchemaKeys = keyof SQLiteToTypeScriptTypes;

export type SchemaMap = Partial<Record<string, SchemaKeys>>;

export const createTableSchema = <Schema extends SchemaMap>(
  schema: Schema
): string => {
  return undefined as any as string;
};

// Mapped type that takes a schema with SQLite types and returns a schema with TypeScript types.
export type SQLiteSchemaToTypeScript<T extends SchemaMap> = {
  [K in keyof T]: T[K] extends SchemaKeys
    ? SQLiteToTypeScriptTypes[T[K]]
    : never;
};

// Example usage.
const sqlitePersonTableSchema = {
  id: "TEXT",
  age: "INTEGER",
  name: "TEXT",
  createdAt: "DATE",
} satisfies SchemaMap;

export const getType = <T extends SchemaMap>(
  schema: T
): SQLiteSchemaToTypeScript<T> => {
  return undefined as any as SQLiteSchemaToTypeScript<T>;
};

type Person = SQLiteSchemaToTypeScript<typeof sqlitePersonTableSchema>;
//  => schema;

// TODO implement into the sqlite factory
type PersonTableSchema = SQLiteSchemaToTypeScript<
  typeof sqlitePersonTableSchema
>;

// This should now have the correct types.
let person: PersonTableSchema = {
  id: "some-id",
  age: 42,
  name: "some-name",
  createdAt: new Date(),
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
