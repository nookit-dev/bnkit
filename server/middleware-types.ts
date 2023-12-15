export type MWNext = <MidwareConfig extends MiddlewareConfigMap>(
  data: InferMiddlewareDataMap<MidwareConfig>,
) => Promise<Response>;

export type Middleware<Res> = (request: Request, next: MWNext) => Res;

export type MiddlewareConfigMap = {
  [id: string]: Middleware<unknown>;
};
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type InferMiddlewareDataMap<T extends MiddlewareConfigMap> = {
  [K in keyof T]: UnwrapPromise<ReturnType<T[K]>>;
};
