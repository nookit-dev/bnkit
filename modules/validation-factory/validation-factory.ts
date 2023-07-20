import { ValidationResult } from "../types";

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

export function createValidatorFactory<Schema extends object>(
  schema: Schema
) {
  function validateItem(item: any): Schema {
    if (typeof item !== "object" || item === null) {
      throw handleError(
        { type: "ValidationError", message: "Invalid data type" },
        true
      );
    }

    const validateSchema: Schema = {} as Schema;

    const isValid = Object.keys(schema).every((key) => {
      const typedKey = key as keyof Schema;
      const expectedType = schema[key];
      const actualType = typeof item[key];

      if (actualType !== expectedType) {
        return false;
      }

      validateSchema[typedKey] = item[
        key
      ] as Schema[keyof Schema];
      return true;
    });

    if (!isValid) {
      throw handleError(
        { type: "ValidationError", message: "Invalid data type" },
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
      const validatedData = data.map((item) => validateItem(item));
      return { data: validatedData as Schema[] };
    } catch (error) {
      const handledError = handleError(error as Error);
      if (handledError?.type === "ValidationError") {
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
export default createValidatorFactory;
