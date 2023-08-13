import { WebSocketHandler } from "bun";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "OPTIONS"
  | "HEAD";

export type CommonHttpHeaders =
  | "Accept"
  | "Authorization"
  | "Cache-Control"
  | "Content-Type"
  | "Date"
  | "Host"
  | "Origin"
  | "Referer"
  | "User-Agent"
  | "X-Requested-With"
  | "X-Forwarded-For"
  | "X-HTTP-Method-Override"
  | string; // This allows for custom headers in addition to the common ones.

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type UToolHTTPHeaders = PartialRecord<CommonHttpHeaders, string>;

export type RouteHandler = (request: Request) => Response | Promise<Response>;

export type ResponseBodyTypes =
  | ReadableStream
  | BlobPart
  | BlobPart[]
  | FormData
  | URLSearchParams
  | object
  | null;

export type Middleware = (
  request: Request,
  next: MiddlewareNext
) => Response | Promise<Response>;

export type MiddlewareNext = () => Response | Promise<Response>;

export interface RouteMap {
  [route: string]: RouteHandler;
}

export interface StartServerOptions {
  port?: number;
  hostname?: string;
  websocket?: WebSocketHandler;
  verbose?: boolean;
}

export interface RouteOptions {
  errorMessage?: string;
  onError?: (error: Error, request: Request) => Response | Promise<Response>;
}

export type ErrorHandler = (error: any, request: Request) => Response;

export type BaseRouteRequestType = {
  body?: any;
  params?: object;
  headers?: object;
};

export type JSONRequest = BaseRouteRequestType & {
  body: object;
};

export type CORSOptions = {
  allowedOrigins?: string[];
  allAllOrigins?: boolean;
  allowedMethods?: HttpMethod[];
  allowedHeaders?: CommonHttpHeaders[];
};
