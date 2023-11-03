import Database from "bun:sqlite";
import { SchemaMap, SQLiteSchemaToTypeScript } from "../sqlite-factory";
import {
  deleteQueryString,
  insertQueryString,
  selectAllTableQueryString,
  updateQueryString,
} from "./crud-string-utils";

export function createItem<
  Schema extends SchemaMap,
  TranslatedSchema extends SQLiteSchemaToTypeScript<Schema> = SQLiteSchemaToTypeScript<Schema>
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

export function readItems<
  Schema extends SchemaMap,
  TranslatedSchema extends SQLiteSchemaToTypeScript<Schema> = SQLiteSchemaToTypeScript<Schema>
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
  TranslatedSchema extends SQLiteSchemaToTypeScript<Schema> = SQLiteSchemaToTypeScript<Schema>
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
