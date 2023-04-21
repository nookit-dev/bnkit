#### Example 1: 
```typescript
type MySchema = {
  name: 'string';
  age: 'number';
  isStudent: 'boolean';
}

const data = {
  name: 'John',
  age: '30', // should be a number
  isStudent: 'true', // should be a boolean
}

const result: ValidationResult<MySchema> = validate(data, MySchema);
/*
result: {
  error: "age should be type number. isStudent should be type boolean.",
  data: undefined,
}
*/

const inferredData: TypeInference<MySchema> = infer(MySchema, data);
/*
inferredData: {
  name: "John",
  age: 30,
  isStudent: true,
}
*/
```

#### Example 2:
```typescript
type ProductSchema = {
  name: 'string';
  price: 'number';
  description?: 'string';
  isInStock: 'boolean';
  createdAt: 'date';
};

const product: ProductSchema = {
  name: 'Example Product',
  price: 19.99,
  isInStock: true,
  createdAt: new Date(),
};

const inferredProduct: TypeInference<ProductSchema> = infer(ProductSchema, product);
/*
inferredProduct: {
  name: "Example Product",
  price: 19.99,
  isInStock: true,
  createdAt: Tue Aug 10 2021 14:02:12 GMT-0400 (Eastern Daylight Time)
}
*/
```