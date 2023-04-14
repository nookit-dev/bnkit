### Example 1: Validating Data

```
// Define a schema
const mySchema = {
  name: "string",
  age: "number",
  active: "boolean"
};

// Validate data against schema
const dataToValidate = [
  { name: "John", age: 30, active: true },
  { name: "Jane", age: "not a number", active: false },
  { name: 123, age: 25, active: "not a boolean" }
];

const validationResult: ValidationResult<typeof mySchema> = {
  data: dataToValidate.map((d) => infer(mySchema, d)),
  error: "Invalid data type for age and active fields in second and third records"
};
```

### Example 2: Inferring Data Types

```
// Define a schema
const mySchema = {
  name: "string",
  age: "number",
  active: "boolean",
  createdAt: "date"
};

// Infer data types from an object
const myData = {
  name: "John",
  age: 30,
  active: true,
  createdAt: new Date("2022-02-22")
};

const inferredData = infer(mySchema, myData);

// inferredData: {
//   name: string;
//   age: number;
//   active: boolean;
//   createdAt: Date;
// }
```