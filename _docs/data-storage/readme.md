# Bun-SQLite Interface

This is a simple interface for interacting with SQLite databases using [Bun](https://github.com/boostup/bun) ORM. It provides a CRUD interface for a given schema.

## Installation

Install `bun-sqlite` package using your package manager of choice:

```
npm install bun sqlite @types/sqlite3

or

yarn add bun sqlite @types/sqlite3
```

## Usage

```typescript
import { createSqliteInterface } from "bun-sqlite";

const schema = {
  id: "number",
  name: "string",
  email: "string",
};

const users = createSqliteInterface("users", schema);

await users.create({ id: 1, name: "John Doe", email: "johndoe@example.com" });

const allUsers = await users.read();

await users.update(1, { name: "John Doe II" });

await users.deleteById(1);
```

## API

`createSqliteInterface(tableName: string, schema: Schema): CreateSqliteInterface<Schema>`

This function returns an object with the following methods:

- `create(item: TypeInference<Schema>): Promise<void>`
  Creates a new item in the table for the schema.
- `read(): Promise<TypeInference<Schema>[]>`
  Reads all items from the table for the schema.
- `update(id: number, item: Partial<TypeInference<Schema>>): Promise<TypeInference<Schema>>`
  Updates an item in the table for the schema by its `id`.
- `deleteById(id: number): Promise<void>`
  Deletes an item from the table for the schema by its `id`.
  
## License

This package is [MIT licensed](https://github.com/boostup/bun-sqlite/blob/main/LICENSE).