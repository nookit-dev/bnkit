import { PartialRecord } from "mod/type-utils";

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

export type UToolHTTPHeaders = PartialRecord<CommonHttpHeaders, string>;

export type RouteHandler = (request: Request) => Response | Promise<Response>;

export type MiddlwareParams<CtxT extends object = object> = {
  request: Request;
  next?: Middleware<CtxT>;
  context?: CtxT;
  response: Response;
};

export type Middleware<CtxT extends object = object> = ({
  request,
  next,
  context,
  response,
}: MiddlwareParams<CtxT>) => Response | Promise<Response>;

export type RouteMap = Record<string, RouteHandler>;

export type ErrorHandler = (error: any, request: Request) => Response;

export type RouteReqT = {
  body?: Request["body"];
  params?: object;
  headers?: object;
};

export type CORSOptions = {
  origins?: string[];
  methods?: HttpMethod[];
  headers?: CommonHttpHeaders[];
};

export type CreateRouteGeneric<ReqT extends RouteReqT> = {
  request: Request;
  parseBodyJson: <BodyType extends ReqT["body"]>() => Promise<BodyType>;
  parseQueryParams: <ParamsType>() => ParamsType;
  parseHeaders: <HeadersT>() => HeadersT;
  response: Response;
};

export type ReqHandler<ReqT extends RouteReqT> = (
  args: CreateRouteGeneric<ReqT>
) => Promise<Response>;

export type OnRequestT<ReqT extends RouteReqT> = (
  handler: ReqHandler<ReqT>
) => void;

export interface RouteOptions {
  errorMessage?: string;
  onError?: (error: Error, request: Request) => Response | Promise<Response>;
}
