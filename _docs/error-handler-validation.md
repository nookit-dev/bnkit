## Example Usage

```typescript
import createValidator from './errorUtils';

// Define schema
const schema = {
  name: "string",
  age: "number",
  isActive: "boolean"
};

// Create a validator function
const validator = createValidator(schema);

// Example 1: Valid data
const validData = {
  name: "John",
  age: 30,
  isActive: true
};

const validatedData = validator.validateItem(validData);
console.log(validatedData); // Outputs: { name: "John", age: 30, isActive: true }

// Example 2: Invalid data
const invalidData = {
  name: "Sarah",
  age: "22",
  isActive: "yes"
};

try {
  validator.validateItem(invalidData);
} catch (error) {
  console.log(error.message); // Outputs: "Invalid data type"
}

// Example 3: Validating an array of data
const dataArray = [
  {
    name: "John",
    age: 30,
    isActive: true
  },
  {
    name: "Sarah",
    age: 22,
    isActive: false
  }
];

const validatedArray = validator.validateAgainstArraySchema(schema, dataArray);
console.log(validatedArray); // Outputs: { data: [{ name: "John", age: 30, isActive: true }, { name: "Sarah", age: 22, isActive: false }] }

// Example 4: Error handling
try {
  const invalidArray = [
    {
      name: "John",
      age: 30,
      isActive: true
    },
    {
      name: "Sarah",
      age: "22",
      isActive: false
    }
  ];
  
  validator.validateAgainstArraySchema(schema, invalidArray);
} catch (error) {
  console.log(error.message); // Outputs: "Invalid data type"
}
```