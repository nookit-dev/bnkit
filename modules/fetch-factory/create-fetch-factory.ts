import { type BaseError } from "../utils/base-error";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export function createFetchFactory<
  DataType,
  Error extends BaseError<DataType>
>({ baseUrl, logMode }: { baseUrl?: string; logMode?: boolean }) {
  const baseFetcher = async <FetcherDataGeneric = DataType>(
    method: HTTPMethod,
    endpoint: string,
    headers?: HeadersInit,
    body?: BodyInit | null
  ): Promise<{
    data: FetcherDataGeneric;
    getRawResponse: () => Response;
  }> => {
    const finalUrl = baseUrl + endpoint;

    const response = await fetch(finalUrl, {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error("API_ERROR"); // adapt this to your needs
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
    get: <GetDataType = DataType>(endpoint: string) =>
      baseFetcher<GetDataType>("GET", endpoint),

    postJson: <ResponseData = DataType, PostData = unknown>({
      endpoint,
      postData,
      headers,
      params,
    }: {
      endpoint: string;
      postData?: PostData;
      headers?: HeadersInit;
      params?: any;
    }) =>
      baseFetcher<ResponseData>(
        "POST",
        endpoint,
        { "Content-Type": "application/json", ...headers },
        JSON.stringify(postData)
      ),

    postForm: (endpoint: string, formData: FormData) =>
      baseFetcher("POST", endpoint, undefined, formData),

    put: <D = unknown>(endpoint: string, data: D) =>
      baseFetcher(
        "PUT",
        endpoint,
        { "Content-Type": "application/json" },
        JSON.stringify(data)
      ),

    delete: (endpoint: string) => baseFetcher("DELETE", endpoint),
  };
}
