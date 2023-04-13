This module provides a utility function for creating a SQLite table query, as well as a factory function for creating a CRUD interface for a given SQLite table.

Exports:
- `createTableQuery(tableName: string, schema: Record<string, keyof TypeMapping>): string`: a utility function that creates a SQLite table query string based on the given schema.
- `createSqliteInterface(tableName: string, schema: Record<string, keyof TypeMapping>): CreateSqliteInterface<SchemaType>`: a factory function that creates a CRUD interface object for the given SQLite table, using the given schema. The interface object has `create`, `read`, `update`, and `deleteById` methods for performing CRUD operations on the table.