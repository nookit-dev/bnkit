import {
  createFetchFactory,
  FetchFactoryType,
  HTTPMethod,
} from "instant-bun/modules/fetch-factory/create-fetch-factory";
import { useCallback, useMemo, useState } from "react";

type RequestStatus = "idle" | "loading" | "success" | "error" | "no data";

export type FetcherConfig<
  ResponseType,
  BodyType = undefined,
  ParamsType = undefined
> = {
  body?: BodyType;
  params?: ParamsType;
  response: ResponseType;
};

export type FetcherState<ResponseType> = {
  data: ResponseType | null;
  lastUpdated: number | null;
  status: RequestStatus;
  error: Error | null;
};

export type FetcherReturnType<DataType extends FetcherConfig<any, any, any>> = {
  data: DataType["response"] | null;
  lastUpdated: number | null;
  status: RequestStatus;
  error: Error | null;
  get: (params?: DataType["params"]) => Promise<void>;
  post: (data?: DataType["body"], params?: DataType["params"]) => Promise<void>;
};

export type Fetchers<
  DataTypeMap extends Record<string, FetcherConfig<any, any, any>>
> = {
  [K in keyof DataTypeMap]: () => FetcherReturnType<DataTypeMap[K]>;
};

export type EndpointConfig<
  DataTypeMap extends Record<string, FetcherConfig<any, any, any>>,
  K extends keyof DataTypeMap
> = {
  endpoint: K;
  method: HTTPMethod;
  body?: DataTypeMap[K]["body"];
  params?: DataTypeMap[K]["params"];
};

export type FetchFactoryConfig<
  DataTypeMap extends Record<string, FetcherConfig<any, any, any>>
> = {
  baseUrl?: string;
  logMode?: boolean;
  endpoints: Array<EndpointConfig<DataTypeMap, keyof DataTypeMap>>;
  defaultHeaders?: Record<string, string>;
};

export function createFetcher<DataType extends FetcherConfig<any, any, any>>(
  fetchFactory: FetchFactoryType<DataType>,
  endpointConfig: EndpointConfig<any, keyof DataType>,
  defaultHeaders?: Record<string, string>
): () => FetcherReturnType<DataType> {
  const [state, setState] = useState<FetcherState<DataType["response"]>>({
    data: null,
    lastUpdated: null,
    status: "idle",
    error: null,
  });

  // TODO implement abort controller
  // const abortController = new AbortController();

  const fetchData = useCallback(
    async (
      method: HTTPMethod,
      body?: DataType["body"],
      params?: DataType["params"]
    ) => {
      setState((prevState) => ({ ...prevState, status: "loading" }));
      try {
        let result;
        switch (method) {
          case "get":
            result = await fetchFactory.get(
              endpointConfig.endpoint as string,
              endpointConfig.params || params
            );
            break;
          case "post":
            result = await fetchFactory.post({
              endpoint: endpointConfig.endpoint as string,
              postData: endpointConfig.body || body,
              params: endpointConfig.params || params,
              headers: defaultHeaders,
            });
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        setState({
          data: result.data,
          lastUpdated: Date.now(),
          status: "success",
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          lastUpdated: null,
          status: "error",
          error: error as Error,
        });
      }
    },
    [fetchFactory, endpointConfig, defaultHeaders]
  );

  const get = useCallback(
    (params?: DataType["params"]) => fetchData("get", undefined, params),
    [fetchData]
  );

  const post = useCallback(
    (data?: DataType["body"], params?: DataType["params"]) =>
      fetchData("post", data, params),
    [fetchData]
  );

  return () => ({
    ...state,
    get,
    post,
  });
}

export function useApiFactory<
  DataTypeMap extends Record<string, FetcherConfig<any, any, any>>
>(config: FetchFactoryConfig<DataTypeMap>): Fetchers<DataTypeMap> {
  const fetchFactory = useMemo(() => createFetchFactory(config), [config]);

  const fetchers = useMemo(() => {
    const fetcherFns: Partial<Fetchers<DataTypeMap>> = {};
    config.endpoints.forEach((endpointConfig) => {
      fetcherFns[endpointConfig.endpoint] = createFetcher(
        fetchFactory,
        endpointConfig,
        config.defaultHeaders
      );
    });
    return fetcherFns as Fetchers<DataTypeMap>;
  }, [config, fetchFactory]);

  return fetchers;
}
