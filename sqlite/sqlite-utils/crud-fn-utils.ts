import Database from "bun:sqlite";
import { SQLInfer, SchemaMap } from "../sqlite-factory";
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

type DBItem<S extends SchemaMap> = Partial<SQLInfer<S>>;

export function createItem<S extends SchemaMap, ReturnItem extends boolean>({
	db,
	debug,
	item,
	returnInsertedItem,
	tableName,
	keyForInsertLookup,
}: Omit<ParamsWithId, "id"> & {
	item: Partial<DBItem<S>>;
	returnInsertedItem?: ReturnItem;
	keyForInsertLookup?: keyof SQLInfer<S> extends string
		? keyof SQLInfer<S>
		: never;
}): ReturnItem extends true ? SQLInfer<S> : null {
	const query = insertQueryString(tableName, item);
	const valuesArray: any[] = [];

	for (const [key, value] of Object.entries(item)) {
		const valueToInsert = value instanceof Date ? value.toISOString() : value;

		if (value !== undefined) {
			valuesArray.push(valueToInsert);
		}
	}

	if (debug) console.table({ query, valuesArray });

	try {
		// Perform the insert operation
		db.query(query).run(...valuesArray);
	} catch (e) {
		if (debug) {
			throw {
				info: "CreateItem: Error during database insert operation",
				message: e.message,
				query,
				valuesArray,
			};
		}

		throw e;
	}

	const lookupKey = keyForInsertLookup ? keyForInsertLookup : "id";
	const lookupValue = item[lookupKey];

	if (lookupValue && lookupKey && returnInsertedItem) {
		const selectQuery = `SELECT * FROM ${tableName} WHERE ${lookupKey} = ?;`;
		try {
			const insertedItem = db
				.prepare(selectQuery)
				.get(lookupValue) as SQLInfer<S>;

			if (debug) console.table({ selectQuery, lookupValue, insertedItem });

			return insertedItem as ReturnItem extends true ? SQLInfer<S> : null;
		} catch (e) {
			if (debug) {
				throw {
					info: "CreateItem: Error during database select operation",
					message: e.message,
					selectQuery,
					lookupValue,
				};
			}
			throw e;
		}
	}

	if ((!lookupValue || !lookupKey) && returnInsertedItem) {
		const errorMsg = `returnInsertedItem is true but no lookupKey or lookupValue was provided \n
      lookupKey: ${lookupKey} \n
      lookupValue: ${lookupValue} \n`;
		console.error(errorMsg);
		throw new Error(errorMsg);
	}

	return null as ReturnItem extends true ? SQLInfer<S> : null;
}

export function readFirstItemByKey<Schema extends SchemaMap>({
	db,
	debug,
	key,
	tableName,
	value,
}: BaseDBParams & {
	key: keyof SQLInfer<Schema>;
	value: string | number;
}): SQLInfer<Schema> {
	const queryString = selectItemByKeyQueryString(tableName, String(key));
	if (debug) console.info(`readFirstItemByKey: ${queryString}`);
	const query = db.prepare(queryString).get(value) as SQLInfer<Schema>;
	return query;
}

// Modify the readItems function to include an optional id parameter.
export function  readItemById<Schema extends SchemaMap>({
	db,
	debug,
	id,
	tableName,
}: ParamsWithId): SQLInfer<Schema> {
	const query = selectItemByKeyQueryString(tableName, "id");
	if (debug) console.info(`readItemById: ${query}`);

	const data = db.prepare(query).get(id) as SQLInfer<Schema>;

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
	debug = false,
): WhereClauseResult {
	const keys = Object.keys(where) as Array<keyof T>;
	const whereClause = keys.map((key) => `${String(key)} = ?`).join(" AND ");
	const parameters = keys.map((key) => where[key]);

	if (debug) {
		// create object of keys/values to be used as parameters in the query
		// e.g. { $name: 'John', $age: 25 }
		const debugEntries = Object.fromEntries(
			keys.map((key) => [`$${key as string}`, where[key]]),
		);

		console.table(debugEntries);
	}

	return { whereClause, parameters };
}

export function readItemsWhere<Schema extends SchemaMap>({
	db,
	tableName,
	debug,
	where,
}: BaseDBParams & {
	where: Where<SQLInfer<Schema>>;
}): SQLInfer<Schema>[] {
	const { whereClause, parameters } = createWhereClause<SQLInfer<Schema>>(
		where,
		debug,
	);

	// The query string now uses '?' placeholders for parameters
	const queryString = `SELECT * FROM ${tableName} WHERE ${whereClause};`;
	if (debug) console.info(`readItemsWhere ${queryString}`);

	// Prepare the statement with the queryString
	const statement = db.prepare(queryString);

	// Assuming the .all() method on the prepared statement executes the query
	// and retrieves all the results after binding the parameters
	const data = statement.all(parameters) as SQLInfer<Schema>[];

	return data; // Return the query results
}

// In your crud-string-utils file, add a function to create a SQL query string to select by ID.
export function selectItemByKeyQueryString(
	tableName: string,
	key: string,
): string {
	return `SELECT * FROM ${tableName} WHERE ${key} = ?`;
}

export function readItems<Schema extends SchemaMap>({
	db,
	debug,
	tableName,
}: BaseDBParams): SQLInfer<Schema>[] {
	const query = selectAllTableQueryString(tableName);
	if (debug) console.info(query);
	const data = db.query(query).all() as SQLInfer<Schema>[];
	return data;
}

export function updateItem<Schema extends SchemaMap>({
	db,
	debug,
	id,
	item,
	tableName,
}: ParamsWithId & {
	item: Partial<Omit<SQLInfer<Schema>, "id">>;
}) {
	const query = updateQueryString(tableName, item);

	if (debug) console.info(query);

	const params = Object.fromEntries(
		Object.entries(item).map(([key, value]) => [`$${key}`, value]),
	);
	db.query(query).run({ ...params, $id: id });
}

export function deleteItemById({ db, debug, id, tableName }: ParamsWithId) {
	const query = deleteQueryString(tableName);
	if (debug) console.info("deleteQueryString: ", query);
	db.query(query).run({ $id: id });
}
