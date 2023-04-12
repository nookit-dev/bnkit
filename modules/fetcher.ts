class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "APIError";
  }
}

function createValidationError(message: string): ValidationError {
  return { name: "ValidationError", message };
}

export function createAPIError(message: string): APIError {
  return { name: "APIError", message };
}

export async function fetcher<T>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw createAPIError(
        `API Error: ${response.status} - ${response.statusText}`
      );
    }
    const result = (await response.json()) as T;
    return result;
  } catch (error: any) {
    if (error.name === "ValidationError" || error.name === "APIError") {
      console.error(error.name, error.message);
    } else {
      console.error("Error:", error);
    }
    throw error;
  }
}
