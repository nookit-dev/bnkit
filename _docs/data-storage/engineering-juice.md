# Functions

## createTableQuery(tableName: string, schema: Record<string, keyof TypeMapping>): string

- **Input:** tableName(string), schema(Record<string, keyof TypeMapping>)
- **Output:** string
- Returns a CREATE TABLE SQL query string.

## createSqliteInterface(tableName: string, schema: Record<string, keyof TypeMapping>)

- **Input:** tableName(string), schema(Record<string, keyof TypeMapping>)
- **Output:** CreateSqliteInterface
- Creates a new SQLite interface with CRUD functionality.

## create(item: TypeInference<Schema>)

- **Input:** item(TypeInference)
- **Output:** Promise<void>
- Creates a new item in the SQLite database.

## read()

- **Input:** none
- **Output:** Promise<TypeInference[]>
- Reads all items from the SQLite database.

## update(id: number, item: Partial<TypeInference<Schema>>)

- **Input:** id(number), item(Partial<TypeInference>)
- **Output:** Promise<void>
- Updates an item in the SQLite database.

## deleteById(id: number)

- **Input:** id(number)
- **Output:** Promise<void>
- Deletes an item from the SQLite database by its ID.