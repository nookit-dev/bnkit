import { Database } from "bun:sqlite";
import { SchemaT, SchemaTInference } from "../types";

import {
  CreateSqliteTableFactoryParams,
  createSqliteTableFactory,
} from "./create-sqlite-table-factory";

export type CreateSqliteFactory<Schema extends SchemaT> = {
  create: (item: SchemaTInference<Schema>) => Promise<void>;
  read: () => Promise<SchemaTInference<Schema>[]>;
  update: (
    id: number,
    item: Partial<SchemaTInference<Schema>>
  ) => Promise<void>;
  deleteById: (id: number) => Promise<void>;
};

type CreateSqliteFactoryParams = {
  db: Database;
  debug?: boolean;
  enableForeignKeys?: boolean;
};

type DBTableFactoryParams<Schema extends SchemaT> = Omit<
  CreateSqliteTableFactoryParams<Schema>,
  "db"
> & {
  debug: boolean;
};

// Mapping of SQLite types to TypeScript types.
type SQLiteToTypeScriptTypes = {
  TEXT: string;
  NUMERIC: number | string;
  INTEGER: number;
  REAL: number;
  BLOB: any;
  DATE: Date;
};

// Mapped type that takes a schema with SQLite types and returns a schema with TypeScript types.
type SQLiteSchemaToTypeScript<
  T extends { [K in keyof T]: keyof SQLiteToTypeScriptTypes }
> = {
  [K in keyof T]: SQLiteToTypeScriptTypes[T[K]];
};

// Example usage.
const sqlitePersonTableSchema = {
  id: "TEXT",
  age: "INTEGER",
  name: "TEXT",
  createdAt: "DATE",
} as const;

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

  function dbTableFactory<Schema extends SchemaT>({
    debug: debugTable = debug || false,
    schema,
    tableName,
  }: DBTableFactoryParams<Schema>) {
    return createSqliteTableFactory(
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
