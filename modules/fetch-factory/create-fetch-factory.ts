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
  const baseFetcher = async ({
    endpoint,
    method,
    body,
    headers,
    params,
  }: {
    method: HTTPMethod;
    endpoint: string;
    headers?: HeadersInit;
    body?: BodyInit;
    params?: Record<string, string>;
  }): Promise<Response> => {
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

    return response;
  };

  return {
    // GetDataType gives the ability to override the return type of the get method,
    // or it can be set on the createFetchFactory (or not at all!)
    get: async <
      GetDataType = DataType,
      ParamsType extends Record<string, string> = {}
    >({
      endpoint,
      params,
      headers,
    }: // TODO: add optional data validator
    // TODO: ADD optional params and headers validator
    {
      endpoint: string;
      params?: ParamsType;
      headers?: HeadersInit;
    }) => {
      const response = await baseFetcher({
        method: "get",
        endpoint,
        params,
        headers,
      });

      const data = (await response.json()) as GetDataType;

      return {
        data,
        getRawResponse: () => response,
      };
    },
    post: async <
      ResponseData = DataType,
      PostData = unknown,
      ParamsType extends Record<string, string> = {}
    >({
      endpoint,
      postData,
      headers = {
        "Content-Type": "application/json",
      },
      params,
    }: {
      endpoint: string;
      postData?: PostData;
      headers?: HeadersInit;
      params?: ParamsType;
    }) => {
      const response = await baseFetcher({
        method: "post",
        endpoint,
        body: JSON.stringify(postData),
        headers,
        params,
      });

      // add options for handling other formats?
      const data = response.json() as ResponseData;

      return {
        data,
        getRawResponse: () => response,
      };
    },

    postForm: async ({
      endpoint,
      formData,
      params,
    }: {
      endpoint: string;
      formData: FormData;
      params?: Record<string, string>;
    }) =>
      baseFetcher({
        endpoint,
        body: formData,
        method: "post",
        params,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    delete: async <
      ReponseData,
      ParamsType extends Record<string, string> = {}
    >({
      endpoint,
    }: {
      endpoint: string;
      params?: ParamsType;
      headers?: HeadersInit;
    }) => {
      const response = await baseFetcher({ method: "delete", endpoint });

      const data = response.json() as ReponseData;

      return {
        data,
        getRawResponse: () => response,
      };
    },
  };
}
