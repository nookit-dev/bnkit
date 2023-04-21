import { handleError } from "error-handler-validation";

// fetcher.ts
export type FetchOptions = {
  baseUrl: string;
};

export function createFetcher({ baseUrl }: FetchOptions) {
  async function get<Type>(endpoint: string): Promise<Type> {
    const response = await fetch(baseUrl + endpoint);
    return await handleResponse<Type>(response);
  }

  async function post<Type>({
    endpoint,
    params,
    headers,
  }: {
    endpoint?: string;
    params?: any;
    headers?: Record<string, any>;
  }): Promise<Type> {
    const response = await fetch(baseUrl + (endpoint || ""), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(params),
    });
    return await handleResponse<Type>(response);
  }

  async function getStatus<Type>(endpoint: string): Promise<Type> {
    const response = await fetch(baseUrl + endpoint, { method: "HEAD" });
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
