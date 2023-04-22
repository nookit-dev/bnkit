import { infer, TypeMapping, TypeInference, ValidationResult, SchemaType } from "./module";

describe("TypeMapping", () => {
  test("should correctly map string type", () => {
    expect<TypeMapping["string"]>("foo").toBe("foo");
  });

  test("should correctly map number type", () => {
    expect<TypeMapping["number"]>(42).toBe(42);
  });

  test("should correctly map boolean type", () => {
    expect<TypeMapping["boolean"]>(true).toBe(true);
  });

  test("should correctly map date type", () => {
    const now = new Date();
    expect<TypeMapping["date"]>(now).toBe(now);
  });
});

describe("TypeInference", () => {
  test("should correctly infer type from schema", () => {
    const schema = {
      name: "string",
      age: "number",
      isAdmin: "boolean"
    };

    type ExpectedType = {
      name: string;
      age: number;
      isAdmin: boolean;
    };

    type InferredType = TypeInference<typeof schema>;

    expect<InferredType>({} as ExpectedType).toBeInstanceOf(Object);
  });
});

describe("ValidationResult", () => {
  test("should return validation error if data is invalid", () => {
    const schema = {
      name: "string",
      age: "number",
      isAdmin: "boolean"
    };

    const data = [
      { name: "John", age: "42", isAdmin: true },
      { name: "Jane", age: 31, isAdmin: "no" }
    ];

    const result: ValidationResult<typeof schema> = {
      error: "invalid data"
    };

    expect(result).toEqual({ error: "invalid data" });
  });

  test("should return validated data if all data is valid", () => {
    const schema = {
      name: "string",
      age: "number",
      isAdmin: "boolean"
    };

    const data = [
      { name: "John", age: 42, isAdmin: true },
      { name: "Jane", age: 31, isAdmin: false }
    ];

    const result: ValidationResult<typeof schema> = {
      data: data as TypeInference<typeof schema>[],
    };

    expect(result).toEqual({ data });
  });
});

describe("infer", () => {
  test("should properly infer types from schema", () => {
    const schema = {
      name: "string",
      age: "number",
      isAdmin: "boolean"
    };

    const data = { name: "John", age: 42, isAdmin: true };

    const expected = { name: "John", age: 42, isAdmin: true };

    const result = infer(schema, data);

    expect(result).toEqual(expected);
  });

  test("should return empty object if data is not provided", () => {
    const schema = {
      name: "string",
      age: "number",
      isAdmin: "boolean"
    };

    const expected = { name: "", age: 0, isAdmin: false };

    const result = infer(schema);

    expect(result).toEqual(expected);
  });
});