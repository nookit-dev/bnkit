import { TypeInference } from "@/types";

export function createValidator<Schema extends SchemaType>(schema: Schema) {
  function validateItem(
    schema: Schema,
    item: unknown
  ): TypeInference<Schema> | { error: string } {
    if (typeof item !== "object" || item === null) {
      return { error: "Data item is not an object" };
    }

    const validatedItem: TypeInference<Schema> = {} as TypeInference<Schema>;

    const isValid = Object.keys(schema).every((key) => {
      const expectedType = schema[key];
      const actualType = typeof item[key];

      if (actualType !== expectedType) {
        return false;
      }

      validatedItem[key] = item[key] as TypeInference<Schema>[keyof Schema];
      return true;
    });

    if (!isValid) {
      return { error: "Invalid data type" };
    }

    return validatedItem;
  }

  function validate(schema: Schema, data: unknown[]): ValidationResult<Schema> {
    const validatedData = data.map((item) => validateItem(schema, item));

    const invalidItem = validatedData.find((item) => !!item.error);

    if (invalidItem) {
      return { error: invalidItem.error };
    }

    return { data: validatedData as TypeInference<Schema>[] };
  }

  return {
    validate,
  };
}
