// useFetcher.ts
import { FetchOptions, createFetcher } from "@instant-bun/instant-bun/fetcher";
import { useCallback, useState } from "react";

export function useFetcher(options: FetchOptions) {
  const fetcher = createFetcher(options);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function get<Type>(endpoint: string): Promise<void> {
    setStatus("loading");
    try {
      const result = await fetcher.get<Type>(endpoint);
      setData(result);
      setStatus("success");
    } catch (error) {
      setError(error);
      setStatus("error");
      throw error;
    }
  }

  async function post<Type>(endpoint: string, params: any): Promise<void> {
    setStatus("loading");
    try {
      const result = await fetcher.post<Type>(endpoint, params);
      setData(result);
      setStatus("success");
    } catch (error) {
      setError(error);
      setStatus("error");
      throw error;
    }
  }

  async function getStatus<Type>(endpoint: string): Promise<void> {
    setStatus("loading");
    try {
      const result = await fetcher.getStatus<Type>(endpoint);
      setData(result);
      setStatus("success");
    } catch (error) {
      setError(error);
      setStatus("error");
      throw error;
    }
  }

  const getData = useCallback(() => {
    return data;
  }, [data]);

  return { get, post, getStatus, getData, error, status };
}
