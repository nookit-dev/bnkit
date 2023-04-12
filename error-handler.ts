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
