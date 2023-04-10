import { InferType, TypeMap } from "modules/types";

// Simple type validation schema
const fruitSchema = {
  name: "string",
  calories: "number",
  fatsGrams: "number",
  proteinsGrams: "number",
} as const;

export type FruitType = InferType<SchemaType>;
type SchemaType = typeof fruitSchema;

// Validator function
function createValidator<T extends Record<string, keyof TypeMap>>(schema: T) {
  return function validate(data: unknown[]): {
    error?: string;
    data?: InferType<T>[];
  } {
    for (const item of data) {
      if (typeof item !== "object" || item === null) {
        return { error: "Data item is not an object" };
      }
      for (const key in schema) {
        if (
          !Object.prototype.hasOwnProperty.call(item, key) ||
          typeof item[key] !== schema[key]
        ) {
          return { error: `Invalid data type for ${key}` };
        }
      }
    }
    return { data: data as InferType<T>[] };
  };
}

// Usage
const validateUserApiResponse = createValidator(fruitSchema);
const parsedJson = JSON.parse(chatGptMockFruitPrompt.response);

console.log({ data: parsedJson });

const validatedResponse = validateUserApiResponse(parsedJson);

if (validatedResponse.error) {
  console.error(validatedResponse.error);
} else {
  validatedResponse.data.forEach((fruit: FruitType) => {
    console.log(fruit.name);
  });
}
