import Database from "bun:sqlite";
import { SchemaMap, SQLInfer } from "../sqlite-factory";
import {
  deleteQueryString,
  insertQueryString,
  selectAllTableQueryString,
  updateQueryString,
} from "./crud-string-utils";

type BaseDBParams = {
  db: Database;
  tableName: string;
  debug?: boolean;
};

type ParamsWithId = BaseDBParams & { id: string | number };

type DBItem<
  S extends SchemaMap,
  TranslatedS extends SQLInfer<S> = SQLInfer<S>
> = Partial<Omit<TranslatedS, "id">>;

type DBParamsItemNoId<
  Schema extends SchemaMap,
  TranslatedS extends SQLInfer<Schema> = SQLInfer<Schema>
> = BaseDBParams & {
  item: DBItem<Schema, TranslatedS>;
};

export function createItem<
  S extends SchemaMap,
  TranslatedS extends SQLInfer<S> = SQLInfer<S>
>({
  db,
  debug,
  item,
  returnInsertedItem,
  tableName,
}: DBParamsItemNoId<S, TranslatedS> & {
  returnInsertedItem?: boolean;
}): TranslatedS | null {
  const query = insertQueryString(tableName, item);
  const valuesArray = Object.values(item);

  if (debug) console.table({ query, valuesArray });

  try {
    // Perform the insert operation
    db.query(query).run(...(valuesArray as any[]));
  } catch (e) {
    throw e;
  }

  if (returnInsertedItem) {
    // Query to select the last inserted item
    const selectQuery = `SELECT * FROM ${tableName} WHERE id = last_insert_rowid();`;

    try {
      const insertedItem = db.query(selectQuery).get() as TranslatedS;

      if (debug)
        console.table({ selectQuery, lastId: insertedItem.id, insertedItem });

      return insertedItem as TranslatedS;
    } catch (e) {
      throw e;
    }
  }

  // If not returning the inserted item, return an empty array
  return null;
}

export function readFirstItemByKey<
  S extends SchemaMap,
  TranslatedS extends SQLInfer<S> = SQLInfer<S>
>({
  db,
  debug,
  key,
  tableName,
  value,
}: BaseDBParams & {
  key: keyof TranslatedS;
  value: string | number;
}): TranslatedS {
  const queryString = selectItemByKeyQueryString(tableName, String(key));
  if (debug) console.info(`readFirstItemByKey: ${queryString}`);
  const query = db.prepare(queryString).get(value) as TranslatedS;
  return query;
}

// Modify the readItems function to include an optional id parameter.
export function readItemById<
  Schema extends SchemaMap,
  TranslatedS extends SQLInfer<Schema> = SQLInfer<Schema>
>({ db, debug, id, tableName }: ParamsWithId): TranslatedS {
  const query = selectItemByKeyQueryString(tableName, "id");
  if (debug) console.info(`readItemById: ${query}`);

  const data = db.prepare(query).get(id) as TranslatedS;

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
  where: Where<T>,
  debug: boolean = false
): WhereClauseResult {
  const keys = Object.keys(where) as Array<keyof T>;
  const whereClause = keys.map((key) => `${String(key)} = ?`).join(" AND ");
  const parameters = keys.map((key) => where[key]);

  if (debug) {
    // create object of keys/values to be used as parameters in the query
    // e.g. { $name: 'John', $age: 25 }
    const debugEntries = Object.fromEntries(
      keys.map((key) => [`$${key as string}`, where[key]])
    );

    console.table(debugEntries);
  }

  return { whereClause, parameters };
}

export function readItemsWhere<
  Schema extends SchemaMap,
  TranslatedS extends SQLInfer<Schema> = SQLInfer<Schema>
>({
  db,
  tableName,
  debug,
  where,
}: BaseDBParams & {
  where: Where<TranslatedS>;
}): TranslatedS[] {
  const { whereClause, parameters } = createWhereClause<TranslatedS>(
    where,
    debug
  );

  // The query string now uses '?' placeholders for parameters
  const queryString = `SELECT * FROM ${tableName} WHERE ${whereClause};`;
  if (debug) console.info(`readItemsWhere ${queryString}`);

  // Prepare the statement with the queryString
  const statement = db.prepare(queryString);

  // Assuming the .all() method on the prepared statement executes the query
  // and retrieves all the results after binding the parameters
  const data = statement.all(parameters) as TranslatedS[];

  return data; // Return the query results
}

// In your crud-string-utils file, add a function to create a SQL query string to select by ID.
export function selectItemByKeyQueryString(
  tableName: string,
  key: string
): string {
  return `SELECT * FROM ${tableName} WHERE ${key} = ?`;
}

export function readItems<
  Schema extends SchemaMap,
  TranslatedS extends SQLInfer<Schema> = SQLInfer<Schema>
>({ db, debug, tableName }: BaseDBParams): TranslatedS[] {
  const query = selectAllTableQueryString(tableName);
  if (debug) console.info(query);
  const data = db.query(query).all() as TranslatedS[];
  return data;
}

export function updateItem<
  Schema extends SchemaMap,
  TranslatedS extends SQLInfer<Schema> = SQLInfer<Schema>
>({
  db,
  debug,
  id,
  item,
  tableName,
}: ParamsWithId & {
  item: Partial<Omit<TranslatedS, "id">>;
}) {
  const query = updateQueryString(tableName, item);

  if (debug) console.info(query);

  const params = Object.fromEntries(
    Object.entries(item).map(([key, value]) => [`$${key}`, value])
  );
  db.query(query).run({ ...params, $id: id });
}

export function deleteItemById({ db, debug, id, tableName }: ParamsWithId) {
  const query = deleteQueryString(tableName);
  if (debug) console.info(`deleteQueryString: `, query);
  db.query(query).run({ $id: id });
}
