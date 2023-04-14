### Example Usage

Assuming we have a schema for a `users` table with `id` (integer), `name` (string), and `age` (integer) fields:

```javascript
import { createSqliteInterface } from "./sqlite-interface";

const userInterface = createSqliteInterface("users", {
  id: "integer",
  name: "text",
  age: "integer",
});

// Create a new user
await userInterface.create({ id: 1, name: "John Doe", age: 30 });

// Read all users
const allUsers = await userInterface.read();
console.log(allUsers); // [{ id: 1, name: "John Doe", age: 30 }]

// Update a user by id
await userInterface.update(1, { age: 31 });

// Delete a user by id
await userInterface.deleteById(1);
```