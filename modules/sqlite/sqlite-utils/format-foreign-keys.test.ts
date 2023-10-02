import { expect, test } from "bun:test";
import { formatForeignKeys } from "./format-foreign-keys";

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
