import {
  createFetchFactory,
  FetchFactoryType,
} from "@u-tools/core/modules/fetch-factory/create-fetch-factory";
import { useCallback, useMemo, useState } from "react";
import { HttpMethod } from "utils/http-types";

type RequestStatus = "idle" | "loading" | "success" | "error" | "no data";

export type FetcherConfig<
  ResponseType,
  BodyType = undefined,
  HeadersType = undefined,
  ParamsType = undefined
> = {
  body?: BodyType;
  params?: ParamsType;
  response: ResponseType;
  headers?: HeadersType;
};

type FetchDataConfigMap = Record<string, FetcherConfig<any, any, any>>;

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

export type Fetchers<DataTypeMap extends FetchDataConfigMap> = {
  [K in keyof DataTypeMap]: () => FetcherReturnType<DataTypeMap[K]>;
};

export type EndpointConfig<
  DataTypeMap extends FetchDataConfigMap,
  K extends keyof DataTypeMap
> = {
  endpoint: K;
  method: HttpMethod;
  body?: DataTypeMap[K]["body"];
  params?: DataTypeMap[K]["params"];
  headers?: DataTypeMap[K]["headers"];
};

export type FetchFactoryConfig<DataTypeMap extends FetchDataConfigMap> = {
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
  console.log({
    fetchFactory: "init",
  });

  const fetchData = useCallback(
    async (
      {
        method,
        body,
        params,
        headers,
      }: {
        method: HttpMethod;
        body?: DataType["body"];
        params?: DataType["params"];
        headers?: Record<string, string>;
      } = {
        method: "GET",
        body: null,
        params: undefined,
      }
    ) => {
      setState((prevState) => ({ ...prevState, status: "loading" }));
      try {
        console.log({ defaultHeaders, headers });
        let result;
        switch (method) {
          case "GET":
            result = await fetchFactory.get(
              endpointConfig.endpoint as string,
              endpointConfig.params || params
            );
            break;
          case "POST":
            result = await fetchFactory.post({
              endpoint: endpointConfig.endpoint as string,
              postData: endpointConfig.body || body,
              params: endpointConfig.params || params,
              headers: defaultHeaders
                ? {
                    "Content-Type": "application/json",
                    ...defaultHeaders,
                    ...headers,
                  }
                : headers,
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
    (params?: DataType["params"]) => fetchData({ method: "GET", params }),
    [fetchData]
  );

  const post = useCallback(
    (data?: DataType["body"], params?: DataType["params"]) =>
      fetchData({ method: "POST", body: data, params }),
    [fetchData]
  );

  return () => ({
    ...state,
    get,
    post,
  });
}

export function useApiFactory<DataTypeMap extends FetchDataConfigMap>(
  config: FetchFactoryConfig<DataTypeMap>
): Fetchers<DataTypeMap> {
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
