# sqlite-interface

A simple CRUD interface for SQLite databases in TypeScript.

## Installation

```
npm install sqlite-interface
```

## Usage

```typescript
import { createSqliteInterface } from "sqlite-interface";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

const taskSchema = {
  id: "integer PRIMARY KEY",
  title: "text NOT NULL",
  description: "text",
  completed: "integer NOT NULL"
} as const;

const taskInterface = createSqliteInterface<Task>("tasks", taskSchema);

// Create
await taskInterface.create({
  title: "Do laundry",
  completed: false
});

// Read
const tasks = await taskInterface.read();
console.log(tasks);

// Update
await taskInterface.update(1, { completed: true });

// Delete
await taskInterface.deleteById(1);
```

## API

The `createSqliteInterface` function creates a new CRUD interface for a SQLite database table.

```
createSqliteInterface<Schema extends Record<string, keyof TypeMapping>>(
  tableName: string,
  schema: Schema
): CreateSqliteInterface<Schema>
```

### `tableName`

The name of the SQLite database table to create the interface for.

### `schema`

An object describing the structure of the database table. The keys are the column names, and the values are strings describing the data type, optionally followed by database constraints. These strings should be compatible with SQLite data types.

### Returned interface

The `createSqliteInterface` function returns an object with the following methods:

#### `create`

```
create(item: TypeInference<Schema>): Promise<void>
```

Inserts a new item into the database table.

#### `read`

```
read(): Promise<TypeInference<Schema>[]>
```

Reads all items from the database table.

#### `update`

```
update(id: number, item: Partial<TypeInference<Schema>>): Promise<void>
```

Updates an existing item in the database table.

#### `deleteById`

```
deleteById(id: number): Promise<void>
```

Deletes an existing item from the database table by ID.