import Database from "bun:sqlite";
import { beforeEach, describe, expect, test } from "bun:test";
import { SchemaMap } from "../sqlite-factory";
import {
  createItem,
  deleteItemById,
  readItems,
  updateItem,
} from "./crud-fn-utils"; // replace with the path to your file

const testSchema = {
  id: "TEXT",
  name: "TEXT",
  age: "INTEGER",
} satisfies SchemaMap;

let db = new Database(":memory:");

const log = (msg: any) => {
  // for the sake of this example, we'll just console log.
  // in a real-world scenario, you might want to store logs or handle them differently.
  console.log(msg);
};

describe("Database utility functions", () => {
  beforeEach(() => {
    db = new Database(":memory:");
    db.query(
      "CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)"
    ).run();
  });

  test("should create an item in the database", () => {
    createItem<typeof testSchema>(db, "test", log, {
      id: "1",
      name: "John",
      age: 25,
    });
    const items = readItems(db, "test", log);
    expect(items).toEqual([{ id: 1, name: "John", age: 25 }]);
  });

  test("should read items from the database", () => {
    db.query("INSERT INTO test (name, age) VALUES (?, ?)").run("Jane", 30);
    const items = readItems(db, "test", log);
    expect(items).toEqual([{ id: 1, name: "Jane", age: 30 }]);
  });

  test("should update an item in the database", () => {
    db.query("INSERT INTO test (name, age) VALUES (?, ?)").run("Doe", 35);
    updateItem<typeof testSchema>(db, "test", log, 1, { name: "John Doe" });
    const items = readItems(db, "test", log);
    expect(items).toEqual([{ id: 1, name: "John Doe", age: 35 }]);
  });

  test("should delete an item from the database by ID", () => {
    db.query("INSERT INTO test (name, age) VALUES (?, ?)").run("Alice", 40);
    deleteItemById(db, "test", log, 1);
    const items = readItems(db, "test", log);
    expect(items).toEqual([]);
  });
});
