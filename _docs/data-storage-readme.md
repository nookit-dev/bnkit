# SQLite Interface Module

This is a Node.js module for interacting with an SQLite database using a simple interface that supports CRUD operations.

## Installation

Install the module using npm:

```
npm install sqlite-interface
```

## Usage

### Basic Setup

Create a new instance of the database interface by calling `createSqliteInterface` with a table name and schema definition. The schema definition should be an object where the keys are the field names and the values are the corresponding data types. Supported data types are `"string"`, `"number"`, `"boolean"`, and `"datetime"`. 

```javascript
const { createSqliteInterface } = require('sqlite-interface');

const schema = {
  id: 'number',
  name: 'string',
  email: 'string',
  age: 'number'
};

const users = createSqliteInterface('users', schema);
```

### Create

To create a new item in the database, call the `create` function with an object that contains the field values for the new item.

```javascript
await users.create({
  name: 'John',
  email: 'john@example.com',
  age: 30
});
```

### Read

To read all items from the database, call the `read` function.

```javascript
const allUsers = await users.read();
```

### Update

To update an item in the database, call the `update` function with the ID of the item to update and an object that contains the fields to update.

```javascript
await users.update(1, { age: 31 });
```

### Delete

To delete an item from the database, call the `deleteById` function with the ID of the item to delete.

```javascript
await users.deleteById(1);
```

## License

This module is licensed under the MIT License.