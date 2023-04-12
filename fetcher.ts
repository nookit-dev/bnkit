import { handleError } from "./error-handler";

export async function createFetcher<Type, ErrorType>() {
  return async function fetcher<Type>(
    endpoint: string,
    options: RequestInit
  ): Promise<Type> {
    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw handleError({ type: "APIError", message: response.statusText });
      }
      const result = (await response.json()) as Type;
      return result;
    } catch (error: any) {
      if (error.name === "ValidationError" || error.name === "APIError") {
        console.error(error.name, error.message);
      } else {
        console.error("Error:", error);
      }
      throw error;
    }
  };
}
