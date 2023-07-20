import { Database } from "bun:sqlite";
import { SchemaType, TypeInference, TypeMapping } from "types";
import { createValidatorFactory } from "../validation-factory";

export function createTableQuery<
  Schema extends Record<string, keyof TypeMapping>
>(tableName: string, schema: Schema): string {
  const fields = Object.entries(schema)
    .map(([key, type]) => `${key} ${type.toUpperCase()}`)
    .join(", ");

  return `CREATE TABLE IF NOT EXISTS ${tableName} (${fields});`;
}

export type CreateSqliteInterface<Schema extends SchemaType> = {
  create: (item: TypeInference<Schema>) => Promise<void>;
  read: () => Promise<TypeInference<Schema>[]>;
  update: (id: number, item: Partial<TypeInference<Schema>>) => Promise<void>;
  deleteById: (id: number) => Promise<void>;
};

export function createSqliteFactory(db: Database) {
  function createSqliteTableFactory<
    Schema extends Record<string, keyof TypeMapping>
  >(tableName: string, schema: Schema): CreateSqliteInterface<Schema> {
    const { validateItem, validateAgainstArraySchema } =
      createValidatorFactory(schema);

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

      // Run the query with the item object
      insertQuery.run(item as any);
    }

    // Read
    async function read(): Promise<TypeInference<Schema>[]> {
      const selectQuery = db.query(`SELECT * FROM ${tableName};`);
      const data = selectQuery.all();
      const { error, data: validatedData } = validateAgainstArraySchema(
        schema,
        data
      );

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

      // Run the query with the item object and id
      updateQuery.run({ ...item, id } as any);
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

  return {
    createSqliteTableFactory,
  };
}
