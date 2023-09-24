declare var window: any;
declare var document: {
  createElement: any;
  body: {
    appendChild: any;
    removeChild: any;
  };
};
import { HttpMethod } from "../utils/http-types";
import {
  ExternalFetchConfig,
  MappedApiConfig,
  TypeMap,
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
  defaultHeaders?: HeadersInit; // Headers can be strings or functions returning strings
}) {
  return {
    fetcher: <Endpoint extends keyof TMap>(
      fetcherConfig: ExternalFetchConfig<Endpoint, TMap, HttpMethod>
    ): Promise<TMap[Endpoint]["response"]> => {
      return fetcher(
        {
          ...fetcherConfig,
          method: fetcherConfig.method || "GET",
        },
        config,
        baseUrl
      );
    },
    get: <Endpoint extends keyof TMap>(
      fetcherConfig: ExternalFetchConfig<Endpoint, TMap, "GET">
    ): Promise<TMap[Endpoint]["response"]> => {
      return fetcher(
        {
          ...fetcherConfig,
          method: "GET",
        },
        config,
        baseUrl
      );
    },
    post: <Endpoint extends keyof TMap>(
      fetchConfig: ExternalFetchConfig<Endpoint, TMap, "POST"> & {
        endpoint: Endpoint;
      }
    ): Promise<TMap[Endpoint]["response"]> => {
      return fetcher({ ...fetchConfig, method: "POST" }, config, baseUrl); // Add method
    },

    postForm: <Endpoint extends keyof TMap>(
      fetchConfig: ExternalFetchConfig<Endpoint, TMap, "POST"> & {
        endpoint: Endpoint;
        boundary?: string;
      }
    ): Promise<TMap[Endpoint]["response"]> => {
      const defaultContentType = fetchConfig.boundary
        ? `multipart/form-data; boundary=${fetchConfig.boundary}`
        : "multipart/form-data";

      const headers = {
        "Content-Type": defaultContentType,
        ...fetchConfig.headers,
      };

      return fetcher(
        {
          ...fetchConfig,
          headers,
          method: "POST", // Add method
        },
        config,
        baseUrl
      );
    },

    delete: <Endpoint extends keyof TMap>(
      fetchConfig: ExternalFetchConfig<Endpoint, TMap, "DELETE"> & {
        endpoint: Endpoint;
      }
    ): Promise<TMap[Endpoint]["response"]> => {
      return fetcher({ ...fetchConfig, method: "DELETE" }, config, baseUrl); // Add method
    },
    createEventStream,
    fileDownload,
  };
}
