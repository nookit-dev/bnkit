import Database from "bun:sqlite";
import { SchemaType, SchemaTypeInference } from "types";
import { createValidatorFactory } from "validation-factory";
import { createTableQuery } from "./create-sqlite-factory";

export type CreateSqliteTableFactoryParams<Schema extends SchemaType> = {
  db: Database;
  tableName: string;
  schema: Schema;
  debug?: boolean;
};

export function createSqliteTableFactory<Schema extends SchemaType>({
  db,
  schema,
  tableName,
  debug,
}: CreateSqliteTableFactoryParams<Schema>) {
  const { validateAgainstArraySchema } = createValidatorFactory(schema);

  const query = createTableQuery(tableName, schema);

  if (debug) {
    console.log({ query });
  }

  // Create table
  const createTable = db.query(query);
  createTable.run();

  // Create
  function create(item: SchemaTypeInference<Schema>) {
    const valuesArray = Object.values(item);
    const placeholders = valuesArray.map((value) => "?").join(", ");
    const prepareQuery = `INSERT INTO ${tableName} VALUES (${placeholders})`;

    const stmt = db.prepare(prepareQuery);

    if (debug) {
      console.log({ prepareQuery, valuesArray, placeholders, stmt });
    }

    const insertQuery = stmt.run(...valuesArray);

    console.log({ insertQuery });

    return [];
  }

  // Read
  async function read(): Promise<Schema[]> {
    const selectQuery = db.query(`SELECT * FROM ${tableName};`);
    const data = selectQuery.all();
    const { error, data: validatedData } = validateAgainstArraySchema(
      schema,
      data
    );

    if (error) {
      throw new Error(`Error during read: ${error}`);
    }

    if (!validatedData) {
      throw new Error(`Error during read, no data found: ${error}`);
    }

    return validatedData;
  }

  // Update
  async function update(
    id: number,
    item: Partial<SchemaTypeInference<Schema>>
  ): Promise<void> {
    const updateFields = Object.keys(item)
      .map((key) => `${key} = $${key}`)
      .join(", ");

    const query = `UPDATE ${tableName} SET ${updateFields} WHERE id = $id;`;
    if (debug) {
      console.log(query);
    }

    const updateQuery = db.query(query);

    // Run the query with the item object and id
    updateQuery.run({ ...item, id } as any);
  }

  // Delete
  async function deleteById(id: number): Promise<void> {
    const query = `DELETE FROM ${tableName} WHERE id = $id;`;

    if (debug) {
      console.log(query);
    }
    const deleteQuery = db.query(query);
    deleteQuery.run({ id });
  }

  return {
    create,
    read,
    update,
    deleteById,
  };
}
