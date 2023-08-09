import { type BaseError } from "../utils/base-error";

export type HTTPMethod = "get" | "post" | "put" | "delete";

export type FetchFactoryType<DataType> = {
  get: <GetDataType = DataType, ParamsType extends Record<string, string> = {}>(
    endpoint: string,
    params: ParamsType
  ) => Promise<{
    data: GetDataType;
    getRawResponse: () => Response;
  }>;

  post: <
    PostDataType = DataType,
    PostData = unknown,
    ParamsType extends Record<string, string> = {}
  >(config: {
    endpoint: string;
    postData?: PostData;
    headers?: HeadersInit;
    params?: ParamsType;
  }) => Promise<{
    data: PostDataType;
    getRawResponse: () => Response;
  }>;

  postJson: <
    ResponseData = DataType,
    PostData = unknown,
    ParamsType extends Record<string, string> = {}
  >(config: {
    endpoint: string;
    postData?: PostData;
    headers?: HeadersInit;
    params?: ParamsType;
  }) => Promise<{
    data: ResponseData;
    getRawResponse: () => Response;
  }>;

  postForm: (
    endpoint: string,
    formData: FormData
  ) => Promise<{
    data: DataType;
    getRawResponse: () => Response;
  }>;

  delete: (endpoint: string) => Promise<{
    data: DataType;
    getRawResponse: () => Response;
  }>;
};

export function createFetchFactory<
  DataType,
  Error extends BaseError<DataType>
>({ baseUrl, debug }: { baseUrl?: string; debug?: boolean }) {
  const baseFetcher = async <
    FetcherDataGeneric = DataType,
    ParamsType extends Record<string, string> = {}
  >({
    endpoint,
    method,
    body,
    headers,
    params,
  }: {
    method: HTTPMethod;
    endpoint: string;
    headers?: HeadersInit;
    body?: BodyInit | null;
    params?: ParamsType;
  }): Promise<{
    data: FetcherDataGeneric;
    getRawResponse: () => Response;
  }> => {
    let finalUrl = baseUrl + endpoint;

    // convert params object to url params string
    const urlWithParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      urlWithParams.append(key, value);
    });

    // add final url to urlWithParams only if it's not empty
    if (urlWithParams.toString()) {
      finalUrl += "?" + urlWithParams.toString();
    }

    console.log({
      method,
      headers,
      body,
    });

    const response = await fetch(finalUrl, {
      method,
      headers,
      body,
    });

    // TODO find better way to handle this
    if (!response.ok) {
      console.log(response);

      throw new Error(JSON.stringify(response)); // adapt this to your needs
    }

    const getResponse = () => {
      return response;
    };

    return {
      data: (await response.json()) as FetcherDataGeneric,
      getRawResponse: getResponse,
    };
  };

  return {
    // GetDataType gives the ability to override the return type of the get method,
    // or it can be set on the createFetchFactory (or not at all!)
    get: <
      GetDataType = DataType,
      ParamsType extends Record<string, string> = {}
    >({
      endpoint,
      params,
      headers,
    }: {
      endpoint: string;
      params?: ParamsType;
      headers?: HeadersInit;
    }) =>
      baseFetcher<GetDataType, ParamsType>({
        method: "get",
        endpoint,
        params,
        headers,
      }),
    post: <
      PostDataType = DataType,
      PostData = unknown,
      ParamsType extends Record<string, string> = {}
    >({
      endpoint,
      postData,
      headers,
      params,
    }: {
      endpoint: string;
      postData?: PostData;
      headers?: HeadersInit;
      params?: ParamsType;
    }) => {
      return baseFetcher<PostDataType, ParamsType>({
        method: "post",
        endpoint,
        body: JSON.stringify(postData),
        headers,
        params,
      });
    },

    postJson: <
      ResponseData = DataType,
      PostData = unknown,
      ParamsType extends Record<string, string> = {}
    >({
      endpoint,
      postData,
      headers,
      params,
    }: {
      endpoint: string;
      postData?: PostData;
      headers?: HeadersInit;
      params?: ParamsType;
    }) =>
      baseFetcher<ResponseData>({
        method: "post",
        endpoint,
        headers,
        body: JSON.stringify(postData),
        params,
      }),

    postForm: (endpoint: string, formData: FormData) =>
      baseFetcher({
        endpoint,
        body: formData,
        method: "post",
      }),
    delete: (endpoint: string) => baseFetcher({ method: "delete", endpoint }),
  };
}
