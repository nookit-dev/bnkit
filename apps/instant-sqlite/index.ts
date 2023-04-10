import { sqliteInterface } from "@/sqlite-interface";

// Define a schema
export const userSchema = {
  id: "number",
  name: "string",
  email: "string",
  age: "number",
};

// Create the CRUD interface
const userCrud = sqliteInterface("users", userSchema);

// Use the CRUD methods
await userCrud.create({
  id: 1,
  name: "Alice",
  age: 30,
  email: "test@test.com",
});
const users = await userCrud.read();
await userCrud.update(1, { name: "Alicia" });
await userCrud.deleteById(1);
