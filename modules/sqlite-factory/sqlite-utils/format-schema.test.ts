import { expect, test } from "bun:test";
import { formatSchema } from "./format-schema";

test("formatSchema formats schema correctly", () => {
  const schema = {
    id: "integer",
    name: "string",
  };

  // TODO need to fix schema type
  const result = formatSchema(schema);
  expect(result).toBe("id INTEGER, name STRING");
});
