import { Database } from "bun:sqlite";
import { afterEach, describe, expect, test } from "bun:test";
import { SchemaMap } from "./sqlite-factory";
import { sqliteTableFactory } from "./sqlite-table-factory";

const mockDb = new Database(":memory:");
const testSchema = {
  id: { type: "TEXT" },
  name: { type: "TEXT" },
  age: { type: "INTEGER" },
} satisfies SchemaMap;

const factoryOptions = {
  debug: true,
};

describe("sqliteTableFactory", () => {
  const factory = sqliteTableFactory(
    {
      db: mockDb,
      schema: testSchema,
      tableName: "test",
    },
    factoryOptions
  );

  afterEach(() => {
    // Clean up the database after each test (for isolation purposes)
    mockDb.query("delete FROM test;").run();
  });

  test("should insert an item into the database using the factory", () => {
    const item = { id: "1", name: "John", age: 30 };
    factory.create(item);
    const items = factory.getAll();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual(item);
  });

  test("should read items from the database using the factory", () => {
    const item = { id: "1", name: "Jane", age: 25 };
    mockDb
      .query("INSERT INTO test (id, name, age) VALUES (?, ?, ?)")
      .run(item.id, item.name, item.age);
    const items = factory.getAll();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual(item);
  });

  test("should update an item in the database using the factory", () => {
    const item = { id: "1", name: "Doe", age: 35 };
    mockDb
      .query("INSERT INTO test (id, name, age) VALUES (?, ?, ?)")
      .run(item.id, item.name, item.age);
    const updatedName = "John Doe";
    factory.update(item.id, { name: updatedName });
    const items = factory.getAll();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual({ ...item, name: updatedName });
  });
  test("should delete an item from the database using the factory", () => {
    const item = { id: "1", name: "Alice", age: 40 };
    mockDb
      .query("INSERT INTO test (id, name, age) VALUES (?, ?, ?)")
      .run(item.id, item.name, item.age);
    factory.delById(item.id);
    const items = factory.getAll();
    expect(items.length).toBe(0);
  });
});
