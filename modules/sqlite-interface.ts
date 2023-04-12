import { createValidator } from "@/validations"; // Assuming validators are in a separate file
import { Database } from "bun:sqlite";

import { TypeInference, TypeMapping } from "@/types";

// Utility functions
export function createTableQuery<
  Schema extends Record<string, keyof TypeMapping>
>(tableName: string, schema: Schema): string {
  const fields = Object.entries(schema)
    .map(([key, type]) => `${key} ${type.toUpperCase()}`)
    .join(", ");

  return `CREATE TABLE IF NOT EXISTS ${tableName} (${fields});`;
}

// CRUD Interface
export function sqliteInterface<
  Schema extends Record<string, keyof TypeMapping>
>(tableName: string, schema: Schema) {
  const db = new Database("mydb.sqlite", { create: true });
  const { validate, infer } = createValidator(schema);

  // Create table
  const createTable = db.query(createTableQuery(tableName, schema));
  createTable.run();

  // Create
  async function create(item: TypeInference<Schema>) {
    const placeholders = Object.keys(schema)
      .map((key) => `$${key}`)
      .join(", ");
    const insertQuery = db.query(
      `INSERT INTO ${tableName} (${Object.keys(schema).join(
        ", "
      )}) VALUES (${placeholders});`
    );

    insertQuery.run(item);
  }

  // Read
  async function read(): Promise<TypeInference<Schema>[]> {
    const selectQuery = db.query(`SELECT * FROM ${tableName};`);
    const data = selectQuery.all();
    const { error, data: validatedData } = validate(data);

    if (error) {
      throw new Error(`Error during read: ${error}`);
    }

    return validatedData!;
  }

  // Update
  async function update(
    id: number,
    item: Partial<TypeInference<Schema>>
  ): Promise<void> {
    const updateFields = Object.keys(item)
      .map((key) => `${key} = $${key}`)
      .join(", ");
    const updateQuery = db.query(
      `UPDATE ${tableName} SET ${updateFields} WHERE id = $id;`
    );

    updateQuery.run({ ...item, id });
  }

  // Delete
  async function deleteById(id: number): Promise<void> {
    const deleteQuery = db.query(`DELETE FROM ${tableName} WHERE id = $id;`);
    deleteQuery.run({ id });
  }

  return {
    create,
    read,
    update,
    deleteById,
  };
}
