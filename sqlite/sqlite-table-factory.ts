import Database from 'bun:sqlite'
import { SQLInfer, SchemaMap } from './sqlite-factory'
import {
  createItem,
  deleteItemById,
  readFirstItemByKey,
  readItemById,
  readItems,
  readItemsWhere,
  updateItem,
} from './sqlite-utils/crud-fn-utils'
import { createTableQuery } from './sqlite-utils/table-query-gen'

export type ForeignKeysT<Schema> = { column: keyof Schema; references: string }[] | null

export type SqliteTableFactoryParams<Schema extends SchemaMap> = {
  db: Database
  tableName: string
  schema: Schema
}

export type SqliteTableOptions<Schema extends SchemaMap> = {
  debug?: boolean
  enableForeignKeys?: boolean
  foreignKeys?: ForeignKeysT<Schema>
}

// Logger utility
function logger(debug: boolean) {
  return (...args: any[]) => {
    if (debug) {
      console.info(...args)
    }
  }
}

export function sqliteTableFactory<
  Schema extends SchemaMap,
  TranslatedSchema extends SQLInfer<Schema> = SQLInfer<Schema>,
>(params: SqliteTableFactoryParams<Schema>, options: SqliteTableOptions<Schema> = {}) {
  const { db, schema, tableName } = params
  const { debug = false } = options

  db.query(createTableQuery({ tableName, schema, debug })).run()

  return {
    readWhere(where: Partial<TranslatedSchema>) {
      return readItemsWhere<Schema>({ db, tableName, debug, where })
    },
    create<ReturnInserted extends boolean = false>(
      item: TranslatedSchema,
      createOptions?: {
        returnInsertedItem?: ReturnInserted
        keyForInsertLookup?: keyof SQLInfer<Schema> extends string ? keyof SQLInfer<Schema> : never
      },
    ) {
      return createItem<Schema, ReturnInserted>({
        db,
        tableName,
        debug,
        item,
        returnInsertedItem: createOptions?.returnInsertedItem,
        keyForInsertLookup: createOptions?.keyForInsertLookup,
      })
    },
    getAll(): TranslatedSchema[] {
      return readItems<Schema>({ db, tableName, debug }) as TranslatedSchema[]
    },
    getById(id: string | number) {
      return readItemById<Schema>({ db, tableName, debug, id })
    },
    getByKey(key: string, value: string | number) {
      return readFirstItemByKey<Schema>({
        db,
        tableName,
        debug,
        key,
        value,
      }) as unknown as TranslatedSchema
    },
    update(id: string | number, item: Partial<Omit<TranslatedSchema, 'id'>>) {
      return updateItem<Schema>({ db, tableName, debug, id, item })
    },
    delById(id: number | string) {
      return deleteItemById({ db, tableName, debug, id })
    },
    infer(): TranslatedSchema {
      return undefined as any as TranslatedSchema
    },
  }
}
