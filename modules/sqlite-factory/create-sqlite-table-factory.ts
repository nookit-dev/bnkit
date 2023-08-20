import Database from "bun:sqlite";
import { SchemaType, SchemaTypeInference } from "types";
import { createTableQuery } from "./sqlite-utils";

export type ForeignKeysType<Schema> =
  | { column: keyof Schema; references: string }[]
  | null;

export type CreateSqliteTableFactoryParams<Schema extends SchemaType> = {
  db: Database;
  tableName: string;
  schema: Schema;
};

export type CreateSqliteTableOptions<Schema extends SchemaType> = {
  debug?: boolean;
  enableForeignKeys?: boolean;
  foreignKeys?: ForeignKeysType<Schema>;
};

export function createSqliteTableFactory<Schema extends SchemaType>(
  {
    db,
    schema,
    tableName,
  }: // TODO add logger param factory
  CreateSqliteTableFactoryParams<Schema>,
  {
    debug = false,
    enableForeignKeys: foreignKeysConstraints = false,
    foreignKeys = null,
  }: CreateSqliteTableOptions<Schema> = {}
) {
  const log = (...args: any) => {
    if (debug) {
      console.info(...args);
    }
  };

  // const { validateAgainstArraySchema } = createValidatorFactory(schema);

  const createTable = db.query(
    createTableQuery({ tableName, schema, foreignKeys, debug })
  );
  createTable.run();

  function create(item: SchemaTypeInference<Schema>) {
    const valuesArray = Object.values(item);
    const placeholders = valuesArray.map((value) => "?").join(", ");
    const prepareQuery = `INSERT INTO ${tableName} VALUES (${placeholders})`;

    const stmt = db.query(prepareQuery);

    log({ prepareQuery, valuesArray, placeholders, stmt });

    const insertQuery = stmt.run(...valuesArray);

    log({ insertQuery });

    return [];
  }

  async function read(): Promise<Schema[]> {
    const selectAllTableQuery = `SELECT * FROM ${tableName};`;
    const selectQuery = db.query(selectAllTableQuery);
    const data = selectQuery.all();

    log({
      selectAllTableQuery,
      data,
    });

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

  const getDeleteQuery = (tableName: string) => {
    const query = `DELETE FROM ${tableName} WHERE id = $id;`;

    log(query);

    return query;
  };

  const getUpdateQuery = <Schema extends SchemaType>(
    tableName: string,
    schema: Schema
  ) => {
    // Filter out the 'id' field
    const updateFields = Object.keys(schema)
      .filter((key) => key !== "id")
      .map((key) => `${key} = $${key}`)
      .join(", ");

    const query = `UPDATE ${tableName} SET ${updateFields} WHERE id = $id;`;

    log(query);

    return query;
  };

  //  TODO: need to fix types on the update method
  async function update(
    // TODO: maybe this can be inferred from the schema, maybe make ID required?
    id: string | number,
    item: Partial<Omit<Schema, "id">>
  ): Promise<void> {
    const query = getUpdateQuery(tableName, schema);

    log(query);

    const updateQuery = db.query(query);

    log({ item, id });

    // Run the query with the item object and id
    const params = Object.fromEntries(
      Object.entries(item).map(([key, value]) => [`$${key}`, value])
    );
    updateQuery.run({ ...params, $id: id });
  }

  async function deleteById(id: number): Promise<void> {
    const query = getDeleteQuery(tableName);

    log(query);

    const deleteQuery = db.query(query);
    deleteQuery.run({ $id: id });
  }

  return {
    create,
    read,
    update,
    deleteById,
  };
}
