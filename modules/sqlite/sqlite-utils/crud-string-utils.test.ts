import { expect, test } from "bun:test";
import {
  deleteQueryString,
  insertQueryString,
  selectAllTableQueryString,
  updateQueryString,
} from "./crud-string-utils"; // Replace with the actual path to your module

// Test for insertQueryString
test("insertQueryString", () => {
  const tableName = "users";
  const item = { name: "Alice", age: 30 };
  const query = insertQueryString(tableName, item);
  const expectedQuery = `INSERT INTO users (name, age) VALUES (?, ?)`;
  expect(query).toBe(expectedQuery);
});

// Test for selectAllTableQueryString
test("selectAllTableQueryString", () => {
  const tableName = "users";
  const query = selectAllTableQueryString(tableName);
  const expectedQuery = `SELECT * FROM users;`;
  expect(query).toBe(expectedQuery);
});

// Test for deleteQueryString
test("deleteQueryString", () => {
  const tableName = "users";
  const query = deleteQueryString(tableName);
  const expectedQuery = `DELETE FROM users WHERE id = $id;`;
  expect(query).toBe(expectedQuery);
});

// Test for updateQueryString
test("updateQueryString", () => {
  const tableName = "users";
  const item = { name: "John", age: 25 }; // example item
  const query = updateQueryString(tableName, item);
  const expectedQuery = `UPDATE users SET name = $name, age = $age WHERE id = $id;`;
  expect(query).toBe(expectedQuery);
});
