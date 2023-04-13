### Example Usage

First, import the `createSqliteInterface` function and create a schema for your table using the `TypeMapping` interface:

```typescript
import { createSqliteInterface } from "./sqlite-interface";
import { TypeMapping } from "./types";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const UserSchema: Record<keyof User, keyof TypeMapping> = {
  id: "INTEGER PRIMARY KEY",
  name: "TEXT",
  email: "TEXT",
  age: "INTEGER",
};
```

Next, create a new sqlite interface by passing in a table name and schema:

```typescript
const userInterface = createSqliteInterface<User>("users", UserSchema);
```

Now you can use the interface to create, read, update, and delete records:

```typescript
// Create a new user
await userInterface.create({
  name: "John Doe",
  email: "johndoe@example.com",
  age: 30,
});

// Read all users
const users = await userInterface.read();

// Update a user
await userInterface.update(1, { age: 31 });

// Delete a user
await userInterface.deleteById(1);
```

Note: the `id` field is automatically generated as an `INTEGER PRIMARY KEY`.