export type FilteredKeys<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type KeyValArrExtract<
  T extends ReadonlyArray<object>,
  K extends keyof T[number]
> = T[number][K]

export type IfFunction<T> = T extends (...args: any[]) => any ? ReturnType<T> : T;

// creates a union type of all the types in the array 
export type UnboxArray<T extends Array<any>> = T extends Array<infer U> ? U : never;

