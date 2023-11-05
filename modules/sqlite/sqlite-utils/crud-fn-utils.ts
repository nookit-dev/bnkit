import Database from "bun:sqlite";
import { SchemaMap, SQLiteSchemaInfer } from "../sqlite-factory";
import {
  deleteQueryString,
  insertQueryString,
  selectAllTableQueryString,
  updateQueryString,
} from "./crud-string-utils";

export function createItem<
  Schema extends SchemaMap,
  TranslatedSchema extends SQLiteSchemaInfer<Schema> = SQLiteSchemaInfer<Schema>
>(
  db: Database,
  tableName: string,
  log: (msg: any) => void,
  item: TranslatedSchema
) {
  const query = insertQueryString(tableName, item);
  const valuesArray = Object.values(item);
  log({ query, valuesArray });
  db.query(query).run(...valuesArray);
  return [];
}

// Modify the readItems function to include an optional id parameter.
export function readItemById<
  Schema extends SchemaMap,
  TranslatedSchema extends SQLiteSchemaInfer<Schema> = SQLiteSchemaInfer<Schema>
>(
  db: Database,
  tableName: string,
  log: (msg: any) => void,
  id: string | number // Add an optional id parameter
): TranslatedSchema {
  const query = selectItemByIdQueryString(tableName, id);
  log(query);
  // Use the ID in the parameterized query to prevent SQL injection.
  const data = db.query(query).get({ $id: id }) as TranslatedSchema;
  return data;
}

// This type represents the shape of the 'where' parameter
type Where<T> = Partial<T>;

// This interface will be used to type the return value of createWhereClause
interface WhereClauseResult {
  whereClause: string;
  parameters: { [key: string]: any };
}

// Function to create a WHERE clause and parameters for a SQL query
export function createWhereClause<T extends Record<string, any>>(
  where: Where<T>
): WhereClauseResult {
  const keys = Object.keys(where) as Array<keyof T>;
  const whereClause = keys.map((key) => `${String(key)} = ?`).join(" AND ");
  const parameters = keys.map((key) => where[key]);

  return { whereClause, parameters };
}

export function readItemsWhere<
  Schema extends SchemaMap,
  TranslatedSchema extends SQLiteSchemaInfer<Schema> = SQLiteSchemaInfer<Schema>
>(
  db: Database,
  tableName: string,
  log: (msg: any) => void,
  where: Where<TranslatedSchema>
): TranslatedSchema[] {
  const { whereClause, parameters } =
    createWhereClause<TranslatedSchema>(where);

  // The query string now uses '?' placeholders for parameters
  const queryString = `SELECT * FROM ${tableName} WHERE ${whereClause};`;
  log(queryString); // Log the query string for debugging purposes

  // Prepare the statement with the queryString
  const statement = db.prepare(queryString);

  // Assuming the .all() method on the prepared statement executes the query
  // and retrieves all the results after binding the parameters
  const data = statement.all(parameters) as TranslatedSchema[];

  return data; // Return the query results
}

// In your crud-string-utils file, add a function to create a SQL query string to select by ID.
export function selectItemByIdQueryString(
  tableName: string,
  id: string | number
): string {
  return `SELECT * FROM ${tableName} WHERE id = $id;`;
}

export function readItems<
  Schema extends SchemaMap,
  TranslatedSchema extends SQLiteSchemaInfer<Schema> = SQLiteSchemaInfer<Schema>
>(
  db: Database,
  tableName: string,
  log: (msg: any) => void
): TranslatedSchema[] {
  const query = selectAllTableQueryString(tableName);
  log(query);
  const data = db.query(query).all() as TranslatedSchema[];
  return data;
}

export function updateItem<
  Schema extends SchemaMap,
  TranslatedSchema extends SQLiteSchemaInfer<Schema> = SQLiteSchemaInfer<Schema>
>(
  db: Database,
  tableName: string,
  log: (msg: any) => void,
  id: string | number,
  item: Partial<Omit<TranslatedSchema, "id">>
) {
  const query = updateQueryString(tableName, item);
  log(query);
  const params = Object.fromEntries(
    Object.entries(item).map(([key, value]) => [`$${key}`, value])
  );
  db.query(query).run({ ...params, $id: id });
}

export function deleteItemById(
  db: Database,
  tableName: string,
  log: (msg: any) => void,
  id: number | string
) {
  const query = deleteQueryString(tableName);
  log(query);
  db.query(query).run({ $id: id });
}
