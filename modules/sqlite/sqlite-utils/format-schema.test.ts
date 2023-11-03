import { expect, test } from "bun:test";
import { SchemaMap } from "../sqlite-factory";
import { formatSchema } from "./format-schema";

test("formatSchema formats schema correctly", () => {
  const schema = {
    id: "INTEGER",
    name: "TEXT",
  } satisfies SchemaMap;

  // TODO need to fix schema type
  const result = formatSchema(schema);
  expect(result).toBe("id INTEGER, name TEXT");
});
