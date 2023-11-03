import { expect, test } from "bun:test";
import { SchemaMap } from "../sqlite-factory";
import { createTableQuery } from "./table-query-string";

test("createTableQuery constructs SQL query correctly with foreign keys", () => {
  const schema = {
    id: "INTEGER",
    name: "TEXT",
  } satisfies SchemaMap;

  const result = createTableQuery({
    schema,
    tableName: "test_table",
    foreignKeys: [
      {
        column: "id",
        references: "other_table(id)",
      },
    ],
  });

  expect(result).toBe(
    "CREATE TABLE IF NOT EXISTS test_table (id INTEGER, name TEXT, FOREIGN KEY (id) REFERENCES other_table(id));"
  );
});

test("createTableQuery constructs SQL query correctly without foreign keys", () => {
  const schema = {
    id: "INTEGER",
    name: "TEXT",
  } satisfies SchemaMap;

  const result = createTableQuery({
    schema,
    tableName: "test_table",
  });

  expect(result).toBe(
    "CREATE TABLE IF NOT EXISTS test_table (id INTEGER, name TEXT);"
  );
});
