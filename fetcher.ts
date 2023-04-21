import { handleError } from "error-handler-validation";

// fetcher.ts
export type FetchOptions = {
  url: string;
};

export function createFetcher({ url }: FetchOptions) {
  async function get<Type>(endpoint: string): Promise<Type> {
    const response = await fetch(url + endpoint);
    return await handleResponse<Type>(response);
  }

  async function post<Type>(endpoint: string, params: any): Promise<Type> {
    const response = await fetch(url + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return await handleResponse<Type>(response);
  }

  async function getStatus<Type>(endpoint: string): Promise<Type> {
    const response = await fetch(url + endpoint, { method: "HEAD" });
    return await handleResponse<Type>(response);
  }

  async function handleResponse<Type>(response: Response): Promise<Type> {
    if (!response.ok) {
      throw handleError({ type: "APIError", message: response.statusText });
    }
    const result = (await response.json()) as Type;
    return result;
  }

  return { get, post, getStatus };
}
