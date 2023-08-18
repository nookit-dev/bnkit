import { HttpMethod } from "utils/http-types";

export type FactoryMethods = keyof ReturnType<typeof createFetchFactory>;

type EventHandlerMap = { [event: string]: (ev: MessageEvent) => void };

export type EndpointConfig<
  TRes = any,
  TParams = any,
  TBody = any,
  THeaders extends HeadersInit = HeadersInit
> = {
  method: HttpMethod;
  response?: TRes;
  params?: TParams;
  body?: TBody;
  headers?: THeaders;
};

export type TypeMap = {
  [endpoint: string | number]: EndpointConfig;
};

export type FetchConfig<
  TMap extends TypeMap,
  Method extends HttpMethod,
  Endpoint extends keyof TMap
> = {
  method: Method;
  endpoint: Endpoint;
  headers?: HeadersInit;
} & (Method extends "GET" | "DELETE"
  ? {
      params?: TMap[Endpoint]["params"];
    }
  : {
      body?: TMap[Endpoint]["body"];
      params?: TMap[Endpoint]["params"];
    });

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

export function createFetchFactory<TMap extends TypeMap>({
  baseUrl = "",
  config,
  debug = false,
}: {
  baseUrl?: string;
  debug?: boolean;
  config: Record<
    keyof TMap,
    FetchConfig<TMap, TMap[keyof TMap]["method"], keyof TMap>
  >;
}) {
  async function fetcher<Endpoint extends keyof TMap>(
    fetcherConfig: Omit<
      FetchConfig<TMap, TMap[Endpoint]["method"], Endpoint>,
      "method" | "endpoint"
    >
  ): Promise<TMap[Endpoint]["response"]> {
    const endpointConfig = config[fetcherConfig.endpoint];
    const finalUrl = appendURLParameters(
      baseUrl + (endpointConfig.endpoint as string),
      fetcherConfig.params
    );

    const method = endpointConfig.method || "GET";
    let bodyData = "";

    if ("body" in fetcherConfig && fetcherConfig.body) {
      bodyData = JSON.stringify(fetcherConfig.body);
    }

    const response = await fetch(finalUrl, {
      method: method.toUpperCase(),
      headers: fetcherConfig.headers,
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
      console.log("Stream opened:", event);
    };

    es.onerror = (error) => {
      console.error("Stream Error:", error);
    };

    for (const [event, handler] of Object.entries(eventHandlers)) {
      es.addEventListener(event as string, handler);
    }

    return es;
  }

  type FileDownloadConfig = {
    endpoint: string;
    headers?: HeadersInit;
    filename?: string;
    params?: Record<string, string>;
  };

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
      config: Omit<FetchConfig<TMap, "GET", Endpoint>, "method">
    ): Promise<TMap[Endpoint]["response"]> => {
      return fetcher(config);
    },
    post: <Endpoint extends keyof TMap>(
      config: Omit<FetchConfig<TMap, "POST", Endpoint>, "method">
    ): Promise<TMap[Endpoint]["response"]> => {
      return fetcher(config);
    },
    postForm: <Endpoint extends keyof TMap>(
      endpoint: Endpoint,
      config: Omit<FetchConfig<TMap, "POST", Endpoint>, "method" | "endpoint">
    ): Promise<TMap[Endpoint]["response"]> => {
      const defaultContentType = config.boundary
        ? `multipart/form-data; boundary=${config.boundary}`
        : "multipart/form-data";

      const headers = {
        "Content-Type": defaultContentType,
        ...config.headers,
      };

      return fetcher({
        ...config,
        endpoint,
        method: "POST",
        headers,
      });
    },
    delete: <Endpoint extends keyof TMap>(
      endpoint: Endpoint,
      config: FetchConfig<TMap, "DELETE", Endpoint>
    ): Promise<TMap[Endpoint]["response"]> => {
      return fetcher({ ...config, method: "DELETE", endpoint });
    },
    createEventStream,
    fileDownload,
  };
}
