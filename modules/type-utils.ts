export type FilteredKeys<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type KeyValArrExtract<
  T extends ReadonlyArray<object>,
  K extends keyof T[number]
> = T[number][K];
