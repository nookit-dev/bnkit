export type Middleware<Opts extends object, Res extends any> = (
  request: Request,
  opts?: Opts
) => Res;

export type MiddlewareConfigMap = {
  [id: string]: Middleware<any, any>;
};
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type InferMiddlewareDataMap<T extends MiddlewareConfigMap> = {
  [K in keyof T]: UnwrapPromise<ReturnType<T[K]>>;
};
