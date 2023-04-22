import { describe, expect, test } from "@jest/globals";
import { createTableQuery, createSqliteInterface } from "./module";

const schema = {
  id: "INTEGER PRIMARY KEY AUTOINCREMENT",
  name: "TEXT",
  age: "INTEGER",
};

describe("createTableQuery function", () => {
  test("returns correct create table query", () => {
    const tableName = "test_table";
    const query = createTableQuery(tableName, schema);
    expect(query).toEqual(
      `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER);`
    );
  });
});

describe("createSqliteInterface function", () => {
  const tableName = "test_table";
  const dbInterface = createSqliteInterface(tableName, schema);

  describe("create function", () => {
    test("successfully creates item", async () => {
      const item = { name: "John", age: 30 };
      await dbInterface.create(item);
      const data = await dbInterface.read();
      expect(data).toEqual([{ id: 1, name: "John", age: 30 }]);
    });

    test("throws error if item is not valid against schema", async () => {
      const item = { age: "30" };
      await expect(dbInterface.create(item)).rejects.toThrow(
        "Error during create: ValidationError: name is required"
      );
    });
  });

  describe("read function", () => {
    test("returns all items in table", async () => {
      const data = await dbInterface.read();
      expect(data).toEqual([{ id: 1, name: "John", age: 30 }]);
    });

    test("returns empty array if table is empty", async () => {
      const emptyTableInterface = createSqliteInterface(
        "empty_table",
        schema
      );
      const data = await emptyTableInterface.read();
      expect(data).toEqual([]);
    });
  });

  describe("update function", () => {
    beforeEach(async () => {
      await dbInterface.create({ name: "Jim", age: 25 });
    });

    test("updates item successfully", async () => {
      await dbInterface.update(1, { age: 35 });
      const data = await dbInterface.read();
      expect(data).toEqual([
        { id: 1, name: "John", age: 35 },
        { id: 2, name: "Jim", age: 25 },
      ]);
    });

    test("throws error if item does not exist", async () => {
      await expect(dbInterface.update(3, { age: 35 })).rejects.toThrow(
        "Error during update: could not find item with id 3"
      );
    });

    test("throws error if updated item is not valid against schema", async () => {
      await expect(dbInterface.update(1, { age: "35" })).rejects.toThrow(
        "Error during update: ValidationError: age must be of type INTEGER"
      );
    });
  });

  describe("deleteById function", () => {
    beforeEach(async () => {
      await dbInterface.create({ name: "Jim", age: 25 });
    });

    test("deletes item successfully", async () => {
      await dbInterface.deleteById(1);
      const data = await dbInterface.read();
      expect(data).toEqual([{ id: 2, name: "Jim", age: 25 }]);
    });

    test("throws error if item does not exist", async () => {
      await expect(dbInterface.deleteById(3)).rejects.toThrow(
        "Error during delete: could not find item with id 3"
      );
    });
  });
});