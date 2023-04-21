## Summary

This module provides a utility function for creating SQLite database tables, as well as a CRUD interface for interacting with those tables. It also includes a validator for ensuring that data adheres to the specified schema.

## Exports

- `createTableQuery`: a function that takes a table name and schema, and returns a SQL query string for creating the table
- `CreateSqliteInterface`: a type describing the CRUD interface for a given schema
- `createSqliteInterface`: a function for creating an instance of the CRUD interface for a given schema

## Dependencies

- `bun:sqlite`: a SQLite database driver
- `./validator`: a module containing functions for validating data against a schema
- `./types`: a module containing type definitions for working with schema mappings