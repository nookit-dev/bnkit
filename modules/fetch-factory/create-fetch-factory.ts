import { HttpMethod } from "utils/http-types";
import { type BaseError } from "../utils/base-error";
export type FetchConfig<
  DataT = unknown,
  ParamsT extends Record<string, string> = {}
> = {
  endpoint: string;
  bodyData?: DataT;
  headers?: HeadersInit;
  params?: ParamsT;
};

type EventHandlerMap = {
  [eventName: string]: (event: MessageEvent) => void;
};

type FormFetchConfig<DataT = unknown> = FetchConfig<DataT> & {
  boundary?: string;
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

export function createFetchFactory({
  baseUrl = "",
  debug = false,
}: {
  baseUrl?: string;
  debug?: boolean;
}) {
  async function fetcher<ResponseType>(
    config: FetchConfig,
    method: HttpMethod
  ): Promise<ResponseType> {
    const finalUrl = appendURLParameters(
      baseUrl + config.endpoint,
      config.params
    );

    const response = await fetch(finalUrl, {
      method: method.toUpperCase() as HttpMethod,
      headers: config.headers,
      body: ["GET", "DELETE"].includes(method.toUpperCase())
        ? undefined
        : JSON.stringify(config.bodyData),
    });

    return handleResponse<ResponseType>(response);
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
      es.addEventListener(event, handler);
    }

    return es;
  }

  type FileDownloadConfig = {
    endpoint: string;
    headers?: HeadersInit;
    filename?: string; // Optional desired filename for the downloaded file
    params?: Record<string, string>; // Optional query parameters
  };

  function fileDownload(config: FileDownloadConfig): void {
    // this is a client side only function
    if (typeof window === "undefined") return;
    const finalUrl = new URL(baseUrl + config.endpoint);
    if (config.params) {
      Object.keys(config.params).forEach((key) => {
        finalUrl.searchParams.append(key, config.params![key]);
      });
    }

    const a = document.createElement("a");
    a.href = finalUrl.toString();
    a.download = config.filename || ""; // The 'download' attribute can be used to set a specific filename.
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return {
    fetcher,
    get: <GetDataT, ParamsT extends Record<string, string> = {}>(
      config: FetchConfig<undefined, ParamsT>
    ): Promise<GetDataT> => {
      return fetcher<GetDataT>(config, "GET");
    },
    post: <
      PostDataT,
      PostData = unknown,
      ParamsT extends Record<string, string> = {}
    >(
      config: FetchConfig<PostData, ParamsT>
    ): Promise<PostDataT> => {
      return fetcher<PostDataT>(
        {
          ...config,
          headers: { ...config.headers, "Content-Type": "application/json" },
        },
        "POST"
      );
    },
    postForm: <FormDataT>(
      config: FormFetchConfig<FormData>
    ): Promise<FormDataT> => {
      const defaultContentType = config.boundary
        ? `multipart/form-data; boundary=${config.boundary}`
        : "multipart/form-data";

      const headers = {
        "Content-Type": defaultContentType,
        ...config.headers, // Overriding headers if any are provided in config
      };

      return fetcher<FormDataT>({ ...config, headers }, "POST");
    },

    delete: <DeleteDataT, ParamsT extends Record<string, string> = {}>(
      config: FetchConfig<undefined, ParamsT>
    ): Promise<DeleteDataT> => {
      return fetcher<DeleteDataT>(config, "DELETE");
    },
    createEventStream,
    fileDownload,
  };
}
