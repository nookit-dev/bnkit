import { defaultErrorHandler } from "instant-bun/modules/error-handler-factory/default-error-handler";
import { createFetchFactory } from "instant-bun/modules/fetch-factory";
import { useCallback, useMemo, useState } from "react";

type FetchFactoryParams = Parameters<typeof createFetchFactory>[0];

export function useFetcher<ResponseData>({
  options,
  fetchFactory,
}: {
  options?: FetchFactoryParams;
  fetchFactory?: ReturnType<typeof createFetchFactory>;
} = {}) {
  if (!fetchFactory && !options) {
    throw new Error("fetchFactory and options are required");
  }

  const fetcher = fetchFactory
    ? fetchFactory
    : createFetchFactory(
        options
          ? options
          : {
              // @ts-ignore TODO: fix ts issues in createFetchFactory
              errorHandler: defaultErrorHandler,
            }
      );

  const [data, setData] = useState<ResponseData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  // last updated is a unix timestamp of the last time the data was received
  const [lastUpdated, setLastedUpdate] = useState<number | null>();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function get(endpoint: string): Promise<void> {
    setStatus("loading");
    try {
      const result = await fetcher.get<ResponseData>(endpoint);
      setData(result.data);
      setLastedUpdate(Date.now());
      setStatus("success");
    } catch (error) {
      setError(error);
      setStatus("error");
      throw error;
    }
  }

  async function post(endpoint: string, params: any): Promise<void> {
    setStatus("loading");
    try {
      const result = await fetcher.postJson<ResponseData>({
        endpoint,
        params,
      });
      setData(result?.data || null);
      setLastedUpdate(Date.now());
      setStatus("success");
    } catch (error) {
      setError(error?.data);
      setStatus("error");
      throw error;
    }
  }

  const getData = useCallback(() => {
    return data;
  }, [data]);

  const useData = () => {
    return useMemo(() => {
      return getData();
    }, [lastUpdated]);
  };

  return { get, post, getData, error, status, lastUpdated, useData  };
}
