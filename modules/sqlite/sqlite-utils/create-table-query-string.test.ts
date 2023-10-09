import { expect, test } from "bun:test";
import { createTableQuery } from "./create-table-query-string";

test("createTableQuery constructs SQL query correctly", () => {
  const schema = {
    id: "integer",
    name: "string",
  };

  const foreignKeys = [
    {
      column: "id",
      references: "other_table(id)",
    },
  ];

  const result = createTableQuery({
    schema,
    tableName: "test_table",
    foreignKeys,
  });

  expect(result).toBe(
    "CREATE TABLE IF NOT EXISTS test_table (id INTEGER, name STRING, FOREIGN KEY (id) REFERENCES other_table(id));"
  );
});
