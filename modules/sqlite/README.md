# SQLite Table Factory Module

This module aids in creating SQLite tables, managing schemas, and handling CRUD operations on database entries.

## Features:

- Helps create tables in SQLite
- Manages schemas in an efficient way
- Handles CRUD operations on SQLite tables

## Importing the Dependencies:
```javascript
import Database from "bun:sqlite";
import type { SchemaType, SchemaTypeInference } from "@u-tools/core/modules/types";
import { createTableQuery, createItem, deleteItemById, readItems, updateItem } from "@u-tools/core/sqlite-factory";

```

Next, define your schema and use `createSqliteTableFactory` to generate your table.
```javascript
const userSchema = {
  id: "string",
  name: "string",
  email: "string",
}

const db = new Database({filename: "./mydb.sqlite"})

const userTableFactory = createSqliteTableFactory({
  db, 
  tableName: "users", 
  schema: userSchema
});

// Now we have a factory for the user's table. Let's use it.

const user = {
  id: "1",
  name: "John Doe",
  email: "john@example.com"
}

// Create a new user
userTableFactory.create(user);

// Read all users
console.log(userTableFactory.read());

// Update a user
userTableFactory.update("1", {name: "John Updated"});

// Delete a user
userTableFactory.deleteById("1");
```

And that's it! We have successfully generated a table and performed some CRUD operations on it. 

Please note for actual coding, make sure to handle database errors and edge cases. The examples given are purely for demonstration and simplicity purposes.