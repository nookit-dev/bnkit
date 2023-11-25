declare var window: any;
declare var document: {
  createElement: any;
  body: {
    appendChild: any;
    removeChild: any;
  };
};
import { HttpMethod } from "../utils/http-types";
import { ExternalFetchConfig, MappedApiConfig, TypeMap } from "./fetch-types";
import {
    computeHeaders,
    createEventStream,
    fetcher,
    fileDownload,
} from "./fetch-utils";

export type FactoryMethods = keyof ReturnType<typeof createFetchFactory>;

export function createFetchFactory<TMap extends TypeMap>({
  baseUrl = "",
  config,
  defaultHeaders,
  debug = false,
}: {
  baseUrl?: string;
  debug?: boolean;
  config: Record<keyof TMap, MappedApiConfig<TMap>>;
  defaultHeaders?: Headers; // Headers can be strings or functions returning strings
}) {
  return {
    fetcher: <Endpoint extends keyof TMap>(
      fetcherConfig: ExternalFetchConfig<Endpoint, TMap, HttpMethod>
    ): Promise<TMap[Endpoint]["response"]> => {
      const headers = computeHeaders(
        defaultHeaders || {},
        fetcherConfig.headers || {}
      );

      return fetcher(
        {
          ...fetcherConfig,
          headers,
          method: fetcherConfig.method || "get",
        },
        config,
        baseUrl
      );
    },
    get: <Endpoint extends keyof TMap>(
      fetcherConfig: ExternalFetchConfig<Endpoint, TMap, "get">
    ): Promise<TMap[Endpoint]["response"]> => {
      const headers = computeHeaders(
        defaultHeaders || {},
        fetcherConfig.headers || {}
      );

      return fetcher(
        {
          ...fetcherConfig,
          headers,
          method: "get",
        },
        config,
        baseUrl
      );
    },
    post: <Endpoint extends keyof TMap>(
      fetchConfig: ExternalFetchConfig<Endpoint, TMap, "post"> & {
        endpoint: Endpoint;
      }
    ): Promise<TMap[Endpoint]["response"]> => {
      const headers = computeHeaders(
        defaultHeaders || {},
        fetchConfig.headers || {}
      );

      return fetcher(
        { ...fetchConfig, headers, method: "post" },
        config,
        baseUrl
      );
    },

    postForm: <Endpoint extends keyof TMap>(
      fetchConfig: ExternalFetchConfig<Endpoint, TMap, "post"> & {
        endpoint: Endpoint;
        boundary?: string;
      }
    ): Promise<TMap[Endpoint]["response"]> => {
      const defaultContentType = fetchConfig.boundary
        ? `multipart/form-data; boundary=${fetchConfig.boundary}`
        : "multipart/form-data";

      const formHeaders = {
        "Content-Type": defaultContentType,
        ...fetchConfig.headers,
      };
      const headers = computeHeaders(defaultHeaders || {}, formHeaders || {});

      return fetcher(
        {
          ...fetchConfig,
          headers,
          method: "post",
        },
        config,
        baseUrl
      );
    },

    delete: <Endpoint extends keyof TMap>(
      fetchConfig: ExternalFetchConfig<Endpoint, TMap, "delete"> & {
        endpoint: Endpoint;
      }
    ): Promise<TMap[Endpoint]["response"]> => {
      const headers = computeHeaders(
        defaultHeaders || {},
        fetchConfig.headers || {}
      );
      return fetcher(
        { ...fetchConfig, headers, method: "delete" },
        config,
        baseUrl
      );
    },
    createEventStream,
    fileDownload,
  };
}
