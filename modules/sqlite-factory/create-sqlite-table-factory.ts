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
  debug = false,
}: // TODO add logger param factory
CreateSqliteTableFactoryParams<Schema>) {
  const { validateAgainstArraySchema } = createValidatorFactory(schema);

  const query = createTableQuery({ tableName, schema, debug });

  if (debug) {
    console.log({ query });
  }

  const createTable = db.query(query);
  createTable.run();

  function create(item: SchemaTypeInference<Schema>) {
    const valuesArray = Object.values(item);
    const placeholders = valuesArray.map((value) => "?").join(", ");
    const prepareQuery = `INSERT INTO ${tableName} VALUES (${placeholders})`;

    const stmt = db.prepare(prepareQuery);

    if (debug) {
      console.log({ prepareQuery, valuesArray, placeholders, stmt });
    }

    const insertQuery = stmt.run(...valuesArray);

    if (debug) {
      console.log({ insertQuery });
    }

    return [];
  }

  async function read(): Promise<Schema[]> {
    const selectAllTableQuery = `SELECT * FROM ${tableName};`;
    const selectQuery = db.query(selectAllTableQuery);
    const data = selectQuery.all();

    if (debug) {
      console.log({
        selectAllTableQuery,
        data,
      });
    }

    // TODO add back validation, make validation option, i need to create a sqlite schema validator
    // const { error, data: validatedData } = validateAgainstArraySchema(
    //   schema,
    //   data
    // );

    // if (error) {
    //   throw new Error(`Error during read: ${error}`);
    // }

    // if (!validatedData) {
    //   throw new Error(`Error during read, no data found: ${error}`);
    // }

    return data as Schema[];
  }

  async function update(
    // TODO   maybe this can be inferred from the schema, maybe make id required?
    id: string | number,
    item: Partial<Schema>
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
