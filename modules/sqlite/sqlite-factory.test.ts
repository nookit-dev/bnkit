import Database from "bun:sqlite";
import { beforeEach, describe, expect, test } from "bun:test";
import { SchemaMap, createSqliteFactory } from "./sqlite-factory";

let db = new Database(":memory:");

const noteSchema = {
  id: { type: "TEXT" },
  text: { type: "TEXT" },
} satisfies SchemaMap;

describe("createSqliteFactory", () => {
  beforeEach(() => {
    db = new Database(":memory:");
  });
  test("It should create a db factory", () => {
    const { dbTableFactory } = createSqliteFactory({ db });

    expect(dbTableFactory).toBeDefined();
  });

  test("should create and read a note in  sqlite", async () => {
    const { dbTableFactory } = createSqliteFactory({ db });

    const notesTable = dbTableFactory({
      schema: noteSchema,
      tableName: "notes",
      debug: false,
    });

    notesTable.create({
      id: "1",
      text: "some text",
    });

    const notes = notesTable.readAll();

    expect(notes).toEqual([{ id: "1", text: "some text" }]);
  });
  test("should create and read a note in  sqlite and update it", () => {
    const { dbTableFactory } = createSqliteFactory({ db, debug: true });

    const notesTable = dbTableFactory({
      schema: noteSchema,
      tableName: "notes",
      debug: false,
    });

    notesTable.create({
      id: "1",
      text: "some text",
    });

    const notes = notesTable.readAll();

    expect(notes).toEqual([{ id: "1", text: "some text" }]);

    notesTable.update("1", {
      text: "some text updated",
    });

    const updatedNotes = notesTable.readAll();

    expect(updatedNotes).toEqual([{ id: "1", text: "some text updated" }]);
  });
  test("should create and read a note in  sqlite and delete it", () => {
    const { dbTableFactory } = createSqliteFactory({ db, debug: true });

    const notesTable = dbTableFactory({
      schema: noteSchema,
      tableName: "notes",
      debug: false,
    });

    notesTable.create({
      id: "1",
      text: "some text",
    });

    const notes = notesTable.readAll();

    expect(notes).toEqual([{ id: "1", text: "some text" }]);

    notesTable.deleteById("1");

    const updatedNotes = notesTable.readAll();

    expect(updatedNotes).toEqual([]);
  });
});
