# Module: `sqlite-interface.ts`

## Dependencies:
- `bun:sqlite`: A SQLite database driver for Node.js.
- `./validator`: A module that exports functions for validating data against a specified schema.
- `./types`: A module that exports type mappings used for SQLite table creation.

## Features:
- `createTableQuery`: A utility function that generates a SQLite CREATE TABLE query based on a specified table name and schema.
- `CreateSqliteInterface`: A generic type that describes the shape of a SQLite CRUD interface.
- `createSqliteInterface`: A function that creates a SQLite CRUD interface based on a specified table name and schema.
  - `create`: A function that creates a new record in the table based on a specified data object.
  - `read`: A function that returns all records in the table and validates them against the specified schema.
  - `update`: A function that updates a record in the table with the specified ID and data object.
  - `deleteById`: A function that deletes a record from the table with the specified ID.

## Technical Description:
`sqlite-interface.ts` is a module that exports functions for creating a CRUD interface for a SQLite database based on a specified schema. The `createSqliteInterface` function creates a new SQLite database connection, generates a CREATE TABLE query using the `createTableQuery` utility function, and returns an object with four functions that correspond to the CRUD operations available in a typical database: create, read, update, and delete. The `create` function inserts a new record into the table, the `read` function returns all records in the table and validates them against the specified schema using the `validateAgainstArraySchema` function from the `./validator` module, the `update` function updates a specific record in the table with the specified ID and data object, and the `deleteById` function deletes a specific record from the table with the specified ID. The module depends on the `bun:sqlite` database driver for Node.js, the `./validator` module for validating data against the specified schema, and the `./types` module for type mappings used in SQLite table creation.