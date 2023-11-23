import Database from "bun:sqlite";
import { beforeEach, describe, expect, it, test } from "bun:test";
import { SchemaMap } from "../sqlite-factory";
import {
  createItem,
  createWhereClause,
  deleteItemById,
  readItems,
  updateItem,
} from "./crud-fn-utils";

const testSchema = {
  id: { type: "TEXT" },
  name: { type: "TEXT" },
  age: { type: "INTEGER" },
} satisfies SchemaMap;

let db = new Database(":memory:");

describe("Database utility functions", () => {
  beforeEach(() => {
    db = new Database(":memory:");
    db.query(
      "CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)"
    ).run();
  });

  test("should create an item in the database", () => {
    createItem({
      db,
      tableName: "test",
      debug: false,
      item: { id: "1", name: "John", age: 25 },
      returnInsertedItem: false,
    });
    const items = readItems({ db, tableName: "test" });
    expect(items).toEqual([{ id: 1, name: "John", age: 25 }]);
  });

  test("should read items from the database", () => {
    db.query("INSERT INTO test (name, age) VALUES (?, ?)").run("Jane", 30);
    const items = readItems({ db, tableName: "test" });
    expect(items).toEqual([{ id: 1, name: "Jane", age: 30 }]);
  });

  test("should update an item in the database", () => {
    db.query("INSERT INTO test (name, age) VALUES (?, ?)").run("Doe", 35);
    updateItem({
      db,
      tableName: "test",
      debug: false,
      id: 1,
      item: { name: "John Doe" },
    });
    const items = readItems({ db, tableName: "test" });
    expect(items).toEqual([{ id: 1, name: "John Doe", age: 35 }]);
  });
  test("should delete an item from the database by ID", () => {
    db.query("INSERT INTO test (name, age) VALUES (?, ?)").run("Alice", 40);
    deleteItemById({ db, id: 1, tableName: "test" });
    const items = readItems({ db, tableName: "test" });
    expect(items).toEqual([]);
  });
});

describe("createWhereClause", () => {
  it("should create a WHERE clause and parameters for a SQL query", () => {
    const where = { id: 1, name: "John" };
    const result = createWhereClause(where);

    expect(result).toEqual({
      whereClause: "id = ? AND name = ?",
      parameters: [1, "John"],
    });
  });

  it("should handle an empty object", () => {
    const where = {};
    const result = createWhereClause(where);

    expect(result).toEqual({
      whereClause: "",
      parameters: [],
    });
  });

  it("should handle null and undefined values", () => {
    const where = { id: null, name: undefined };
    const result = createWhereClause(where);

    expect(result).toEqual({
      whereClause: "id = ? AND name = ?",
      parameters: [null, undefined],
    });
  });

  it("should handle more than two properties", () => {
    const where = { id: 1, name: "John", age: 30 };
    const result = createWhereClause(where);

    expect(result).toEqual({
      whereClause: "id = ? AND name = ? AND age = ?",
      parameters: [1, "John", 30],
    });
  });

  it("should handle boolean values", () => {
    const where = { isActive: true };
    const result = createWhereClause(where);

    expect(result).toEqual({
      whereClause: "isActive = ?",
      parameters: [true],
    });
  });

  it("should handle numeric string values", () => {
    const where = { id: "1" };
    const result = createWhereClause(where);

    expect(result).toEqual({
      whereClause: "id = ?",
      parameters: ["1"],
    });
  });

  it("should handle more than two properties", () => {
    const where = { id: 1, name: "John", age: 30 };
    const result = createWhereClause(where);

    expect(result).toEqual({
      whereClause: "id = ? AND name = ? AND age = ?",
      parameters: [1, "John", 30],
    });
  });

  it("should handle boolean values", () => {
    const where = { isActive: true };
    const result = createWhereClause(where);

    expect(result).toEqual({
      whereClause: "isActive = ?",
      parameters: [true],
    });
  });

  it("should handle numeric string values", () => {
    const where = { id: "1" };
    const result = createWhereClause(where);

    expect(result).toEqual({
      whereClause: "id = ?",
      parameters: ["1"],
    });
  });
});
