This module exports utility functions and a CRUD interface for working with a SQLite database. 

Exports:
- `createTableQuery(tableName: string, schema: Schema): string`: Returns a SQL query string for creating a new table in the database.
- `createSqliteInterface(tableName: string, schema: Schema)`: Returns a CRUD interface for interacting with the specified table in the SQLite database. The interface includes methods for creating, reading, updating, and deleting data. 
- `CreateSqliteInterface`: A type that describes the shape of the CRUD interface returned by `createSqliteInterface`.
- `TypeInference`: A type that infers the data types of a schema object based on its values.
- `TypeMapping`: An object that maps types to their corresponding SQLite data types. 
- `createValidator(schema: Schema)`: Returns an object with methods for validating data against the specified schema.