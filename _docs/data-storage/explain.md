## Module: sqlite-interface.ts
### Dependencies:
- `bun:sqlite`
- `./validator`
- `./types`

### Features:
- Utility function `createTableQuery` to generate a SQL query for creating a new table in an SQLite database
- Type `CreateSqliteInterface` for defining a CRUD interface for an SQLite database table
- Function `createSqliteInterface` for creating an object that implements the `CreateSqliteInterface`

### Technical Description:
This module provides utility functions and types for creating and interacting with an SQLite database. The `createTableQuery` function takes a table name and a schema object and generates a SQL query for creating a new table in the database. The `CreateSqliteInterface` type defines a set of functions for creating, reading, updating, and deleting records in an SQLite database table, and `createSqliteInterface` is a function that returns an object that implements this interface. The module depends on the `bun:sqlite` package for connecting to the SQLite database, as well as the local `./validator` and `./types` modules for validating data and defining schema types.