## SQLite Interface Module

This module provides a convenient CRUD interface for SQLite databases, allowing users to easily create, read, update, and delete data.

### Exports

The following exports are available:

- `createTableQuery`: A utility function for creating a SQL CREATE TABLE query based on a provided schema object.
- `createSqliteInterface`: A function that creates an interface object for performing CRUD operations on a SQLite database.
- `CreateSqliteInterface`: A type definition for the interface object returned by `createSqliteInterface`.
- `TypeMapping`: A type definition for mapping TypeScript types to SQLite column types.
- `TypeInference`: A type definition for inferring the TypeScript type of a schema object based on its values.

### Usage

To use this module, first install it in your project:

```bash
npm install sqlite-interface
```

Then, import the desired exports:

```js
import { createSqliteInterface, CreateSqliteInterface, TypeMapping, TypeInference } from "sqlite-interface";
```

Next, create a schema object that defines the structure of your database table:

```js
const mySchema = {
  id: "INTEGER PRIMARY KEY AUTOINCREMENT",
  name: "TEXT",
  age: "INTEGER",
};
```

Note that the keys of the schema object define the column names, while their values map to SQLite column types.

Then, create a SQLite interface object by calling the `createSqliteInterface` function:

```js
const myInterface = createSqliteInterface("myTable", mySchema);
```

This function takes two arguments: the name of the database table, and the schema object.

The resulting interface object has four methods: `create`, `read`, `update`, and `deleteById`. These methods allow you to perform CRUD operations on your database.

For example, to create a new record:

```js
myInterface.create({ name: "John", age: 30 });
```

Or to read all records:

```js
const allRecords = await myInterface.read();
```

Or to update a record:

```js
myInterface.update(1, { age: 31 });
```

Or to delete a record:

```js
myInterface.deleteById(1);
```