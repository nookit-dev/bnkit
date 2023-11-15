import { HttpMethod } from "../utils/http-types";

export type EventHandlerMap = { [event: string]: (ev: MessageEvent) => void };

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

export type FileDownloadConfig = {
  endpoint: string;
  headers?: HeadersInit;
  filename?: string;
  params?: Record<string, string>;
};

export type MappedApiConfig<TMap extends TypeMap> = APIConfig<
  TMap[keyof TMap]["response"],
  TMap[keyof TMap]["params"],
  TMap[keyof TMap]["body"],
  HeadersInit
>;

export type ExternalFetchConfig<
  Endpoint,
  TMap extends TypeMap,
  Method extends HttpMethod = HttpMethod
> = Omit<MappedApiConfig<TMap>, "response" | "method"> & {
  endpoint: Endpoint;
  method?: Method;
};