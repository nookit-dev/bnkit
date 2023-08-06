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

  const fetcher = useMemo(
    () =>
      fetchFactory ? fetchFactory : createFetchFactory(options ? options : {}),
    [options]
  );

  const [data, setData] = useState<ResponseData | null>(null);
  // last updated is a unix timestamp of the last time the data was received
  const [lastUpdated, setLastedUpdate] = useState<number | null>();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "no data"
  >("idle");

  async function get(endpoint: string): Promise<void> {
    setStatus("loading");
    try {
      const result = await fetcher.get<ResponseData>(endpoint);
      setData(result.data);
      setLastedUpdate(Date.now());
      setStatus("success");
    } catch (error) {
      setStatus("error");
      throw error;
    }
  }

  async function post<PostData extends object, Params extends object>({
    data,
    endpoint,
    params,
  }: {
    endpoint: string;
    data: PostData;
    params: Params;
  }): Promise<void> {
    setStatus("loading");
    try {
      const result = await fetcher.postJson<ResponseData>({
        postData: data,
        endpoint,
        params,
      });
      setData(result?.data || null);
      setLastedUpdate(Date.now());
      setStatus("success");
    } catch (error) {
      setStatus("error");
      throw error;
    }
  }

  async function postJSON<PostData>(
    endpoint: string,
    data: PostData
  ): Promise<void> {
    setStatus("loading");
    try {
      const result = await fetcher.postJson<ResponseData>({
        endpoint,
        postData: data,
      });
      if (result.data) {
        setData(result?.data || null);
        setLastedUpdate(Date.now());
        setStatus("success");
      } else {
        setStatus("no data");
      }
    } catch (error) {
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

  return { get, post, getData, status, lastUpdated, useData, postJSON };
}
