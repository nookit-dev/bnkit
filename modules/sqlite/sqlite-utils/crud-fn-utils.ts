import Database from "bun:sqlite";
import { SchemaType, SchemaTypeInference } from "mod/types";
import {
    deleteQueryString,
    insertQueryString,
    selectAllTableQueryString,
    updateQueryString,
} from "./crud-string-utils";

export function createItem<Schema extends SchemaType>(
  db: Database,
  tableName: string,
  log: (msg: any) => void,
  item: SchemaTypeInference<Schema>
) {
  const query = insertQueryString(tableName, item);
  const valuesArray = Object.values(item);
  log({ query, valuesArray });
  db.query(query).run(...valuesArray);
  return [];
}

export function readItems<Schema extends SchemaType>(
  db: Database,
  tableName: string,
  log: (msg: any) => void
): Schema[] {
  const query = selectAllTableQueryString(tableName);
  log(query);
  const data = db.query(query).all() as Schema[];
  return data;
}

export function updateItem<Schema extends SchemaType>(
  db: Database,
  tableName: string,
  log: (msg: any) => void,
  id: string | number,
  item: Partial<Omit<Schema, "id">>
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
  id: number
) {
  const query = deleteQueryString(tableName);
  log(query);
  db.query(query).run({ $id: id });
}
