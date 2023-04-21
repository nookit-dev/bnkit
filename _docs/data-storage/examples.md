Example usage:

```typescript
import { createSqliteInterface } from "./sqlite-interface";

// Define schema
const userSchema = {
  id: "INTEGER PRIMARY KEY AUTOINCREMENT",
  name: "TEXT",
  age: "INTEGER",
};

// Create interface
const userInterface = createSqliteInterface("users", userSchema);

// Create item
userInterface.create({ name: "John Doe", age: 30 });

// Read items
const users = await userInterface.read();
console.log(users);

// Update item
userInterface.update(users[0].id, { age: 31 });

// Delete item
userInterface.deleteById(users[0].id);
```