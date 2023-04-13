// errorUtils.ts

export type ErrorType = "ValidationError" | "APIError" | "JavaScriptError";

export type CustomError = {
  type: ErrorType;
  message: string;
};

export const apiErrorMap = {
  APIError: "API Error",
  ValidationError: "Validation Error",
  JavaScriptError: "JavaScript Error",
};

function mapBuiltInErrorType(error: Error): ErrorType {
  if (error instanceof TypeError) {
    return "JavaScriptError";
  } else if (error instanceof ReferenceError) {
    return "JavaScriptError";
  } else if (error instanceof SyntaxError) {
    return "JavaScriptError";
  } else {
    return "JavaScriptError";
  }
}

export const getErrorType = (error: Error | CustomError): ErrorType => {
  return "type" in error ? error.type : mapBuiltInErrorType(error);
};

export function handleError(
  error: Error | CustomError,
  throwError = false
): CustomError | undefined {
  const handledError: CustomError =
    "type" in error
      ? error
      : {
          type: getErrorType(error),
          message: error.message,
        };

  if (throwError) {
    throw handledError;
  } else {
    return handledError;
  }
}

import { SchemaType, TypeInference, ValidationResult } from "./types";

export function createValidator<Schema extends SchemaType>(schema: Schema) {
  function validateItem(item: unknown): TypeInference<Schema> {
    if (typeof item !== "object" || item === null) {
      throw handleError(
        { type: "invalid-type", message: "Invalid data type" },
        true
      );
    }

    const validateSchema: TypeInference<Schema> = {} as TypeInference<Schema>;

    const isValid = Object.keys(schema).every((key) => {
      const expectedType = schema[key];
      const actualType = typeof item[key];

      if (actualType !== expectedType) {
        return false;
      }

      validateSchema[key] = item[key] as TypeInference<Schema>[keyof Schema];
      return true;
    });

    if (!isValid) {
      throw handleError(
        { type: "invalid-type", message: "Invalid data type" },
        true
      );
    }

    return validateSchema;
  }

  function validateAgainstArraySchema(
    schema: Schema,
    data: unknown[]
  ): ValidationResult<Schema> {
    try {
      const validatedData = data.map((item) => validateItem(schema, item));
      return { data: validatedData as TypeInference<Schema>[] };
    } catch (error) {
      const handledError = handleError(error as Error);
      if (handledError.type === "ValidationError") {
        return { error: handledError.message };
      } else {
        throw error;
      }
    }
  }

  return {
    validateAgainstArraySchema,
    validateItem,
  };
}

// One export per file
export default createValidator;
