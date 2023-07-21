import { expect, test } from "bun:test";
import {
    createTableQuery,
    formatForeignKeys,
    formatSchema,
} from "./sqlite-utils";

test("formatSchema formats schema correctly", () => {
  const schema = {
    id: "integer",
    name: "string",
  };

  // TODO need to fix schema type
  const result = formatSchema(schema);
  expect(result).toBe("id INTEGER, name STRING");
});

test("formatForeignKeys formats foreign keys correctly", () => {
  const foreignKeys = [
    {
      column: "id",
      references: "other_table(id)",
    },
  ];

  const result = formatForeignKeys(foreignKeys);
  expect(result).toBe("FOREIGN KEY (id) REFERENCES other_table(id)");
});

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
