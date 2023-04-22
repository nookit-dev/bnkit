## Functions

### `createTableQuery(tableName: string, schema: Record<string, keyof TypeMapping>): string`

- Input: `tableName` (string), `schema` (Record<string, keyof TypeMapping>)
- Output: string
- Creates a SQL CREATE TABLE statement as a string based on `tableName` and `schema`

### `createSqliteInterface(tableName: string, schema: Record<string, keyof TypeMapping>): CreateSqliteInterface<Record<string, keyof TypeMapping>>`

- Input: `tableName` (string), `schema` (Record<string, keyof TypeMapping>)
- Output: `CreateSqliteInterface<Record<string, keyof TypeMapping>>`
- Creates a SQLite interface with CRUD methods based on `tableName` and `schema`

### `create(item: TypeInference<Schema>): Promise<void>`

- Input: `item` (TypeInference<Schema>)
- Output: Promise<void>
- Creates a new record in the SQLite database with the validated `item`

### `read(): Promise<TypeInference<Schema>[]>`

- Input: none
- Output: Promise<TypeInference<Schema>[]>
- Reads data from the SQLite database and returns an array of validated records

### `update(id: number, item: Partial<TypeInference<Schema>>): Promise<void>`

- Input: `id` (number), `item` (Partial<TypeInference<Schema>>)
- Output: Promise<void>
- Updates a record in the SQLite database with the given `id` and validated `item`

### `deleteById(id: number): Promise<void>`

- Input: `id` (number)
- Output: Promise<void>
- Deletes a record from the SQLite database with the given `id`