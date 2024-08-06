export type NextFunction = (error?: Error) => Promise<void>

export type Middleware<Res extends unknown> = (request: Request, next: NextFunction) => Res | Promise<Res>

export type MiddlewareConfigMap = {
  [id: string]: Middleware<unknown>
}
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export type InferMiddlewareDataMap<T extends MiddlewareConfigMap> = {
  [K in keyof T]: UnwrapPromise<ReturnType<T[K]>>
}
