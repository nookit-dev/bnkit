import { createValidator, CustomError, apiErrorMap } from "./errorUtils";

describe("createValidator", () => {
  const schema = {
    id: "string",
    age: "number",
    isStudent: "boolean",
  };

  const validator = createValidator(schema);

  describe("validateItem", () => {
    it("should return the validated schema if valid", () => {
      const data = {
        id: "123",
        age: 25,
        isStudent: true,
      };

      const result = validator.validateItem(data);

      expect(result).toEqual(data);
    });

    it("should throw an error if data is not an object", () => {
      const data = "not an object";

      expect(() => validator.validateItem(data)).toThrowError(
        new CustomError("ValidationError", "Invalid data type")
      );
    });

    it("should throw an error if data is null", () => {
      const data = null;

      expect(() => validator.validateItem(data)).toThrowError(
        new CustomError("ValidationError", "Invalid data type")
      );
    });

    it("should throw an error if data has invalid type", () => {
      const data = {
        id: "123",
        age: "not a number",
        isStudent: true,
      };

      expect(() => validator.validateItem(data)).toThrowError(
        new CustomError("ValidationError", "Invalid data type")
      );
    });
  });

  describe("validateAgainstArraySchema", () => {
    it("should return the validated array if all items are valid", () => {
      const data = [
        {
          id: "123",
          age: 25,
          isStudent: true,
        },
        {
          id: "456",
          age: 30,
          isStudent: false,
        },
      ];

      const result = validator.validateAgainstArraySchema(schema, data);

      expect(result).toEqual({
        data: data,
      });
    });

    it("should return an error message if some items in array are invalid", () => {
      const data = [
        {
          id: "123",
          age: 25,
          isStudent: true,
        },
        {
          id: "456",
          age: "not a number",
          isStudent: false,
        },
      ];

      const result = validator.validateAgainstArraySchema(schema, data);

      expect(result).toEqual({
        error: apiErrorMap.ValidationError,
      });
    });

    it("should throw an error if there is a non validation error", () => {
      const data = [
        {
          id: "123",
          age: 25,
          isStudent: true,
        },
        null,
      ];

      expect(() =>
        validator.validateAgainstArraySchema(schema, data)
      ).toThrowError(new TypeError());
      // This error is not handled by the errorUtils module and should be bubbled up
    });
  });
});

Note: This is just an example. More tests might be needed depending on the use case and requirements.