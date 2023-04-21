# Simple SQLite Interface

This is a simple SQLite interface written in TypeScript that supports basic CRUD operations. 

## Installation

```
npm install simple-sqlite-interface
```

## Usage

### Creating the Interface

To create an SQLite interface, use the `createSqliteInterface` function. It takes two arguments: the name of the table and a schema object that defines the columns of the table and their data types.

```typescript
import { createSqliteInterface } from "simple-sqlite-interface";

const schema = {
  id: "integer primary key autoincrement",
  title: "text",
  completed: "boolean",
};

const todos = createSqliteInterface("todos", schema);
```

### CRUD Operations

#### Create

To create a new row in the table, use the `create` function. It takes an object that matches the schema of the table.

```typescript
await todos.create({
  title: "Buy groceries",
  completed: false,
});
```

#### Read

To read all rows in the table, use the `read` function. It returns an array of objects that match the schema of the table.

```typescript
const allTodos = await todos.read();
```

#### Update

To update an existing row in the table, use the `update` function. It takes the id of the row to update and an object containing the fields to update.

```typescript
await todos.update(1, { completed: true });
```

#### Delete

To delete an existing row in the table, use the `deleteById` function. It takes the id of the row to delete.

```typescript
await todos.deleteById(1);
```

## Contributing

PRs accepted! 👍 Please lint, test, and write good commit messages.