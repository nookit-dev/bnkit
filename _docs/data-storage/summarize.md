## Summary

This module provides functions for creating a SQLite interface for CRUD (create, read, update, delete) operations on a database table with a specified schema. It includes a utility function for generating SQL create table queries, as well as functions for validating and manipulating data based on the schema.

## Exports

- `createTableQuery(tableName: string, schema: Record<string, keyof TypeMapping>): string`: Utility function for generating a SQL CREATE TABLE query based on a table name and schema.

- `createSqliteInterface<Schema extends Record<string, keyof TypeMapping>>(tableName: string, schema: Schema): CreateSqliteInterface<Schema>`: Function for creating a CRUD interface for a SQLite database table based on a specified schema. Returns an object with functions for create, read, update, and delete operations.

- `TypeInference<T>`: Generic type for inferring the types of a record in the schema.

- `TypeMapping`: Object mapping of types used in the schema.

- `createValidator<T extends Record<string, keyof TypeMapping>>(schema: T): { validateItem: (item: any) => { error: string | null, data: any }, validateAgainstArraySchema: (schema: any, data: any) => { error: string | null, data: any } }`: Function for creating a data validator based on a specified schema. Returns an object with functions for validating individual items and arrays of items.

- `Database`: Class for connecting to and interacting with a SQLite database. Can be imported from the "bun:sqlite" package.