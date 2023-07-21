import Database from "bun:sqlite";
import { beforeEach, describe, expect, it } from "bun:test";
import { SchemaType } from "types";
import { createSqliteFactory } from "./create-sqlite-factory";

let db = new Database(":memory:");

const noteSchema: SchemaType = {
  id: "string",
  text: "string",
};

describe("createSqliteFactory", () => {
  beforeEach(() => {
    db = new Database(":memory:");
  });
  it("It should create a db factory", () => {
    const { dbTableFactory } = createSqliteFactory({ db });

    expect(dbTableFactory).toBeDefined();
  });

  it("should create and read a note in  sqlite", async () => {
    const { dbTableFactory } = createSqliteFactory({ db });

    const notesTable = dbTableFactory({
      schema: noteSchema,
      tableName: "notes",
    });

    notesTable.create({
      id: 1,
      text: "some text",
    });

    const notes = await notesTable.read();

    expect(notes).toEqual([{ id: 1, text: "some text" }]);
  });
  it("should create and read a note in  sqlite and update it", async () => {
    const { dbTableFactory } = createSqliteFactory({ db, debug: true });

    const notesTable = dbTableFactory({
      schema: noteSchema,
      tableName: "notes",
    });

    notesTable.create({
      id: 1,
      text: "some text",
    });

    const notes = await notesTable.read();

    expect(notes).toEqual([{ id: 1, text: "some text" }]);

    await notesTable.update(1, {
      text: "some text updated",
    });

    const updatedNotes = await notesTable.read();

    console.log({ updatedNotes });

    expect(updatedNotes).toEqual([{ id: 1, text: "some text updated" }]);
  });
  it("should create and read a note in  sqlite and delete it", async () => {
    const { dbTableFactory } = createSqliteFactory({ db, debug: true });

    const notesTable = dbTableFactory({
      schema: noteSchema,
      tableName: "notes",
    });

    notesTable.create({
      id: 1,
      text: "some text",
    });

    const notes = await notesTable.read();

    expect(notes).toEqual([{ id: 1, text: "some text" }]);

    await notesTable.deleteById(1);

    const updatedNotes = await notesTable.read();

    console.log({ updatedNotes });

    expect(updatedNotes).toEqual([]);
  });
});
