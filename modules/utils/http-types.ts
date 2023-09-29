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

export type ResBodyT =
  | ReadableStream
  | BlobPart
  | BlobPart[]
  | FormData
  | URLSearchParams
  | object
  | null;

// Give middleware ability to carry state context which cookie middlewares other other middlewares would have access to
// make it typed of course, maybe change the middleware params to an object like so:
// {
//   request: Request;
//   next: MiddlewareNext;
//   context: T;
//   // future stuff
// }
// for example we could create a middleware and react plugin that pass along state on each request
export type Middleware<TContext extends object = object> = ({
  request,
  next,
  context,
}: {
  request: Request;
  next: MiddlewareNext<TContext>;
  context?: TContext;
}) => Response | Promise<Response>;

export type MiddlewareNext<TContext extends object = object> = (
  context?: TContext
) => Response | Promise<Response>;

export interface RouteMap {
  [route: string]: RouteHandler;
}

export interface RouteOptions {
  errorMessage?: string;
  onError?: (error: Error, request: Request) => Response | Promise<Response>;
}

export type ErrorHandler = (error: any, request: Request) => Response;

export type RouteReqT = {
  body?: any;
  params?: object;
  headers?: object;
};

export type JSONRequest = RouteReqT & {
  body: object;
};

export type CORSOptions = {
  origins?: string[];
  methods?: HttpMethod[];
  headers?: CommonHttpHeaders[];
};

export type CreateServerFactory = {
  wsPaths?: string[];
  enableBodyParser?: boolean;
  cors?: CORSOptions;
  // max file size in bytes, if passed in then the check file middleware will be passed in
  // to validate file sizes
  maxFileSize?: number;
};

export type CreateRouteGeneric<
  ReqT extends RouteReqT,
  ResT extends ResBodyT
> = {
  request: Request;
  getBody: <BodyType extends ReqT["body"]>() => Promise<BodyType>;
  parseQueryParams: <ParamsType>() => ParamsType;
  parseHeaders: <HeadersType>() => HeadersType;
  jsonRes: <JSONBodyGeneric extends object>(
    body: JSONBodyGeneric,
    options?: ResponseInit
  ) => Response;
  htmlRes: (body: string, options?: ResponseInit) => Response;
};

export type OnRequestHandler<ReqT extends RouteReqT, ResT extends ResBodyT> = (
  args: CreateRouteGeneric<ReqT, ResT>
) => Promise<Response>;

export type OnRequestType<ReqT extends RouteReqT, ResT extends ResBodyT> = (
  handler: OnRequestHandler<ReqT, ResT>
) => void;
