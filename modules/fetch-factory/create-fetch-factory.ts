import { HttpMethod } from "utils/http-types";

export type FactoryMethods = keyof ReturnType<typeof createFetchFactory>;

type EventHandlerMap = { [event: string]: (ev: MessageEvent) => void };

export type APIConfig<
  TRes = any,
  TParams = any,
  TBody = any,
  THeaders extends HeadersInit = HeadersInit
> = {
  method: HttpMethod;
  endpoint: string;
  response?: TRes;
  params?: TParams;
  body?: TBody;
  headers?: THeaders;
};

export type TypeMap = {
  [endpoint: string | number]: APIConfig;
};

function appendURLParameters(
  url: string,
  params: Record<string, string> = {}
): string {
  const urlWithParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    urlWithParams.append(key, value);
  });
  return urlWithParams.toString() ? `${url}?${urlWithParams.toString()}` : url;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(JSON.stringify(response)); // adapt this to your needs
  }
  return await response.json();
}

type FileDownloadConfig = {
  endpoint: string;
  headers?: HeadersInit;
  filename?: string;
  params?: Record<string, string>;
};

type MappedApiConfig<TMap extends TypeMap> = APIConfig<
  TMap[keyof TMap]["response"],
  TMap[keyof TMap]["params"],
  TMap[keyof TMap]["body"],
  HeadersInit
>;

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
  function computeHeaders(customHeaders?: HeadersInit): HeadersInit {
    const resultHeaders = new Headers(defaultHeaders);

    if (customHeaders instanceof Headers) {
      for (const [key, value] of customHeaders.entries()) {
        resultHeaders.set(key, value);
      }
    } else if (Array.isArray(customHeaders)) {
      customHeaders.forEach(([key, value]) => {
        resultHeaders.set(key, value);
      });
    } else {
      for (const [key, value] of Object.entries(customHeaders || {})) {
        resultHeaders.set(key, value as string);
      }
    }

    return resultHeaders;
  }

  type FetchConfig<
    Endpoint extends keyof TMap,
    Method extends HttpMethod
  > = Omit<MappedApiConfig<TMap>, "response" | "method"> & {
    endpoint: Endpoint;
    method?: Method;
  };

  async function fetcher<Endpoint extends keyof TMap>(
    fetcherConfig: FetchConfig<Endpoint, HttpMethod>
  ): Promise<TMap[Endpoint]["response"]> {
    const endpointConfig = config[fetcherConfig.endpoint];
    const finalUrl = appendURLParameters(
      baseUrl + endpointConfig.endpoint,
      fetcherConfig.params
    );

    const method = endpointConfig.method;
    let bodyData = "";

    if (fetcherConfig.body) {
      bodyData = JSON.stringify(fetcherConfig.body);
    }

    const response = await fetch(finalUrl, {
      method: method.toUpperCase(),
      headers: computeHeaders(fetcherConfig.headers), // Use the new function here
      body: bodyData,
    });

    return handleResponse(response);
  }

  function createEventStream(
    endpoint: string,
    eventHandlers: EventHandlerMap
  ): EventSource {
    const url = baseUrl + endpoint;
    const es = new EventSource(url);

    es.onopen = (event) => {
      console.info("Stream opened:", event);
    };

    es.onerror = (error) => {
      console.error("Stream Error:", error);
    };

    for (const [event, handler] of Object.entries(eventHandlers)) {
      es.addEventListener(event as string, handler);
    }

    return es;
  }

  function fileDownload(config: FileDownloadConfig): void {
    if (typeof window === "undefined") return;
    const finalUrl = new URL(baseUrl + config.endpoint);
    if (config.params) {
      Object.keys(config.params).forEach((key) => {
        finalUrl.searchParams.append(key, config.params![key]);
      });
    }

    const a = document.createElement("a");
    a.href = finalUrl.toString();
    a.download = config.filename || "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return {
    fetcher,
    get: <Endpoint extends keyof TMap>(
      config: FetchConfig<Endpoint, "GET">
    ): Promise<TMap[Endpoint]["response"]> => {
      return fetcher({ ...config, method: "GET" });
    },
    post: <Endpoint extends keyof TMap>(
      fetchConfig: FetchConfig<Endpoint, "POST"> & {
        endpoint: Endpoint;
      }
    ): Promise<TMap[Endpoint]["response"]> => {
      return fetcher({ ...fetchConfig, method: "POST" }); // Add method
    },

    postForm: <Endpoint extends keyof TMap>(
      fetchConfig: FetchConfig<Endpoint, "POST"> & {
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

      return fetcher({
        ...fetchConfig,
        headers,
        method: "POST", // Add method
      });
    },

    delete: <Endpoint extends keyof TMap>(
      fetchConfig: FetchConfig<Endpoint, "DELETE"> & {
        endpoint: Endpoint;
      }
    ): Promise<TMap[Endpoint]["response"]> => {
      return fetcher({ ...fetchConfig, method: "DELETE" }); // Add method
    },

    createEventStream,
    fileDownload,
  };
}
